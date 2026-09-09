import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { WhatsAppIcon } from "@/components/layout/Header";
import { services } from "@/data/site";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services | BESEKI COMPANY LIMITED, Mombasa" },
      {
        name: "description",
        content:
          "Vehicle inspection, sourcing, importation assistance, maintenance and after-sales support from BESEKI COMPANY LIMITED in Mombasa.",
      },
      {
        property: "og:title",
        content: "Our Services | BESEKI COMPANY LIMITED, Mombasa",
      },
      {
        property: "og:description",
        content:
          "Inspection, sourcing, importation assistance, maintenance and after-sales support in Mombasa.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b bg-muted/20">
        <div className="container-page grid min-h-[440px] items-center gap-10 py-16 lg:grid-cols-[1fr_0.85fr] lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Our Services
            </p>

            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
              More than just selling cars.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              From finding the right vehicle to inspection, sourcing,
              importation assistance and support after the sale, we're here to
              make the process easier.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/contact">Talk to Our Team</Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <a
                  href={whatsappLink(waMessages.general)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon className="size-4 text-whatsapp" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-background">
            <div className="aspect-[4/3] bg-gradient-to-br from-brand-blue/10 via-background to-brand-red/10">
              <div className="flex h-full flex-col justify-between p-7 sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-blue">
                    BESEKI
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Mombasa
                  </span>
                </div>

                <div>
                  <div className="mb-5 h-px w-16 bg-brand-red" />
                  <p className="max-w-sm text-2xl font-bold leading-tight sm:text-3xl">
                    Support that continues beyond the showroom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">
              What We Do
            </p>

            <h2 className="mt-3 max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
              The details around the car matter too.
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Buying a vehicle is more than choosing a model. Our services are
            designed to help you make informed decisions, handle important
            steps with confidence and know where to turn when you need us.
          </p>
        </div>
      </Section>

      {/* SERVICES */}
      <section className="border-y bg-background">
        <div className="container-page">
          {services.map((service, i) => (
            <article
              key={service.slug}
              id={service.slug}
              className={cn(
                "grid scroll-mt-28 gap-8 border-b py-12 last:border-b-0 md:grid-cols-[0.7fr_1.3fr] md:gap-20 md:py-16",
              )}
            >
              {/* NUMBER + TITLE */}
              <div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold tabular-nums text-brand-red">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="h-px w-10 bg-border" />
                </div>

                <h2 className="mt-6 max-w-md text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                  {service.title}
                </h2>

                <p className="mt-4 max-w-md text-[15px] leading-6 text-muted-foreground">
                  {service.summary}
                </p>
              </div>

              {/* DETAIL */}
              <div className="max-w-2xl">
                <p className="text-[16px] leading-7 text-foreground/90">
                  {service.detail}
                </p>

                {service.points?.length > 0 && (
                  <div className="mt-8 grid gap-0 border-y sm:grid-cols-2">
                    {service.points.map((point, pointIndex) => (
                      <div
                        key={point}
                        className={cn(
                          "flex gap-3 border-b py-4 text-[14.5px] text-muted-foreground sm:pr-6",
                          pointIndex >= service.points.length - 2 &&
                            "sm:border-b-0",
                          pointIndex === service.points.length - 1 &&
                            "border-b-0",
                        )}
                      >
                        <span
                          className="mt-[7px] size-1.5 shrink-0 rounded-full bg-brand-blue"
                          aria-hidden="true"
                        />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-7">
                  <a
                    href={whatsappLink(
                      `${waMessages.general} I'm interested in ${service.title}.`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition hover:gap-3"
                  >
                    <WhatsAppIcon className="size-4 text-whatsapp" />
                    Ask about this service
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SERVICE PRINCIPLES */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
              The BESEKI Approach
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple. Clear. Human.
            </h2>
          </div>

          <div className="grid gap-0 border-y sm:grid-cols-3">
            <div className="border-b p-6 sm:border-b-0 sm:border-r">
              <p className="text-lg font-bold">01</p>
              <h3 className="mt-3 font-semibold">Listen first</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We start with what you actually need from your vehicle.
              </p>
            </div>

            <div className="border-b p-6 sm:border-b-0 sm:border-r">
              <p className="text-lg font-bold">02</p>
              <h3 className="mt-3 font-semibold">Guide clearly</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We explain the important details so you can decide confidently.
              </p>
            </div>

            <div className="p-6">
              <p className="text-lg font-bold">03</p>
              <h3 className="mt-3 font-semibold">Stay reachable</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Our relationship doesn't have to end when you drive away.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="border-t bg-brand-red text-white">
        <div className="container-page flex flex-col gap-7 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              Need a hand?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Let's talk about what you need.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
              Tell us what you're looking for and our team in Mombasa will
              guide you on the next step.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-white text-brand-red hover:bg-white/90"
            >
              <Link to="/contact">Contact Us</Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a
                href={whatsappLink(waMessages.general)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon className="size-4 text-whatsapp" />
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
