-- Font choice for the public site
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS font_theme text NOT NULL DEFAULT 'signature';

-- ============ Analytics ============
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('page_view','conversion','click')),
  path text NOT NULL DEFAULT '/',
  label text,
  referrer text,
  device text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_session_idx ON public.analytics_events (session_id);

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can record analytics" ON public.analytics_events;
CREATE POLICY "anyone can record analytics" ON public.analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "staff can read analytics" ON public.analytics_events;
CREATE POLICY "staff can read analytics" ON public.analytics_events
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- ============ Staff activity log ============
CREATE TABLE IF NOT EXISTS public.staff_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text,
  action text NOT NULL,
  entity text,
  entity_id text,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS staff_activity_created_idx ON public.staff_activity (created_at DESC);

GRANT SELECT, INSERT ON public.staff_activity TO authenticated;
GRANT ALL ON public.staff_activity TO service_role;
ALTER TABLE public.staff_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "staff can read activity" ON public.staff_activity;
CREATE POLICY "staff can read activity" ON public.staff_activity
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "staff can log activity" ON public.staff_activity;
CREATE POLICY "staff can log activity" ON public.staff_activity
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND user_id = auth.uid());

-- ============ Staff management RPCs ============
CREATE OR REPLACE FUNCTION public.get_staff_members()
RETURNS TABLE (email text, role app_role, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT a.email, a.role, a.created_at
  FROM public.admin_allowlist a
  WHERE public.is_staff(auth.uid())
  ORDER BY a.created_at;
$$;

CREATE OR REPLACE FUNCTION public.get_pending_staff()
RETURNS TABLE (email text, full_name text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT p.email, p.full_name, p.created_at
  FROM public.profiles p
  WHERE public.is_staff(auth.uid())
    AND p.email IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.admin_allowlist a WHERE lower(a.email) = lower(p.email)
    )
  ORDER BY p.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.add_staff_member(target_email text, target_role app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE me app_role;
BEGIN
  me := public.get_my_staff_role();
  IF me IS NULL OR me NOT IN ('super_admin','admin') THEN
    RAISE EXCEPTION 'Only administrators can manage staff access';
  END IF;
  IF me = 'admin' AND target_role IN ('super_admin','admin') THEN
    RAISE EXCEPTION 'Only a super admin can assign administrator roles';
  END IF;

  INSERT INTO public.admin_allowlist (email, role)
  VALUES (lower(target_email), target_role)
  ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

  INSERT INTO public.user_roles (user_id, role)
  SELECT p.id, target_role FROM public.profiles p WHERE lower(p.email) = lower(target_email)
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.staff_activity (user_id, email, action, entity, entity_id, detail)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'staff.approved', 'staff', lower(target_email),
          'Role: ' || target_role::text);
END $$;

CREATE OR REPLACE FUNCTION public.update_staff_role(target_email text, new_role app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
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
  IF me = 'admin' AND (new_role IN ('super_admin','admin') OR current_role_value IN ('super_admin','admin')) THEN
    RAISE EXCEPTION 'Only a super admin can change administrator roles';
  END IF;
  IF lower(target_email) = lower(coalesce(auth.jwt() ->> 'email','')) THEN
    RAISE EXCEPTION 'You cannot change your own role';
  END IF;

  UPDATE public.admin_allowlist SET role = new_role WHERE lower(email) = lower(target_email);

  DELETE FROM public.user_roles ur
  USING public.profiles p
  WHERE ur.user_id = p.id AND lower(p.email) = lower(target_email);

  INSERT INTO public.user_roles (user_id, role)
  SELECT p.id, new_role FROM public.profiles p WHERE lower(p.email) = lower(target_email)
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.staff_activity (user_id, email, action, entity, entity_id, detail)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'staff.role_changed', 'staff', lower(target_email),
          current_role_value::text || ' -> ' || new_role::text);
END $$;

CREATE OR REPLACE FUNCTION public.remove_staff_access(target_email text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
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
  IF me = 'admin' AND current_role_value IN ('super_admin','admin') THEN
    RAISE EXCEPTION 'Only a super admin can remove administrators';
  END IF;

  DELETE FROM public.admin_allowlist WHERE lower(email) = lower(target_email);
  DELETE FROM public.user_roles ur USING public.profiles p
  WHERE ur.user_id = p.id AND lower(p.email) = lower(target_email);

  INSERT INTO public.staff_activity (user_id, email, action, entity, entity_id, detail)
  VALUES (auth.uid(), auth.jwt() ->> 'email', 'staff.removed', 'staff', lower(target_email), NULL);
END $$;

CREATE OR REPLACE FUNCTION public.log_staff_activity(p_action text, p_entity text DEFAULT NULL, p_entity_id text DEFAULT NULL, p_detail text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN RETURN; END IF;
  INSERT INTO public.staff_activity (user_id, email, action, entity, entity_id, detail)
  VALUES (auth.uid(), auth.jwt() ->> 'email', p_action, p_entity, p_entity_id, p_detail);
END $$;

REVOKE ALL ON FUNCTION public.get_staff_members() FROM anon;
REVOKE ALL ON FUNCTION public.get_pending_staff() FROM anon;
REVOKE ALL ON FUNCTION public.add_staff_member(text, app_role) FROM anon;
REVOKE ALL ON FUNCTION public.update_staff_role(text, app_role) FROM anon;
REVOKE ALL ON FUNCTION public.remove_staff_access(text) FROM anon;
REVOKE ALL ON FUNCTION public.log_staff_activity(text, text, text, text) FROM anon;