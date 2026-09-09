import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading } from "@/components/common/Section";
import { TradeInForm } from "@/components/forms/TradeInForm";

export const Route = createFileRoute("/trade-in")({
  head: () => ({
    meta: [
      { title: "Trade In Your Car in Mombasa | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "Trade in your current vehicle against your next car at BESEKI COMPANY LIMITED, Mombasa. Send us the details and we will come back with an indicative figure.",
      },
      { property: "og:title", content: "Trade In Your Car in Mombasa | BESEKI COMPANY LIMITED" },
      {
        property: "og:description",
        content: "Use your current car as part payment towards your next one. Request a trade-in estimate today.",
      },
      { property: "og:url", content: "/trade-in" },
    ],
    links: [{ rel: "canonical", href: "/trade-in" }],
  }),
  component: TradeInPage,
});

function TradeInPage() {
  return (
    <>
      <PageHero
        eyebrow="Trade-In"
        title="Ready for an Upgrade? Trade In Your Car."
        subtitle="Put the value of your current vehicle towards your next one. Send us the details, and we will tell you honestly what we can do."
      />

      <Section>
        <SectionHeading eyebrow="How it works" title="Three steps, no obligation" />
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { n: "1", t: "Tell us about your car", c: "Make, model, year, mileage and condition — plus photos if you have them." },
            { n: "2", t: "We give an indicative figure", c: "A guide value based on what you have sent us and the current market." },
            { n: "3", t: "We inspect and confirm", c: "Bring the car to the yard so we can confirm the final figure in person." },
          ].map((s) => (
            <div key={s.n} className="border-t pt-5">
              <span className="text-[13px] font-bold text-primary">Step {s.n}</span>
              <h3 className="mt-2 text-[17px] font-bold">{s.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{s.c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="mx-auto max-w-3xl rounded-xl border bg-card p-6 md:p-10">
          <h2 className="text-xl font-bold">Tell us about your vehicle</h2>
          <p className="mt-2 text-[14.5px] text-muted-foreground">
            The more detail you give us, the closer our estimate will be.
          </p>
          <div className="mt-8">
            <TradeInForm />
          </div>
        </div>
      </Section>
    </>
  );
}
