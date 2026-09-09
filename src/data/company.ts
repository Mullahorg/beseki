/**
 * Single source of truth for company details.
 * Edit this file to update contact information across the whole site.
 */

export const company = {
  name: "BESEKI COMPANY LIMITED",
  shortName: "BESEKI",
  tagline: "Sale of New and Locally Used Motor Vehicles",
  phoneDisplay: "0721 886656",
  phoneTel: "+254721886656",
  whatsappNumber: "254721886656",
  email: "benkise26@gmail.com",
  address: {
    line1: "Railway Station",
    line2: "Along Lumumba Road",
    city: "Mombasa",
    country: "Kenya",
    postal: "P.O. Box 99554 - 80107",
  },
  addressOneLine: "Railway Station, Along Lumumba Road, Mombasa, Kenya",
  /** Editable map configuration — replace with exact coordinates when confirmed. */
  map: {
    query: "Railway Station, Lumumba Road, Mombasa, Kenya",
    embedSrc:
      "https://www.google.com/maps?q=Railway%20Station%2C%20Lumumba%20Road%2C%20Mombasa%2C%20Kenya&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Railway%20Station%2C%20Lumumba%20Road%2C%20Mombasa%2C%20Kenya",
  },
  /** Editable announcement bar copy. */
  announcement: "New arrivals available — visit our Mombasa showroom or WhatsApp us today.",
  /** Add real profile URLs here to display social icons in the footer. */
  socials: [] as { label: string; url: string }[],
  /** Editable opening hours placeholder — confirm before publishing. */
  hours: [
    { days: "Monday – Friday", time: "8:30 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 4:00 PM" },
    { days: "Sunday & Public Holidays", time: "By appointment" },
  ],
} as const;

export const primaryNav = [
  { label: "Home", to: "/" },
  { label: "Inventory", to: "/inventory" },
  { label: "Financing", to: "/financing" },
  { label: "Trade-In", to: "/trade-in" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
] as const;

export const moreNav = [
  { label: "Warranty", to: "/warranty" },
  { label: "Team", to: "/team" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Blog", to: "/blog" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;

export const legalNav = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Refund Policy", to: "/refund-policy" },
] as const;
