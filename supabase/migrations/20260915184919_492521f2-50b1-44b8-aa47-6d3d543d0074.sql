
-- 1. Permission matrix editable by super admins
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  area text NOT NULL,
  level text NOT NULL DEFAULT 'none',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (role, area)
);

GRANT SELECT ON public.role_permissions TO authenticated;
GRANT ALL ON public.role_permissions TO service_role;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can read role permissions" ON public.role_permissions;
CREATE POLICY "Staff can read role permissions"
ON public.role_permissions FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

DROP TRIGGER IF EXISTS set_updated_at ON public.role_permissions;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.role_permissions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.role_permissions (role, area, level, position)
SELECT r.role, a.area,
  CASE
    WHEN r.role = 'super_admin' THEN 'Full control'
    WHEN r.role = 'admin' AND a.area = 'Staff approvals & roles' THEN 'Editors & sales only'
    WHEN r.role = 'admin' THEN 'Full control'
    WHEN r.role = 'editor' AND a.area IN ('Vehicles & media','Website content','Marketing tools') THEN 'Create & edit'
    WHEN r.role = 'editor' AND a.area = 'Analytics' THEN 'View only'
    WHEN r.role = 'editor' AND a.area = 'Leads, appointments, financing' THEN 'View only'
    WHEN r.role = 'sales' AND a.area = 'Leads, appointments, financing' THEN 'Full control'
    WHEN r.role = 'sales' AND a.area IN ('Vehicles & media','Analytics','Financing calculator') THEN 'View only'
    ELSE 'No access'
  END,
  a.pos
FROM (VALUES ('super_admin'::public.app_role),('admin'),('editor'),('sales')) AS r(role)
CROSS JOIN (VALUES
  ('Vehicles & media', 1),
  ('Website content', 2),
  ('Leads, appointments, financing', 3),
  ('Financing calculator', 4),
  ('Marketing tools', 5),
  ('Analytics', 6),
  ('Site settings & branding', 7),
  ('Staff approvals & roles', 8)
) AS a(area, pos)
ON CONFLICT (role, area) DO NOTHING;

UPDATE public.role_permissions SET level = 'Full control'
WHERE role IN ('super_admin','admin') AND area IN ('Financing calculator','Marketing tools');

CREATE OR REPLACE FUNCTION public.set_role_permission(target_role public.app_role, target_area text, new_level text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE me app_role;
BEGIN
  me := public.get_my_staff_role();
  IF me IS DISTINCT FROM 'super_admin' THEN
    RAISE EXCEPTION 'Only a super admin can change role permissions';
  END IF;
  IF target_role = 'super_admin' THEN
    RAISE EXCEPTION 'Super admin permissions cannot be changed';
  END IF;
  IF new_level NOT IN ('Full control','Create & edit','View only','No access','Editors & sales only') THEN
    RAISE EXCEPTION 'Unknown permission level';
  END IF;

  INSERT INTO public.role_permissions (role, area, level)
  VALUES (target_role, target_area, new_level)
  ON CONFLICT (role, area) DO UPDATE SET level = EXCLUDED.level, updated_at = now();

  INSERT INTO public.staff_activity (user_id, email, action, entity, entity_id, detail)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'permission.changed', 'role', target_role::text,
          target_area || ' -> ' || new_level);
END $$;

REVOKE ALL ON FUNCTION public.set_role_permission(public.app_role, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_role_permission(public.app_role, text, text) TO authenticated;

-- 2. Cap super admins at three
CREATE OR REPLACE FUNCTION public.enforce_super_admin_cap()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE total integer;
BEGIN
  IF NEW.role = 'super_admin' THEN
    SELECT count(*) INTO total FROM public.admin_allowlist
    WHERE role = 'super_admin' AND lower(email) <> lower(NEW.email);
    IF total >= 3 THEN
      RAISE EXCEPTION 'There can be at most 3 super admins. Remove one first.';
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS super_admin_cap ON public.admin_allowlist;
CREATE TRIGGER super_admin_cap BEFORE INSERT OR UPDATE ON public.admin_allowlist
FOR EACH ROW EXECUTE FUNCTION public.enforce_super_admin_cap();

-- 3. Super admins manage admins and below, never other super admins
CREATE OR REPLACE FUNCTION public.update_staff_role(target_email text, new_role app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE me app_role; current_role_value app_role;
BEGIN
  me := public.get_my_staff_role();
  IF me IS NULL OR me NOT IN ('super_admin','admin') THEN
    RAISE EXCEPTION 'Only administrators can manage staff access';
  END IF;
  SELECT role INTO current_role_value FROM public.admin_allowlist WHERE lower(email) = lower(target_email);
  IF current_role_value IS NULL THEN
    RAISE EXCEPTION 'That staff member was not found';
  END IF;
  IF lower(target_email) = lower(coalesce(auth.jwt() ->> 'email','')) THEN
    RAISE EXCEPTION 'You cannot change your own role';
  END IF;
  IF current_role_value = 'super_admin' THEN
    RAISE EXCEPTION 'A super admin cannot be changed by another account';
  END IF;
  IF me = 'admin' AND (new_role IN ('super_admin','admin') OR current_role_value = 'admin') THEN
    RAISE EXCEPTION 'Only a super admin can change administrator roles';
  END IF;

  UPDATE public.admin_allowlist SET role = new_role WHERE lower(email) = lower(target_email);

  DELETE FROM public.user_roles ur USING public.profiles p
  WHERE ur.user_id = p.id AND lower(p.email) = lower(target_email);

  INSERT INTO public.user_roles (user_id, role)
  SELECT p.id, new_role FROM public.profiles p WHERE lower(p.email) = lower(target_email)
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.staff_activity (user_id, email, action, entity, entity_id, detail)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'staff.role_changed', 'staff', lower(target_email),
          current_role_value::text || ' -> ' || new_role::text);
END $$;

CREATE OR REPLACE FUNCTION public.remove_staff_access(target_email text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE me app_role; current_role_value app_role;
BEGIN
  me := public.get_my_staff_role();
  IF me IS NULL OR me NOT IN ('super_admin','admin') THEN
    RAISE EXCEPTION 'Only administrators can manage staff access';
  END IF;
  IF lower(target_email) = lower(coalesce(auth.jwt() ->> 'email','')) THEN
    RAISE EXCEPTION 'You cannot remove your own access';
  END IF;
  SELECT role INTO current_role_value FROM public.admin_allowlist WHERE lower(email) = lower(target_email);
  IF current_role_value IS NULL THEN RETURN; END IF;
  IF current_role_value = 'super_admin' THEN
    RAISE EXCEPTION 'A super admin cannot be removed by another account';
  END IF;
  IF me = 'admin' AND current_role_value = 'admin' THEN
    RAISE EXCEPTION 'Only a super admin can remove administrators';
  END IF;

  DELETE FROM public.admin_allowlist WHERE lower(email) = lower(target_email);
  DELETE FROM public.user_roles ur USING public.profiles p
  WHERE ur.user_id = p.id AND lower(p.email) = lower(target_email);

  INSERT INTO public.staff_activity (user_id, email, action, entity, entity_id, detail)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'staff.removed', 'staff', lower(target_email), NULL);
END $$;

-- 4. Activity + sign-in pattern summary for lower roles
CREATE OR REPLACE FUNCTION public.get_staff_activity_summary(days integer DEFAULT 30)
RETURNS TABLE(email text, role app_role, sign_ins bigint, actions bigint, active_days bigint,
              first_seen timestamptz, last_seen timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT lower(sa.email) AS email,
         al.role,
         count(*) FILTER (WHERE sa.action = 'auth.signin') AS sign_ins,
         count(*) FILTER (WHERE sa.action <> 'auth.signin') AS actions,
         count(DISTINCT date_trunc('day', sa.created_at)) AS active_days,
         min(sa.created_at) AS first_seen,
         max(sa.created_at) AS last_seen
  FROM public.staff_activity sa
  LEFT JOIN public.admin_allowlist al ON lower(al.email) = lower(sa.email)
  WHERE public.get_my_staff_role() IN ('super_admin','admin')
    AND sa.email IS NOT NULL
    AND sa.created_at >= now() - make_interval(days => greatest(coalesce(days, 30), 1))
  GROUP BY lower(sa.email), al.role
  ORDER BY max(sa.created_at) DESC;
$$;

REVOKE ALL ON FUNCTION public.get_staff_activity_summary(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_staff_activity_summary(integer) TO authenticated;
