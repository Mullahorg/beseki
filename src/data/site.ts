/**
 * Editorial content that is not vehicle inventory.
 * Team profiles and testimonials are clearly marked placeholders — replace
 * them with real BESEKI staff and real customer feedback before publishing.
 */

export interface TeamProfile {
  id: string;
  name: string;
  position: string;
  bio: string;
  phone: string;
  email: string;
  /** Placeholder profile — no real employee details have been supplied. */
  placeholder: true;
}

export const teamProfiles: TeamProfile[] = [
  {
    id: "t-1",
    name: "Name to be confirmed",
    position: "Sales",
    bio: "This profile is a placeholder. Add the team member's name, role and a short introduction here.",
    phone: "0721 886656",
    email: "benkise26@gmail.com",
    placeholder: true,
  },
  {
    id: "t-2",
    name: "Name to be confirmed",
    position: "Vehicle Sourcing & Importation",
    bio: "This profile is a placeholder. Add the team member's name, role and a short introduction here.",
    phone: "0721 886656",
    email: "benkise26@gmail.com",
    placeholder: true,
  },
  {
    id: "t-3",
    name: "Name to be confirmed",
    position: "After-Sales Support",
    bio: "This profile is a placeholder. Add the team member's name, role and a short introduction here.",
    phone: "0721 886656",
    email: "benkise26@gmail.com",
    placeholder: true,
  },
];

export interface ServiceItem {
  slug: string;
  title: string;
  summary: string;
  detail: string;
  points: string[];
}

export const services: ServiceItem[] = [
  {
    slug: "vehicle-inspection",
    title: "Vehicle Inspection",
    summary: "A careful look at the vehicle before money changes hands.",
    detail:
      "We walk through the vehicle with you — bodywork, engine, underside, interior and documents — so you know exactly what you are buying. You are also welcome to bring your own mechanic.",
    points: ["Body and paint check", "Engine and drivetrain", "Documents and logbook", "Independent inspection welcome"],
  },
  {
    slug: "vehicle-sourcing",
    title: "Vehicle Sourcing",
    summary: "Looking for something we don't have on the yard? Tell us.",
    detail:
      "If the vehicle you want is not in our current stock, share the make, model, year and budget. We will look for a suitable unit and come back to you with what we find.",
    points: ["Specific make and model requests", "Budget-led search", "Honest feedback on availability"],
  },
  {
    slug: "importation-assistance",
    title: "Importation Assistance",
    summary: "Guidance through sourcing, shipping, clearance and registration.",
    detail:
      "Importing takes longer than buying from stock but gives you exactly the specification you want. We help you understand the steps, the timelines and the costs involved before you commit.",
    points: ["Sourcing and confirmation", "Shipping and arrival", "Clearance guidance", "Registration support"],
  },
  {
    slug: "maintenance",
    title: "Maintenance",
    summary: "Keeping the car right after you drive it away.",
    detail:
      "Talk to us about routine servicing and repairs. We will advise you on what a vehicle needs and when, particularly for the coastal conditions here in Mombasa.",
    points: ["Service advice", "Repair coordination", "Coastal-condition guidance"],
  },
  {
    slug: "after-sales-support",
    title: "After-Sales Support",
    summary: "A number you can call after the sale.",
    detail:
      "Questions do not stop at handover. Whether it is paperwork, a warning light or a service question, our team is reachable on phone and WhatsApp.",
    points: ["Transfer of ownership help", "Ongoing WhatsApp support", "Warranty enquiries"],
  },
];

export interface Testimonial {
  id: string;
  customer: string;
  rating: number;
  review: string;
  vehicle: string;
  date: string;
  /** Placeholder — not a real customer review. */
  placeholder: true;
}

/** DEMO PLACEHOLDERS — replace with genuine, verifiable customer reviews. */
export const testimonials: Testimonial[] = [
  {
    id: "r-1",
    customer: "Customer name",
    rating: 5,
    review:
      "Placeholder review text. Replace this with a real customer's own words once you have their permission to publish it.",
    vehicle: "Vehicle purchased",
    date: "2026-01-01",
    placeholder: true,
  },
  {
    id: "r-2",
    customer: "Customer name",
    rating: 5,
    review:
      "Placeholder review text. Replace this with a real customer's own words once you have their permission to publish it.",
    vehicle: "Vehicle purchased",
    date: "2026-01-01",
    placeholder: true,
  },
  {
    id: "r-3",
    customer: "Customer name",
    rating: 4,
    review:
      "Placeholder review text. Replace this with a real customer's own words once you have their permission to publish it.",
    vehicle: "Vehicle purchased",
    date: "2026-01-01",
    placeholder: true,
  },
];
