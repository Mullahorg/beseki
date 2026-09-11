import { Link, createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/common/Section";
import { ContactForm } from "@/components/forms/Forms";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/Header";
import { useSettings } from "@/lib/site-context";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/warranty")({
  head: () => ({
    meta: [
      { title: "Warranty & After-Sales Support | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "Warranty coverage varies by vehicle at BESEKI COMPANY LIMITED, Mombasa. Contact our team for the specific warranty terms applicable to your vehicle.",
      },
      {
        property: "og:title",
        content: "Warranty & After-Sales Support | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "Ask our Mombasa team about the warranty terms for a specific vehicle.",
      },
      { property: "og:url", content: "/warranty" },
    ],
    links: [{ rel: "canonical", href: "/warranty" }],
  }),
  component: WarrantyPage,
});

function WarrantyPage() {
  const company = useSettings();
  return (
    <>
      {/* Editorial Hero */}
      <section className="border-b bg-background">
        <div className="container-page grid min-h-[500px] items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow">Warranty & After-Sales</p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Buying the car is
              <span className="block text-brand-red">
                only part of the relationship.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Warranty coverage differs from one vehicle to the next. We
              believe you should know exactly what applies to the car you are
              considering rather than rely on a generic promise.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href="#warranty-enquiry">Ask About Warranty</a>
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

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
              <span>Vehicle-specific coverage</span>
              <span>•</span>
              <span>Clear terms</span>
              <span>•</span>
              <span>After-sales support</span>
            </div>
          </div>

          <div className="relative min-h-[350px] overflow-hidden rounded-2xl border bg-muted md:min-h-[430px]">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-red/10" />

            <div className="absolute inset-x-6 bottom-6 rounded-xl border bg-background/95 p-6 backdrop-blur-sm md:inset-x-8 md:bottom-8">
              <p className="eyebrow">Our approach</p>
              <h2 className="mt-2 text-xl font-bold">
                Clear information. Real support.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If you have a question about warranty coverage, servicing,
                paperwork or an issue after purchase, speak to our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Philosophy */}
      <Section>
        <div className="grid gap-12 md:grid-cols-[0.75fr_1.25fr] md:gap-20">
          <div>
            <p className="eyebrow">Warranty coverage</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              We explain what
              <span className="block text-muted-foreground">
                actually applies.
              </span>
            </h2>
          </div>

          <div className="space-y-8">
            <p className="max-w-3xl text-[16px] leading-relaxed">
              Warranty terms can depend on the individual vehicle, its
              condition, age, mileage and the terms agreed at the time of
              purchase. That is why we do not publish a blanket coverage
              period that may not apply to every vehicle.
            </p>

            <div className="grid gap-8 sm:grid-cols-2">
              {[
                {
                  title: "Specific to your vehicle",
                  text: "Ask us about the exact coverage attached to the vehicle you are considering.",
                },
                {
                  title: "Clear terms",
                  text: "We can explain what is covered, the applicable period and any relevant conditions.",
                },
                {
                  title: "Support after purchase",
                  text: "If something needs attention after you buy, contact our team and we will help you understand the next step.",
                },
                {
                  title: "Honest communication",
                  text: "If an issue is outside warranty coverage, we will tell you rather than create unrealistic expectations.",
                },
              ].map((item) => (
                <div key={item.title} className="border-t pt-5">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* After Sales */}
      <section className="border-y bg-muted/40">
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
            <div>
              <p className="eyebrow">After-sales support</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                We stay reachable
                <span className="block text-muted-foreground">
                  after the handover.
                </span>
              </h2>
            </div>

            <div className="divide-y border-t">
              {[
                {
                  number: "01",
                  title: "Warranty enquiries",
                  text: "Tell us which vehicle you are considering or which one you purchased, and we will confirm the applicable warranty terms.",
                },
                {
                  number: "02",
                  title: "Service support",
                  text: "We can advise on servicing intervals and help coordinate repairs, whether or not the work falls under a warranty.",
                },
                {
                  number: "03",
                  title: "Vehicle paperwork",
                  text: "Questions about ownership transfer, documentation or other post-sale paperwork? Get in touch and we will point you in the right direction.",
                },
                {
                  number: "04",
                  title: "Something does not feel right?",
                  text: "If you notice a warning light, unusual issue or anything you are unsure about, contact us before assuming what the problem is.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="grid gap-4 py-7 sm:grid-cols-[70px_1fr] sm:gap-6"
                >
                  <span className="text-sm font-bold text-brand-red">
                    {item.number}
                  </span>

                  <div>
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section
        id="warranty-enquiry"
        className="scroll-mt-28 border-b bg-background"
      >
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="max-w-xl">
              <p className="eyebrow">Warranty enquiry</p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Need to know what is covered?
              </h2>

              <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
                Send us the vehicle details and your question. Our team will
                review the enquiry and come back with the applicable
                information.
              </p>

              <div className="mt-8 border-t pt-6">
                <p className="text-sm font-semibold">Prefer to speak directly?</p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button size="lg" variant="secondary" asChild>
                    <a href={`tel:${company.phoneTel}`}>
                      Call {company.phoneDisplay}
                    </a>
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
            </div>

            <div className="rounded-2xl border bg-card p-6 md:p-10">
              <h3 className="text-xl font-bold">
                Send a warranty enquiry
              </h3>

              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                Include the make, model, registration or stock reference if
                available, and your question about the warranty.
              </p>

              <div className="mt-7">
                <ContactForm defaultSubject="Warranty enquiry" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-red text-white">
        <div className="container-page flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between md:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
              Looking for your next vehicle?
            </p>

            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              Explore the BESEKI inventory.
            </h2>

            <p className="mt-2 text-sm text-white/80">
              Find a vehicle, compare your options and speak with our team.
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
