import { company } from "@/data/company";
import type { SiteSettings } from "@/lib/content.functions";

/**
 * WhatsApp links use the business details stored in site settings.
 * The active settings singleton is published by SiteProvider on render;
 * it is the same for every visitor, so sharing it module-wide is safe.
 */
let active: Pick<SiteSettings, "whatsappNumber" | "companyName" | "shortName" | "whatsappTemplates"> = {
  whatsappNumber: company.whatsappNumber,
  companyName: company.name,
  shortName: company.shortName,
  whatsappTemplates: {},
};

export function setActiveSettings(settings: SiteSettings) {
  active = settings;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${active.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function template(key: string, fallback: string) {
  const value = active.whatsappTemplates?.[key];
  return value && value.trim() ? value : fallback;
}

export const waMessages = {
  get general() {
    return template("general", `Hello ${active.companyName}, I would like to enquire about your vehicles.`);
  },
  get testDrive() {
    return template("test_drive", `Hello ${active.companyName}, I would like to book a test drive.`);
  },
  get tradeIn() {
    return template("trade_in", `Hello ${active.companyName}, I would like to enquire about trading in my vehicle.`);
  },
  get financing() {
    return template("financing", `Hello ${active.companyName}, I would like to enquire about financing options.`);
  },
  vehicle: (name: string, price?: string) =>
    template("vehicle", `Hello ${active.companyName}, I am interested in the {vehicle}. Is it still available?`)
      .replace("{vehicle}", name)
      .replace("{price}", price ?? ""),
  offer: (name: string) => `Hello ${active.companyName}, I would like to make an offer on the ${name}.`,
};

export function formatKes(value: number) {
  return `KES ${value.toLocaleString("en-KE")}`;
}

export function formatKm(value: number) {
  return `${value.toLocaleString("en-KE")} km`;
}
