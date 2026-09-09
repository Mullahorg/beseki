import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/common/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "How deposits, payments and refunds are handled at BESEKI COMPANY LIMITED, Mombasa. Terms are confirmed in writing for each individual sale.",
      },
      { property: "og:title", content: "Refund Policy | BESEKI COMPANY LIMITED" },
      { property: "og:description", content: "How deposits, payments and refunds are handled for each sale." },
      { property: "og:url", content: "/refund-policy" },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: () => (
    <LegalPage
      eyebrow="Legal"
      title="Refund Policy"
      intro="How deposits, payments and refunds are handled on a vehicle purchase."
      sections={[
        {
          heading: "Deposits",
          paragraphs: [
            "A deposit may be taken to reserve a vehicle. Whether that deposit is refundable, and under what conditions, is agreed in writing at the time it is paid.",
          ],
        },
        {
          heading: "Completed sales",
          paragraphs: [
            "Once a sale has been completed and the vehicle handed over, the sale is treated as final unless the written sale agreement says otherwise.",
            "This does not affect any rights you have under applicable Kenyan consumer law.",
          ],
        },
        {
          heading: "Cancellations",
          paragraphs: [
            "If you decide not to proceed before completion, contact us as soon as possible. We will explain what happens to any amount already paid, based on the agreement made.",
          ],
        },
        {
          heading: "Faults after purchase",
          paragraphs: [
            "Warranty coverage varies by vehicle. Contact our team for the specific warranty terms applicable to your vehicle, and speak to us directly about any fault that appears after purchase.",
          ],
        },
      ]}
    />
  ),
});
