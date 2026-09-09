-- ============ ROLES ============
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin','admin','editor','sales');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- staff = any role that may manage content
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE OR REPLACE FUNCTION public.can_manage_content(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin','admin','editor')
  )
$$;

DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'super_admin') OR public.has_role(auth.uid(),'admin'));

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Own profile read" ON public.profiles;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "Own profile write" ON public.profiles;
CREATE POLICY "Own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Own profile insert" ON public.profiles;
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ VEHICLES (extend) ============
ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS variant text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'KES',
  ADD COLUMN IF NOT EXISTS interior_color text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS stock_number text,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS vehicles_slug_key ON public.vehicles (slug);
CREATE INDEX IF NOT EXISTS vehicles_published_idx ON public.vehicles (published, archived);
CREATE INDEX IF NOT EXISTS vehicles_make_model_idx ON public.vehicles (make, model);
CREATE INDEX IF NOT EXISTS vehicles_price_idx ON public.vehicles (price);
CREATE INDEX IF NOT EXISTS vehicles_year_idx ON public.vehicles (year);
CREATE INDEX IF NOT EXISTS vehicles_created_idx ON public.vehicles (created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO authenticated;
GRANT ALL ON public.vehicles TO service_role;
DROP POLICY IF EXISTS "Published vehicles are public" ON public.vehicles;
CREATE POLICY "Published vehicles are public" ON public.vehicles
  FOR SELECT TO anon, authenticated USING (published = true AND archived = false);
DROP POLICY IF EXISTS "Staff read all vehicles" ON public.vehicles;
CREATE POLICY "Staff read all vehicles" ON public.vehicles
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Content managers write vehicles" ON public.vehicles;
CREATE POLICY "Content managers write vehicles" ON public.vehicles
  FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid()))
  WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ MEDIA ============
CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'media',
  path text NOT NULL UNIQUE,
  url text NOT NULL,
  file_name text NOT NULL,
  mime_type text NOT NULL DEFAULT 'image/jpeg',
  size_bytes bigint NOT NULL DEFAULT 0,
  width integer,
  height integer,
  alt text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Other',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT SELECT ON public.media TO anon;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS media_category_idx ON public.media (category, created_at DESC);
DROP POLICY IF EXISTS "Media is publicly readable" ON public.media;
CREATE POLICY "Media is publicly readable" ON public.media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Content managers write media" ON public.media;
CREATE POLICY "Content managers write media" ON public.media FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

CREATE TABLE IF NOT EXISTS public.vehicle_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  is_cover boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (vehicle_id, media_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicle_media TO authenticated;
GRANT SELECT ON public.vehicle_media TO anon;
GRANT ALL ON public.vehicle_media TO service_role;
ALTER TABLE public.vehicle_media ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS vehicle_media_vehicle_idx ON public.vehicle_media (vehicle_id, position);
DROP POLICY IF EXISTS "Vehicle photos are public" ON public.vehicle_media;
CREATE POLICY "Vehicle photos are public" ON public.vehicle_media FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Content managers write vehicle photos" ON public.vehicle_media;
CREATE POLICY "Content managers write vehicle photos" ON public.vehicle_media FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ GALLERIES ============
CREATE TABLE IF NOT EXISTS public.galleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galleries TO authenticated;
GRANT SELECT ON public.galleries TO anon;
GRANT ALL ON public.galleries TO service_role;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published galleries are public" ON public.galleries;
CREATE POLICY "Published galleries are public" ON public.galleries FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "Staff read galleries" ON public.galleries;
CREATE POLICY "Staff read galleries" ON public.galleries FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Content managers write galleries" ON public.galleries;
CREATE POLICY "Content managers write galleries" ON public.galleries FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.galleries(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (gallery_id, media_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT SELECT ON public.gallery_items TO anon;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS gallery_items_gallery_idx ON public.gallery_items (gallery_id, position);
DROP POLICY IF EXISTS "Gallery photos are public" ON public.gallery_items;
CREATE POLICY "Gallery photos are public" ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Content managers write gallery photos" ON public.gallery_items;
CREATE POLICY "Content managers write gallery photos" ON public.gallery_items FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ CTAS ============
CREATE TABLE IF NOT EXISTS public.ctas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  cta_type text NOT NULL DEFAULT 'internal',
  destination text NOT NULL DEFAULT '/',
  icon text,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ctas TO authenticated;
GRANT SELECT ON public.ctas TO anon;
GRANT ALL ON public.ctas TO service_role;
ALTER TABLE public.ctas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "CTAs are public" ON public.ctas;
CREATE POLICY "CTAs are public" ON public.ctas FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Content managers write ctas" ON public.ctas;
CREATE POLICY "Content managers write ctas" ON public.ctas FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ PAGES + SECTIONS ============
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  intro text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  featured_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  seo_title text,
  seo_description text,
  og_title text,
  og_description text,
  og_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  canonical text,
  noindex boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published',
  is_system boolean NOT NULL DEFAULT false,
  draft jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT SELECT ON public.pages TO anon;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published pages are public" ON public.pages;
CREATE POLICY "Published pages are public" ON public.pages FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "Staff read pages" ON public.pages;
CREATE POLICY "Staff read pages" ON public.pages FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Content managers write pages" ON public.pages;
CREATE POLICY "Content managers write pages" ON public.pages FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

CREATE TABLE IF NOT EXISTS public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL,
  section_key text NOT NULL,
  variant text NOT NULL DEFAULT 'default',
  heading text NOT NULL DEFAULT '',
  subheading text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  primary_cta_id uuid REFERENCES public.ctas(id) ON DELETE SET NULL,
  secondary_cta_id uuid REFERENCES public.ctas(id) ON DELETE SET NULL,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  position integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_slug, section_key)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_sections TO authenticated;
GRANT SELECT ON public.page_sections TO anon;
GRANT ALL ON public.page_sections TO service_role;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS page_sections_page_idx ON public.page_sections (page_slug, position);
DROP POLICY IF EXISTS "Sections are public" ON public.page_sections;
CREATE POLICY "Sections are public" ON public.page_sections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Content managers write sections" ON public.page_sections;
CREATE POLICY "Content managers write sections" ON public.page_sections FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

CREATE TABLE IF NOT EXISTS public.featured_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  UNIQUE (vehicle_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.featured_vehicles TO authenticated;
GRANT SELECT ON public.featured_vehicles TO anon;
GRANT ALL ON public.featured_vehicles TO service_role;
ALTER TABLE public.featured_vehicles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Featured list is public" ON public.featured_vehicles;
CREATE POLICY "Featured list is public" ON public.featured_vehicles FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Content managers write featured" ON public.featured_vehicles;
CREATE POLICY "Content managers write featured" ON public.featured_vehicles FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ BLOG ============
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  featured_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  seo_title text,
  seo_description text,
  og_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  noindex boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT SELECT ON public.blog_posts TO anon;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS blog_status_idx ON public.blog_posts (status, published_at DESC);
DROP POLICY IF EXISTS "Published posts are public" ON public.blog_posts;
CREATE POLICY "Published posts are public" ON public.blog_posts FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "Staff read posts" ON public.blog_posts;
CREATE POLICY "Staff read posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Content managers write posts" ON public.blog_posts;
CREATE POLICY "Content managers write posts" ON public.blog_posts FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  review text NOT NULL,
  rating smallint NOT NULL DEFAULT 5,
  vehicle text,
  media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  happened_on date,
  position integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT SELECT ON public.testimonials TO anon;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published testimonials are public" ON public.testimonials;
CREATE POLICY "Published testimonials are public" ON public.testimonials FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "Staff read testimonials" ON public.testimonials;
CREATE POLICY "Staff read testimonials" ON public.testimonials FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Content managers write testimonials" ON public.testimonials;
CREATE POLICY "Content managers write testimonials" ON public.testimonials FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ FAQS ============
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  position integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT SELECT ON public.faqs TO anon;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published faqs are public" ON public.faqs;
CREATE POLICY "Published faqs are public" ON public.faqs FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "Staff read faqs" ON public.faqs;
CREATE POLICY "Staff read faqs" ON public.faqs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Content managers write faqs" ON public.faqs;
CREATE POLICY "Content managers write faqs" ON public.faqs FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ SERVICES ============
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  points text[] NOT NULL DEFAULT '{}',
  media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  cta_id uuid REFERENCES public.ctas(id) ON DELETE SET NULL,
  position integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT SELECT ON public.services TO anon;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published services are public" ON public.services;
CREATE POLICY "Published services are public" ON public.services FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "Staff read services" ON public.services;
CREATE POLICY "Staff read services" ON public.services FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Content managers write services" ON public.services;
CREATE POLICY "Content managers write services" ON public.services FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ TEAM ============
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position_title text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  phone text,
  email text,
  media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  socials jsonb NOT NULL DEFAULT '{}'::jsonb,
  position integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT ON public.team_members TO anon;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Published team is public" ON public.team_members;
CREATE POLICY "Published team is public" ON public.team_members FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS "Staff read team" ON public.team_members;
CREATE POLICY "Staff read team" ON public.team_members FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Content managers write team" ON public.team_members;
CREATE POLICY "Content managers write team" ON public.team_members FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ NAVIGATION ============
CREATE TABLE IF NOT EXISTS public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu text NOT NULL DEFAULT 'primary',
  label text NOT NULL,
  href text NOT NULL,
  parent_id uuid REFERENCES public.nav_items(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  external boolean NOT NULL DEFAULT false,
  is_cta boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT SELECT ON public.nav_items TO anon;
GRANT ALL ON public.nav_items TO service_role;
ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS nav_menu_idx ON public.nav_items (menu, position);
DROP POLICY IF EXISTS "Navigation is public" ON public.nav_items;
CREATE POLICY "Navigation is public" ON public.nav_items FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Content managers write nav" ON public.nav_items;
CREATE POLICY "Content managers write nav" ON public.nav_items FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ SITE SETTINGS ============
CREATE TABLE IF NOT EXISTS public.site_settings (
  id boolean PRIMARY KEY DEFAULT true,
  company_name text NOT NULL DEFAULT 'BESEKI COMPANY LIMITED',
  short_name text NOT NULL DEFAULT 'BESEKI',
  tagline text NOT NULL DEFAULT 'Sale of New and Locally Used Motor Vehicles',
  phone_display text NOT NULL DEFAULT '0721 886656',
  phone_tel text NOT NULL DEFAULT '+254721886656',
  whatsapp_number text NOT NULL DEFAULT '254721886656',
  email text NOT NULL DEFAULT 'benkise26@gmail.com',
  address_line1 text NOT NULL DEFAULT 'Railway Station',
  address_line2 text NOT NULL DEFAULT 'Along Lumumba Road',
  city text NOT NULL DEFAULT 'Mombasa',
  country text NOT NULL DEFAULT 'Kenya',
  postal text NOT NULL DEFAULT 'P.O. Box 99554 - 80107',
  map_query text NOT NULL DEFAULT 'Railway Station, Lumumba Road, Mombasa, Kenya',
  announcement text NOT NULL DEFAULT '',
  announcement_enabled boolean NOT NULL DEFAULT true,
  hours jsonb NOT NULL DEFAULT '[]'::jsonb,
  socials jsonb NOT NULL DEFAULT '[]'::jsonb,
  whatsapp_templates jsonb NOT NULL DEFAULT '{}'::jsonb,
  primary_color text,
  secondary_color text,
  logo_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  logo_light_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  logo_dark_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  favicon_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  default_seo_title text,
  default_seo_description text,
  og_media_id uuid REFERENCES public.media(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = true)
);
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT SELECT ON public.site_settings TO anon;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Settings are public" ON public.site_settings;
CREATE POLICY "Settings are public" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Content managers write settings" ON public.site_settings;
CREATE POLICY "Content managers write settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));

-- ============ LEADS (extend enquiries) ============
ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS notes text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON public.enquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_type_idx ON public.enquiries (type, created_at DESC);
GRANT SELECT, INSERT, UPDATE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
DROP POLICY IF EXISTS "Staff read enquiries" ON public.enquiries;
CREATE POLICY "Staff read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
DROP POLICY IF EXISTS "Staff update enquiries" ON public.enquiries;
CREATE POLICY "Staff update enquiries" ON public.enquiries FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- ============ UPDATED_AT TRIGGERS ============
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['media','galleries','ctas','pages','page_sections','blog_posts','testimonials','faqs','services','team_members','nav_items','site_settings','profiles','enquiries']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t);
  END LOOP;
END $$;

-- ============ SEED SETTINGS + GALLERIES + CTAS + NAV ============
INSERT INTO public.site_settings (id, announcement, hours, whatsapp_templates)
VALUES (true,
  'New arrivals available — visit our Mombasa showroom or WhatsApp us today.',
  '[{"days":"Monday – Friday","time":"8:30 AM – 6:00 PM"},{"days":"Saturday","time":"9:00 AM – 4:00 PM"},{"days":"Sunday & Public Holidays","time":"By appointment"}]'::jsonb,
  '{"vehicle":"Hello BESEKI, I''m interested in the {vehicle} listed at {price}.","test_drive":"Hello BESEKI, I''d like to book a test drive.","trade_in":"Hello BESEKI, I''d like to request a trade-in estimate.","general":"Hello BESEKI, I''d like to enquire about your vehicles."}'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.galleries (slug, title, position) VALUES
  ('showroom','Showroom',1),('exterior','Exterior',2),('interior','Interior',3),
  ('deliveries','Deliveries',4),('workshop','Workshop',5),('team','Team',6),('events','Events',7)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.ctas (key, label, cta_type, destination) VALUES
  ('browse_inventory','Browse Inventory','internal','/inventory'),
  ('book_test_drive','Book a Test Drive','test_drive','/contact'),
  ('whatsapp_us','WhatsApp Us','whatsapp',''),
  ('call_us','Call Us','phone',''),
  ('financing','Financing','internal','/financing'),
  ('trade_in','Trade-In','internal','/trade-in'),
  ('contact','Contact Us','internal','/contact')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.nav_items (menu, label, href, position) VALUES
  ('primary','Home','/',1),('primary','Inventory','/inventory',2),('primary','Financing','/financing',3),
  ('primary','Trade-In','/trade-in',4),('primary','Services','/services',5),('primary','About','/about',6),
  ('more','Warranty','/warranty',1),('more','Team','/team',2),('more','Testimonials','/testimonials',3),
  ('more','Blog','/blog',4),('more','FAQ','/faq',5),('more','Contact','/contact',6),
  ('legal','Privacy Policy','/privacy-policy',1),('legal','Terms & Conditions','/terms',2),('legal','Refund Policy','/refund-policy',3)
ON CONFLICT DO NOTHING;

INSERT INTO public.pages (slug, title, is_system, status) VALUES
  ('home','Home',true,'published'),('inventory','Inventory',true,'published'),('financing','Financing',true,'published'),
  ('trade-in','Trade-In',true,'published'),('services','Services',true,'published'),('warranty','Warranty',true,'published'),
  ('about','About',true,'published'),('team','Team',true,'published'),('testimonials','Testimonials',true,'published'),
  ('blog','Blog',true,'published'),('faq','FAQ',true,'published'),('contact','Contact',true,'published'),
  ('privacy-policy','Privacy Policy',true,'published'),('terms','Terms & Conditions',true,'published'),
  ('refund-policy','Refund Policy',true,'published')
ON CONFLICT (slug) DO NOTHING;
