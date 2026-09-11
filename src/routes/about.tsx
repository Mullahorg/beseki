import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { useSettings } from "@/lib/site-context";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About BESEKI COMPANY LIMITED | Mombasa Car Dealer" },
      {
        name: "description",
        content:
          "BESEKI COMPANY LIMITED sells new and locally used motor vehicles from Railway Station, along Lumumba Road, Mombasa. Learn who we are and how we work.",
      },
      {
        property: "og:title",
        content: "About BESEKI COMPANY LIMITED | Mombasa Car Dealer",
      },
      {
        property: "og:description",
        content:
          "Who we are, what we stand for, and why buyers in Mombasa work with BESEKI.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  {
    number: "01",
    title: "Honesty first",
    description:
      "If a vehicle has a fault or a history worth knowing, we tell you before you ask.",
  },
  {
    number: "02",
    title: "Clear pricing",
    description:
      "The price on the listing is the price we are asking. We keep the conversation straightforward.",
  },
  {
    number: "03",
    title: "No pressure",
    description:
      "Buying a car is a significant decision. Take the time you need to choose the right vehicle.",
  },
  {
    number: "04",
    title: "We stay reachable",
    description:
      "Our relationship does not end when the keys change hands. We remain available when you need us.",
  },
];

const reasons = [
  "Vehicles are checked before they are listed.",
  "You are welcome to bring your own mechanic.",
  "We can source specific vehicles on request.",
  "Trade-ins are considered with a proper assessment.",
  "We assist with vehicle paperwork and after-sales questions.",
  "Our team remains reachable after purchase.",
];

function AboutPage() {
  const company = useSettings();
  return (
    <>
      {/* HERO */}
      <section className="border-b bg-background">
        <div className="container-page">
          <div className="grid min-h-[520px] items-end gap-12 py-16 md:min-h-[600px] md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div className="max-w-[720px]">
              <p className="eyebrow">About BESEKI</p>

              <h1 className="mt-5 max-w-[680px] text-[40px] font-bold leading-[1.05] tracking-[-0.035em] md:text-[56px] lg:text-[64px]">
                A Mombasa dealership built on straight answers.
              </h1>

              <p className="mt-6 max-w-[590px] text-[17px] leading-relaxed text-muted-foreground md:text-[18px]">
                {company.companyName} sells new and locally used motor vehicles from
                our yard at {company.addressOneLine}. We believe buying a car
                should feel clear, personal and well informed.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/inventory">
                    Browse Inventory
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Visit the Showroom</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-muted">
                <div className="absolute inset-0 flex items-end p-8">
                  <div className="max-w-[300px]">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      BESEKI COMPANY LIMITED
                    </p>
                    <p className="mt-3 text-2xl font-bold leading-tight">
                      Railway Station
                      <br />
                      Lumumba Road, Mombasa
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-3 max-w-[360px] text-2xl font-bold leading-tight md:text-[32px]">
              A dealership that keeps the conversation simple.
            </h2>
          </div>

          <div className="max-w-[720px] space-y-5 text-[16px] leading-relaxed">
            <p>
              BESEKI COMPANY LIMITED is a motor vehicle dealership based in
              Mombasa. We sell new and locally used vehicles and help buyers
              source something specific when it is not currently available on
              our yard.
            </p>

            <p>
              Our customers are making a significant purchase. That means the
              way we work matters just as much as the vehicle itself. We show
              you the car properly, answer questions directly and give you
              room to make a decision.
            </p>

            <p>
              You can find us at the Railway Station, along Lumumba Road. If
              there is a vehicle you want to see, message us before you visit
              and we can help make sure it is ready for you.
            </p>
          </div>
        </div>
      </Section>

      {/* MISSION */}
      <section className="border-y bg-muted/40">
        <div className="container-page py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="eyebrow">Our mission</p>
              <h2 className="mt-3 text-2xl font-bold md:text-[32px]">
                Make buying a car feel straightforward.
              </h2>
            </div>

            <div>
              <p className="max-w-[760px] text-[22px] font-medium leading-relaxed tracking-[-0.015em] md:text-[30px]">
                Clear information. Fair prices. A team that remains reachable
                long after you have driven away.
              </p>

              <div className="mt-8 h-px w-full bg-border" />

              <p className="mt-6 max-w-[650px] text-[15px] leading-relaxed text-muted-foreground">
                From choosing the right vehicle to arranging a viewing,
                discussing financing, handling a trade-in or getting support
                after purchase, our goal is to make each step easier to
                understand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <Section>
        <div className="mb-10 max-w-[620px]">
          <p className="eyebrow">Our values</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-[40px]">
            How we work.
          </h2>
        </div>

        <div className="grid border-t sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.number}
              className="border-b py-7 sm:px-6 sm:first:pl-0 sm:nth-[2n+1]:border-r lg:py-9"
            >
              <span className="text-xs font-semibold tracking-[0.16em] text-primary">
                {value.number}
              </span>

              <h3 className="mt-4 text-xl font-bold">{value.title}</h3>

              <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* WHY BESEKI */}
      <Section tone="sand">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow">Why BESEKI</p>

            <h2 className="mt-3 max-w-[400px] text-3xl font-bold leading-tight md:text-[40px]">
              The things that matter when choosing a dealer.
            </h2>

            <p className="mt-5 max-w-[400px] text-[15px] leading-relaxed text-muted-foreground">
              We want you to leave knowing exactly what you bought, what comes
              next and who to contact if you need help.
            </p>
          </div>

          <div>
            <div className="border-t">
              {reasons.map((reason) => (
                <div
                  key={reason}
                  className="flex gap-4 border-b py-5 text-[15px] leading-relaxed"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                  </span>

                  <span>{reason}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/inventory">
                  See Available Vehicles
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Talk to Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* LOCATION */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow">Come and see us</p>

            <h2 className="mt-3 max-w-[600px] text-3xl font-bold leading-tight md:text-[42px]">
              The right car is easier to choose when you can see it properly.
            </h2>

            <p className="mt-5 max-w-[570px] text-[16px] leading-relaxed text-muted-foreground">
              Visit our showroom at Railway Station, along Lumumba Road,
              Mombasa. Prefer to speak first? Call or WhatsApp us and we will
              help you plan your visit.
            </p>
          </div>

          <div className="lg:text-right">
            <p className="text-sm font-semibold text-muted-foreground">
              SHOWROOM
            </p>

            <p className="mt-2 text-xl font-bold">
              {company.addressOneLine}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 lg:justify-end">
              <Button variant="outline" asChild>
                <Link to="/contact">Get Directions</Link>
              </Button>

              <Button asChild>
                <Link to="/inventory">Browse Cars</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-75">
                Start your search
              </p>

              <h2 className="mt-3 max-w-[650px] text-3xl font-bold leading-tight md:text-[44px]">
                Looking for your next vehicle?
              </h2>

              <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed opacity-85">
                Browse our current inventory or speak directly with the BESEKI
                team about what you are looking for.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                variant="secondary"
                asChild
              >
                <Link to="/inventory">
                  Browse Inventory
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link to="/contact">Contact BESEKI</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
