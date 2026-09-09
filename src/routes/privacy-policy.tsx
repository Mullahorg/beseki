import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { company } from "@/data/company";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      {
        title: "Privacy Policy | BESEKI COMPANY LIMITED",
      },
      {
        name: "description",
        content:
          "How BESEKI COMPANY LIMITED in Mombasa collects, uses and protects the personal information you share through this website.",
      },
      {
        property: "og:title",
        content: "Privacy Policy | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content: "How BESEKI COMPANY LIMITED handles the information you share with us.",
      },
      {
        property: "og:url",
        content: "/privacy-policy",
      },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

const sections = [
  {
    id: "information",
    number: "01",
    heading: "Information we collect",
    paragraphs: [
      "When you submit an enquiry, book an appointment, request a trade-in estimate or leave a review, we collect the details you provide — typically your name, phone number, email address and the message itself.",
      "We do not ask for identity document numbers, bank details or payment card information through this website.",
    ],
  },
  {
    id: "use",
    number: "02",
    heading: "How we use your information",
    paragraphs: [
      "We use your details only to respond to your enquiry, arrange appointments, prepare quotations and provide after-sales support.",
      "We do not sell your information. Where a financing enquiry requires an introduction to a lender, we share only what is necessary and only with your knowledge.",
    ],
  },
  {
    id: "storage",
    number: "03",
    heading: "Storage and retention",
    paragraphs: [
      "Enquiries submitted through this website are stored securely and kept for as long as necessary to serve you and to meet applicable record-keeping obligations.",
    ],
  },
  {
    id: "choices",
    number: "04",
    heading: "Your choices",
    paragraphs: [
      "You may ask us to correct or delete the personal information we hold about you. Contact us using the details below and we will review and act on your request in accordance with applicable requirements.",
    ],
  },
  {
    id: "changes",
    number: "05",
    heading: "Changes to this policy",
    paragraphs: [
      "If this policy changes, the updated version will be published on this page. We recommend checking this page periodically for the latest version.",
    ],
  },
];

function PrivacyPolicyPage() {
  return (
    <main>
      {/* HERO */}
      <section className="border-b bg-sand">
        <div className="container-page py-16 md:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow">Legal</p>

              <h1 className="mt-3 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[56px]">
                Privacy Policy
              </h1>

              <p className="mt-5 max-w-2xl text-[16px] leading-7 text-muted-foreground md:text-[17px]">
                How we handle the information you share with us through the
                BESEKI website.
              </p>
            </div>

            <div className="border-t pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-sm font-bold">
                    Your information matters.
                  </p>

                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    We aim to keep the information we collect limited to what
                    is needed to communicate with you and provide our services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POLICY CONTENT */}
      <section>
        <div className="container-page py-14 md:py-18 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
            {/* DESKTOP NAV */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  On this page
                </p>

                <nav className="mt-4 border-t">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="group flex items-center justify-between border-b py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span>
                        {section.number}. {section.heading}
                      </span>

                      <ChevronRight
                        className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </nav>

                <div className="mt-8 border-t pt-5">
                  <p className="text-xs leading-5 text-muted-foreground">
                    BESEKI COMPANY LIMITED
                    <br />
                    Mombasa, Kenya
                  </p>
                </div>
              </div>
            </aside>

            {/* MOBILE NAV */}
            <div className="lg:hidden">
              <div className="grid gap-2 sm:grid-cols-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center justify-between border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    <span>
                      <span className="mr-2 text-xs font-bold text-primary">
                        {section.number}
                      </span>
                      {section.heading}
                    </span>

                    <ChevronRight
                      className="size-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* ARTICLE */}
            <article className="max-w-3xl">
              <div className="mb-10 border-b pb-8">
                <p className="text-sm leading-7 text-muted-foreground">
                  This policy explains how BESEKI COMPANY LIMITED handles
                  personal information submitted through this website. It
                  applies to enquiries, appointments, trade-in requests,
                  financing requests, reviews and other forms submitted through
                  our online services.
                </p>
              </div>

              <div>
                {sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 border-b py-10 first:pt-0"
                  >
                    <div className="grid gap-5 sm:grid-cols-[52px_1fr]">
                      <span className="text-sm font-bold text-primary">
                        {section.number}
                      </span>

                      <div>
                        <h2 className="text-[24px] font-bold leading-tight tracking-[-0.015em] md:text-[28px]">
                          {section.heading}
                        </h2>

                        <div className="mt-5 space-y-4">
                          {section.paragraphs.map((paragraph) => (
                            <p
                              key={paragraph}
                              className="text-[15px] leading-7 text-muted-foreground"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              {/* INFORMATION WE COLLECT */}
              <section className="mt-10 border bg-sand p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center border bg-background">
                    <Check
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h2 className="text-[17px] font-bold">
                      A simple principle
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      We aim to collect information that is relevant to the
                      service you have requested and use it for that purpose.
                    </p>
                  </div>
                </div>
              </section>

              {/* CONTACT */}
              <section className="mt-12 border-t pt-10">
                <p className="eyebrow">Questions about privacy?</p>

                <h2 className="mt-3 text-[26px] font-bold leading-tight md:text-[32px]">
                  Speak to BESEKI directly.
                </h2>

                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                  If you have a question about information you have submitted
                  to us or want to request a correction or deletion, contact
                  our team using the details below.
                </p>

                <div className="mt-6 border-t">
                  <div className="grid gap-5 border-b py-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Company
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {company.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Location
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {company.addressOneLine}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 border-b py-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Phone
                      </p>
                      <a
                        href={`tel:${company.phone}`}
                        className="mt-1 block text-sm font-semibold hover:text-primary"
                      >
                        {company.phone}
                      </a>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Email
                      </p>
                      <a
                        href={`mailto:${company.email}`}
                        className="mt-1 block text-sm font-semibold hover:text-primary"
                      >
                        {company.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/contact">
                      Contact BESEKI
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link to="/terms">Terms & Conditions</Link>
                  </Button>
                </div>
              </section>

              {/* FOOTER NOTE */}
              <div className="mt-12 border-t pt-6">
                <p className="text-xs leading-5 text-muted-foreground">
                  This page provides general information about how BESEKI
                  handles website enquiries. The policy should be reviewed and
                  updated as your actual data practices, systems and applicable
                  Kenyan legal requirements evolve.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
