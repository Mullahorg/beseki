import { company } from "@/data/company";

export function whatsappLink(message: string) {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  general: `Hello ${company.name}, I would like to enquire about your vehicles.`,
  testDrive: `Hello ${company.name}, I would like to book a test drive.`,
  tradeIn: `Hello ${company.name}, I would like to enquire about trading in my vehicle.`,
  financing: `Hello ${company.name}, I would like to enquire about financing options.`,
  vehicle: (name: string) =>
    `Hello ${company.name}, I am interested in the ${name}. Is it still available?`,
  offer: (name: string) => `Hello ${company.name}, I would like to make an offer on the ${name}.`,
};

export function formatKes(value: number) {
  return `KES ${value.toLocaleString("en-KE")}`;
}

export function formatKm(value: number) {
  return `${value.toLocaleString("en-KE")} km`;
}
