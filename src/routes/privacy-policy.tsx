import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/common/LegalPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "How BESEKI COMPANY LIMITED in Mombasa collects, uses and protects the personal information you share through this website.",
      },
      { property: "og:title", content: "Privacy Policy | BESEKI COMPANY LIMITED" },
      { property: "og:description", content: "How we handle the information you share with us." },
      { property: "og:url", content: "/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: () => (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="How we handle the information you share with us through this website."
      sections={[
        {
          heading: "Information we collect",
          paragraphs: [
            "When you submit an enquiry, book an appointment, request a trade-in estimate or leave a review, we collect the details you provide — typically your name, phone number, email address and the message itself.",
            "We do not ask for identity document numbers, bank details or payment card information through this website.",
          ],
        },
        {
          heading: "How we use your information",
          paragraphs: [
            "We use your details only to respond to your enquiry, arrange appointments, prepare quotations and provide after-sales support.",
            "We do not sell your information. Where a financing enquiry requires an introduction to a lender, we share only what is necessary and only with your knowledge.",
          ],
        },
        {
          heading: "Storage and retention",
          paragraphs: [
            "Enquiries submitted through this website are stored securely and kept for as long as necessary to serve you and to meet record-keeping obligations.",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "You may ask us to correct or delete the personal information we hold about you. Contact us using the details below and we will act on your request.",
          ],
        },
        {
          heading: "Changes to this policy",
          paragraphs: [
            "If this policy changes, the updated version will be published on this page.",
          ],
        },
      ]}
    />
  ),
});
