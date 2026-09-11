import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Public, read-only content loaded from the CMS tables.
 * Everything here is safe for anonymous visitors (published rows only).
 */

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export interface SiteSettings {
  companyName: string;
  shortName: string;
  tagline: string;
  phoneDisplay: string;
  phoneTel: string;
  whatsappNumber: string;
  email: string;
  address: { line1: string; line2: string; city: string; country: string; postal: string };
  addressOneLine: string;
  mapQuery: string;
  mapEmbedSrc: string;
  mapDirectionsUrl: string;
  announcement: string;
  announcementEnabled: boolean;
  hours: { days: string; time: string }[];
  socials: { label: string; url: string }[];
  whatsappTemplates: Record<string, string>;
  logoPath: string | null;
  faviconPath: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImagePath: string | null;
}

export interface NavItem {
  id: string;
  menu: string;
  label: string;
  href: string;
  position: number;
  external: boolean;
  isCta: boolean;
}

export interface SectionRecord {
  key: string;
  heading: string;
  subheading: string;
  body: string;
  variant: string;
  position: number;
  enabled: boolean;
  imagePath: string | null;
  imageAlt: string;
  settings: Record<string, string | number | boolean | null>;
}

export interface CtaRecord {
  key: string;
  label: string;
  type: string;
  destination: string;
  enabled: boolean;
}

export interface SiteContent {
  settings: SiteSettings;
  nav: NavItem[];
  sections: SectionRecord[];
  ctas: CtaRecord[];
}

function oneLine(s: { address_line1: string; address_line2: string; city: string; country: string }) {
  return [s.address_line1, s.address_line2, s.city, s.country].filter(Boolean).join(", ");
}

/** Business details, menus, homepage sections and CTA definitions in one round trip. */
export const getSiteContent = createServerFn({ method: "GET" }).handler(async (): Promise<SiteContent | null> => {
  const db = publicClient();
  const [settingsRes, navRes, sectionsRes, ctasRes] = await Promise.all([
    db
      .from("site_settings")
      .select(
        "company_name,short_name,tagline,phone_display,phone_tel,whatsapp_number,email,address_line1,address_line2,city,country,postal,map_query,announcement,announcement_enabled,hours,socials,whatsapp_templates,default_seo_title,default_seo_description,logo_media_id,favicon_media_id,og_media_id",
      )
      .maybeSingle(),
    db.from("nav_items").select("id,menu,label,href,position,visible,external,is_cta").eq("visible", true).order("position"),
    db
      .from("page_sections")
      .select("section_key,variant,heading,subheading,body,settings,position,enabled,media_id,media:media_id(path,alt)")
      .eq("page_slug", "home")
      .order("position"),
    db.from("ctas").select("key,label,cta_type,destination,enabled"),
  ]);

  const s = settingsRes.data;
  if (!s) return null;

  const mediaIds = [s.logo_media_id, s.favicon_media_id, s.og_media_id].filter(Boolean) as string[];
  const brandPaths = new Map<string, string>();
  if (mediaIds.length) {
    const { data } = await db.from("media").select("id,path").in("id", mediaIds);
    for (const m of data ?? []) brandPaths.set(m.id, m.path);
  }

  const q = encodeURIComponent(s.map_query || oneLine(s));

  return {
    settings: {
      companyName: s.company_name,
      shortName: s.short_name,
      tagline: s.tagline,
      phoneDisplay: s.phone_display,
      phoneTel: s.phone_tel,
      whatsappNumber: s.whatsapp_number,
      email: s.email,
      address: {
        line1: s.address_line1,
        line2: s.address_line2,
        city: s.city,
        country: s.country,
        postal: s.postal,
      },
      addressOneLine: oneLine(s),
      mapQuery: s.map_query,
      mapEmbedSrc: `https://www.google.com/maps?q=${q}&output=embed`,
      mapDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
      announcement: s.announcement,
      announcementEnabled: s.announcement_enabled,
      hours: (s.hours as { days: string; time: string }[] | null) ?? [],
      socials: (s.socials as { label: string; url: string }[] | null) ?? [],
      whatsappTemplates: (s.whatsapp_templates as Record<string, string> | null) ?? {},
      logoPath: s.logo_media_id ? brandPaths.get(s.logo_media_id) ?? null : null,
      faviconPath: s.favicon_media_id ? brandPaths.get(s.favicon_media_id) ?? null : null,
      seoTitle: s.default_seo_title,
      seoDescription: s.default_seo_description,
      ogImagePath: s.og_media_id ? brandPaths.get(s.og_media_id) ?? null : null,
    },
    nav: (navRes.data ?? []).map((n) => ({
      id: n.id,
      menu: n.menu,
      label: n.label,
      href: n.href,
      position: n.position,
      external: n.external,
      isCta: n.is_cta,
    })),
    sections: (sectionsRes.data ?? []).map((r) => {
      const media = (r as unknown as { media: { path: string; alt: string } | null }).media;
      return {
        key: r.section_key,
        heading: r.heading,
        subheading: r.subheading,
        body: r.body,
        variant: r.variant,
        position: r.position,
        enabled: r.enabled,
        imagePath: media?.path ?? null,
        imageAlt: media?.alt ?? "",
        settings: (r.settings as Record<string, string | number | boolean | null> | null) ?? {},
      };
    }),
    ctas: (ctasRes.data ?? []).map((c) => ({
      key: c.key,
      label: c.label,
      type: c.cta_type,
      destination: c.destination,
      enabled: c.enabled,
    })),
  };
});

export interface ServiceRecord {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  points: string[];
  imagePath: string | null;
}

export const listServices = createServerFn({ method: "GET" }).handler(async (): Promise<ServiceRecord[]> => {
  const { data } = await publicClient()
    .from("services")
    .select("slug,title,summary,detail,points,media:media_id(path)")
    .eq("status", "published")
    .order("position");
  return (data ?? []).map((r) => ({
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    detail: r.detail,
    points: r.points ?? [],
    imagePath: (r as unknown as { media: { path: string } | null }).media?.path ?? null,
  }));
});

export interface FaqRecord {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const listFaqs = createServerFn({ method: "GET" }).handler(async (): Promise<FaqRecord[]> => {
  const { data } = await publicClient()
    .from("faqs")
    .select("id,question,answer,category")
    .eq("status", "published")
    .order("position");
  return data ?? [];
});

export interface TestimonialRecord {
  id: string;
  customerName: string;
  review: string;
  rating: number;
  vehicle: string | null;
  happenedOn: string | null;
  imagePath: string | null;
}

export const listTestimonials = createServerFn({ method: "GET" }).handler(async (): Promise<TestimonialRecord[]> => {
  const { data } = await publicClient()
    .from("testimonials")
    .select("id,customer_name,review,rating,vehicle,happened_on,media:media_id(path)")
    .eq("status", "published")
    .order("position");
  return (data ?? []).map((r) => ({
    id: r.id,
    customerName: r.customer_name,
    review: r.review,
    rating: r.rating,
    vehicle: r.vehicle,
    happenedOn: r.happened_on,
    imagePath: (r as unknown as { media: { path: string } | null }).media?.path ?? null,
  }));
});

export interface TeamRecord {
  id: string;
  name: string;
  positionTitle: string;
  bio: string;
  phone: string | null;
  email: string | null;
  imagePath: string | null;
}

export const listTeam = createServerFn({ method: "GET" }).handler(async (): Promise<TeamRecord[]> => {
  const { data } = await publicClient()
    .from("team_members")
    .select("id,name,position_title,bio,phone,email,media:media_id(path)")
    .eq("status", "published")
    .order("position");
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    positionTitle: r.position_title,
    bio: r.bio,
    phone: r.phone,
    email: r.email,
    imagePath: (r as unknown as { media: { path: string } | null }).media?.path ?? null,
  }));
});

export interface BlogRecord {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  body: string;
  publishedAt: string | null;
  imagePath: string | null;
  imageAlt: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

const BLOG_SELECT =
  "slug,title,excerpt,category,body,published_at,seo_title,seo_description,media:featured_media_id(path,alt)";

function mapPost(r: Record<string, unknown>): BlogRecord {
  const media = r["media"] as { path: string; alt: string } | null;
  return {
    slug: r["slug"] as string,
    title: r["title"] as string,
    excerpt: r["excerpt"] as string,
    category: r["category"] as string,
    body: r["body"] as string,
    publishedAt: (r["published_at"] as string | null) ?? null,
    imagePath: media?.path ?? null,
    imageAlt: media?.alt ?? "",
    seoTitle: (r["seo_title"] as string | null) ?? null,
    seoDescription: (r["seo_description"] as string | null) ?? null,
  };
}

export const listBlogPosts = createServerFn({ method: "GET" }).handler(async (): Promise<BlogRecord[]> => {
  const { data } = await publicClient()
    .from("blog_posts")
    .select(BLOG_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data ?? []).map((r) => mapPost(r as unknown as Record<string, unknown>));
});

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => ({ slug: String(data.slug).slice(0, 200) }))
  .handler(async ({ data }): Promise<BlogRecord | null> => {
    const { data: row } = await publicClient()
      .from("blog_posts")
      .select(BLOG_SELECT)
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();
    return row ? mapPost(row as unknown as Record<string, unknown>) : null;
  });
