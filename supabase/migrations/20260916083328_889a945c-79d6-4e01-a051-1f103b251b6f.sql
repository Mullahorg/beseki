
CREATE TABLE IF NOT EXISTS public.notification_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  resend_api_key text NOT NULL DEFAULT '',
  resend_from text NOT NULL DEFAULT '',
  lead_recipients text[] NOT NULL DEFAULT '{}',
  report_recipients text[] NOT NULL DEFAULT '{}',
  telegram_bot_token text NOT NULL DEFAULT '',
  telegram_chat_id text NOT NULL DEFAULT '',
  email_enabled boolean NOT NULL DEFAULT false,
  telegram_enabled boolean NOT NULL DEFAULT false,
  alert_on_lead boolean NOT NULL DEFAULT true,
  alert_on_failure boolean NOT NULL DEFAULT true,
  daily_report boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.notification_settings TO authenticated;
GRANT ALL ON public.notification_settings TO service_role;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Super admins read alert settings" ON public.notification_settings;
CREATE POLICY "Super admins read alert settings"
ON public.notification_settings FOR SELECT TO authenticated
USING (public.get_my_staff_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins create alert settings" ON public.notification_settings;
CREATE POLICY "Super admins create alert settings"
ON public.notification_settings FOR INSERT TO authenticated
WITH CHECK (public.get_my_staff_role() = 'super_admin');

DROP POLICY IF EXISTS "Super admins update alert settings" ON public.notification_settings;
CREATE POLICY "Super admins update alert settings"
ON public.notification_settings FOR UPDATE TO authenticated
USING (public.get_my_staff_role() = 'super_admin')
WITH CHECK (public.get_my_staff_role() = 'super_admin');

DROP TRIGGER IF EXISTS set_updated_at ON public.notification_settings;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.notification_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.notification_settings (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.notification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL,
  kind text NOT NULL,
  target text,
  status text NOT NULL,
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.notification_log TO authenticated;
GRANT ALL ON public.notification_log TO service_role;
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read alert log" ON public.notification_log;
CREATE POLICY "Admins read alert log"
ON public.notification_log FOR SELECT TO authenticated
USING (public.get_my_staff_role() IN ('super_admin','admin'));

CREATE INDEX IF NOT EXISTS notification_log_created_idx ON public.notification_log (created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_created_idx ON public.enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON public.enquiries (status);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS staff_activity_created_idx ON public.staff_activity (created_at DESC);
CREATE INDEX IF NOT EXISTS vehicles_published_idx ON public.vehicles (published, archived);
