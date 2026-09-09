CREATE TABLE IF NOT EXISTS public.admin_allowlist (
  email text PRIMARY KEY,
  role public.app_role NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_allowlist TO authenticated;
GRANT ALL ON public.admin_allowlist TO service_role;
ALTER TABLE public.admin_allowlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read allowlist" ON public.admin_allowlist;
CREATE POLICY "Admins read allowlist" ON public.admin_allowlist FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));
DROP POLICY IF EXISTS "Admins write allowlist" ON public.admin_allowlist;
CREATE POLICY "Admins write allowlist" ON public.admin_allowlist FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));

INSERT INTO public.admin_allowlist (email, role) VALUES ('johnmulama001@gmail.com','super_admin')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE allowed public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  SELECT role INTO allowed FROM public.admin_allowlist WHERE lower(email) = lower(NEW.email);
  IF allowed IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, allowed)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Backfill for an account that already exists
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, a.role FROM auth.users u
JOIN public.admin_allowlist a ON lower(a.email) = lower(u.email)
ON CONFLICT (user_id, role) DO NOTHING;