import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/common/Section";
import { FAQAccordion } from "@/components/content/Cards";
import { faqGroups } from "@/data/faq";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "Answers to common questions about buying a vehicle, financing, trade-ins, importation, documentation, warranty and test drives at BESEKI COMPANY LIMITED, Mombasa.",
      },
      { property: "og:title", content: "Frequently Asked Questions | BESEKI COMPANY LIMITED" },
      { property: "og:description", content: "Common questions about buying a car from BESEKI in Mombasa, answered." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqGroups.flatMap((g) =>
            g.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          ),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions we are asked often"
        subtitle="If your question is not here, call or message us — we would rather answer it directly."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="FAQ categories" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Categories</p>
            <ul className="mt-3 space-y-2">
              {faqGroups.map((g) => (
                <li key={g.category}>
                  <a
                    href={`#${g.category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-[14.5px] text-muted-foreground hover:text-primary"
                  >
                    {g.category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-12">
            {faqGroups.map((g) => (
              <section key={g.category} id={g.category.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-28">
                <h2 className="text-xl font-bold">{g.category}</h2>
                <div className="mt-4">
                  <FAQAccordion items={g.items} idPrefix={g.category.toLowerCase().replace(/\s+/g, "-")} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
