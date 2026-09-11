import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SiteContent, SiteSettings, NavItem, SectionRecord, CtaRecord } from "@/lib/content.functions";
import { company } from "@/data/company";
import { setActiveSettings } from "@/lib/whatsapp";

/** Used only if the database is unreachable, so the site never renders blank. */
export const fallbackSettings: SiteSettings = {
  companyName: company.name,
  shortName: company.shortName,
  tagline: company.tagline,
  phoneDisplay: company.phoneDisplay,
  phoneTel: company.phoneTel,
  whatsappNumber: company.whatsappNumber,
  email: company.email,
  address: { ...company.address },
  addressOneLine: company.addressOneLine,
  mapQuery: company.map.query,
  mapEmbedSrc: company.map.embedSrc,
  mapDirectionsUrl: company.map.directionsUrl,
  announcement: company.announcement,
  announcementEnabled: true,
  hours: company.hours.map((h) => ({ ...h })),
  socials: [],
  whatsappTemplates: {},
  logoPath: null,
  faviconPath: null,
  seoTitle: null,
  seoDescription: null,
  ogImagePath: null,
};

const fallbackNav: NavItem[] = [
  ...[
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "Financing", href: "/financing" },
    { label: "Trade-In", href: "/trade-in" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
  ].map((n, i) => ({ id: `p${i}`, menu: "primary", position: i + 1, external: false, isCta: false, ...n })),
  ...[
    { label: "Warranty", href: "/warranty" },
    { label: "Team", href: "/team" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ].map((n, i) => ({ id: `m${i}`, menu: "more", position: i + 1, external: false, isCta: false, ...n })),
  ...[
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
  ].map((n, i) => ({ id: `l${i}`, menu: "legal", position: i + 1, external: false, isCta: false, ...n })),
];

export const fallbackContent: SiteContent = {
  settings: fallbackSettings,
  nav: fallbackNav,
  sections: [],
  ctas: [],
};

const SiteContext = createContext<SiteContent>(fallbackContent);

export function SiteProvider({ content, children }: { content: SiteContent | null; children: ReactNode }) {
  const value = content ?? fallbackContent;
  setActiveSettings(value.settings);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContext);
}

/** Business details shown across the site. */
export function useSettings() {
  return useContext(SiteContext).settings;
}

/** Menu items for one menu, in admin-defined order. */
export function useNav(menu: "primary" | "more" | "legal"): NavItem[] {
  const { nav } = useContext(SiteContext);
  return useMemo(() => nav.filter((n) => n.menu === menu).sort((a, b) => a.position - b.position), [nav, menu]);
}

/** Homepage sections keyed by section key, enabled ones only. */
export function useSections(): Record<string, SectionRecord> {
  const { sections } = useContext(SiteContext);
  return useMemo(() => {
    const map: Record<string, SectionRecord> = {};
    for (const s of sections) if (s.enabled) map[s.key] = s;
    return map;
  }, [sections]);
}

export function useCta(key: string): CtaRecord | undefined {
  const { ctas } = useContext(SiteContext);
  return ctas.find((c) => c.key === key && c.enabled);
}

/** Reads a value out of a section's settings JSON with a code-side default. */
export function sectionValue<T>(section: SectionRecord | undefined, key: string, fallback: T): T {
  const value = section?.settings?.[key];
  return value === undefined || value === null || value === "" ? fallback : (value as T);
}

export function sectionText(section: SectionRecord | undefined, field: "heading" | "subheading" | "body", fallback: string) {
  const value = section?.[field];
  return value && value.trim() ? value : fallback;
}
