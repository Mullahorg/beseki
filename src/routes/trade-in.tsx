import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { WhatsAppIcon } from "@/components/layout/Header";
import { TradeInForm } from "@/components/forms/TradeInForm";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/trade-in")({
  head: () => ({
    meta: [
      { title: "Trade In Your Car in Mombasa | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "Trade in your current vehicle against your next car at BESEKI COMPANY LIMITED, Mombasa. Send us the details and we will come back with an indicative figure.",
      },
      {
        property: "og:title",
        content: "Trade In Your Car in Mombasa | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "Use your current car as part payment towards your next one. Request a trade-in estimate today.",
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
      {/* Editorial Hero */}
      <section className="border-b bg-background">
        <div className="container-page grid min-h-[520px] items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Trade-In</p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Move into your next car
              <span className="block text-brand-red">without starting from zero.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Put the value of your current vehicle towards your next one.
              Tell us what you drive, share a few details, and our team will
              come back with an indicative figure.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#trade-in-form">Get a Trade-In Estimate</a>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <a
                  href={whatsappLink(waMessages.general)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon className="size-4 text-whatsapp" />
                  Talk to Us
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
              <span>No obligation</span>
              <span>•</span>
              <span>Indicative valuation</span>
              <span>•</span>
              <span>Physical inspection required</span>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-2xl border bg-muted md:min-h-[440px]">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-red/10" />

            <div className="absolute inset-x-6 bottom-6 rounded-xl border bg-background/95 p-6 backdrop-blur-sm md:inset-x-8 md:bottom-8">
              <p className="eyebrow">Simple process</p>
              <h2 className="mt-2 text-xl font-bold">
                Your current car can help fund the next one.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Start with an online estimate, then bring your vehicle to our
                Mombasa yard for an inspection and final valuation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <Section>
        <div className="grid gap-12 md:grid-cols-[0.75fr_1.25fr] md:gap-20">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Three steps.
              <span className="block text-muted-foreground">
                No unnecessary complexity.
              </span>
            </h2>
          </div>

          <div className="divide-y border-t">
            {[
              {
                n: "01",
                title: "Tell us about your car",
                text: "Share the make, model, year, mileage, condition and any other useful details. Photos are helpful too.",
              },
              {
                n: "02",
                title: "Receive an indicative figure",
                text: "We review the information you provide and give you a guide value based on the vehicle and current market conditions.",
              },
              {
                n: "03",
                title: "We inspect and confirm",
                text: "Bring the vehicle to our yard so our team can inspect it and confirm the final trade-in figure.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="grid gap-4 py-7 sm:grid-cols-[80px_1fr] sm:gap-6"
              >
                <span className="text-sm font-bold text-brand-red">
                  {step.n}
                </span>

                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Form */}
      <section id="trade-in-form" className="scroll-mt-28 border-y bg-muted/40">
        <div className="container-page py-16 md:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow">Start your valuation</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Tell us about your vehicle
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted-foreground">
                The more information you provide, the better we can understand
                your vehicle and prepare an indicative estimate.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 md:p-10">
              <TradeInForm />
            </div>
          </div>
        </div>
      </section>

      {/* What We Look At */}
      <Section>
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-start">
          <div>
            <p className="eyebrow">What matters</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              We look at the whole vehicle.
            </h2>
          </div>

          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {[
              {
                title: "Condition",
                text: "Overall mechanical, interior and exterior condition.",
              },
              {
                title: "Mileage",
                text: "Current mileage and how it compares with the vehicle's age.",
              },
              {
                title: "History",
                text: "Service history, ownership information and available records.",
              },
              {
                title: "Market demand",
                text: "The current market for your particular make, model and specification.",
              },
            ].map((item) => (
              <div key={item.title} className="border-t pt-4">
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Reassurance */}
      <section className="border-y bg-brand-blue text-white">
        <div className="container-page grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-center md:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
              Prefer to speak directly?
            </p>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">
              Bring your car to the BESEKI team in Mombasa.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">
              If you would rather discuss your vehicle first, send us a
              WhatsApp message and our team will guide you through the process.
            </p>
          </div>

          <Button
            size="lg"
            variant="secondary"
            asChild
            className="w-full md:w-auto"
          >
            <a
              href={whatsappLink(waMessages.general)}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon className="size-4 text-whatsapp" />
              WhatsApp BESEKI
            </a>
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-red text-white">
        <div className="container-page flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
              Ready for the next step?
            </p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Find your next vehicle.
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Explore the vehicles currently listed by BESEKI.
            </p>
          </div>

          <Button
            size="lg"
            variant="secondary"
            asChild
            className="w-full md:w-auto"
          >
            <Link to="/inventory">Browse Inventory</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
