import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/common/Section";
import { company } from "@/data/company";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About BESEKI COMPANY LIMITED | Mombasa Car Dealer" },
      {
        name: "description",
        content:
          "BESEKI COMPANY LIMITED sells new and locally used motor vehicles from Railway Station, along Lumumba Road, Mombasa. Learn who we are and how we work.",
      },
      { property: "og:title", content: "About BESEKI COMPANY LIMITED | Mombasa Car Dealer" },
      {
        property: "og:description",
        content: "Who we are, what we stand for, and why buyers in Mombasa work with BESEKI.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  { t: "Honesty first", c: "If a vehicle has a fault or a history worth knowing, we tell you before you ask." },
  { t: "Clear pricing", c: "The price on the listing is the price we are asking. No hidden add-ons appear later." },
  { t: "Patience", c: "Buying a car is a large decision. Take the time you need — we are not going to rush you." },
  { t: "Availability", c: "A real phone number, answered by real people, before and after the sale." },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A Mombasa dealership built on straight answers"
        subtitle={`${company.name} sells new and locally used motor vehicles from our yard at ${company.addressOneLine}.`}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 className="text-2xl font-bold leading-tight md:text-[30px]">Who we are</h2>
          <div className="space-y-4 text-[15.5px] leading-relaxed">
            <p>
              BESEKI COMPANY LIMITED is a motor vehicle dealership based in Mombasa. We sell new and locally used
              vehicles, and we help buyers who want something we do not currently have on the yard to find it.
            </p>
            <p>
              Our customers are people spending a significant amount of their own money. That shapes how we work: we
              show you the car properly, we answer questions directly, and we would rather lose a sale than talk
              somebody into the wrong vehicle.
            </p>
            <p>
              You can find us at the Railway Station, along Lumumba Road. Walk in, or message us first and we will have
              the vehicle you are interested in ready when you arrive.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 className="text-2xl font-bold leading-tight md:text-[30px]">Our mission</h2>
          <p className="text-[17px] leading-relaxed">
            To make buying a car in Mombasa feel straightforward — clear information, fair prices, and a team that is
            still reachable long after you have driven away.
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Our values" title="How we work" />
        <div className="grid gap-8 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.t} className="border-t pt-5">
              <h3 className="text-[17px] font-bold">{v.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{v.c}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 className="text-2xl font-bold leading-tight md:text-[30px]">Why choose BESEKI</h2>
          <div>
            <ul className="space-y-4 text-[15.5px] leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                Every vehicle is checked before it is listed, and you are free to bring your own mechanic.
              </li>
              <li className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                We handle sourcing and importation for buyers who want a specific vehicle.
              </li>
              <li className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                Trade-ins are welcome, with an honest assessment of what your current car is worth.
              </li>
              <li className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                Support continues after the sale — paperwork, servicing advice and warranty questions.
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/inventory">Browse Inventory</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Visit the Showroom</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
