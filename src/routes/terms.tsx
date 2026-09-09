import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/common/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "The terms that apply to using the BESEKI COMPANY LIMITED website, including vehicle listings, pricing, availability and enquiries.",
      },
      { property: "og:title", content: "Terms & Conditions | BESEKI COMPANY LIMITED" },
      { property: "og:description", content: "Terms that apply to using this website and enquiring about vehicles." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="The terms that apply when you use this website and enquire about our vehicles."
      sections={[
        {
          heading: "Using this website",
          paragraphs: [
            "By using this website you agree to use it lawfully and not to interfere with its operation or misuse the enquiry forms.",
          ],
        },
        {
          heading: "Vehicle listings and availability",
          paragraphs: [
            "We take care to keep listings accurate, but specifications, photographs, mileage and availability can change. Vehicles are sold subject to availability at the time of purchase.",
            "Photographs on this website are illustrative. Confirm the exact condition and specification of a vehicle by inspecting it in person before you commit.",
          ],
        },
        {
          heading: "Pricing",
          paragraphs: [
            "Prices are shown in Kenya Shillings and are our asking prices. They exclude any transfer, registration or third-party costs unless stated in writing.",
          ],
        },
        {
          heading: "Financing estimates",
          paragraphs: [
            "The financing calculator on this website gives an indicative figure only. It is not an offer of credit, and actual terms depend entirely on the lender and your application.",
          ],
        },
        {
          heading: "Enquiries and appointments",
          paragraphs: [
            "Submitting a form is a request, not a binding reservation. A vehicle is only held once agreed with our team.",
          ],
        },
      ]}
    />
  ),
});
