import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TeamMember } from "@/components/content/Cards";
import { teamProfiles } from "@/data/site";
import { company } from "@/data/company";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/layout/Header";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      {
        title: "Our Team | BESEKI COMPANY LIMITED, Mombasa",
      },
      {
        name: "description",
        content:
          "Meet the people behind BESEKI COMPANY LIMITED in Mombasa — sales, vehicle sourcing, importation and after-sales support.",
      },
      {
        property: "og:title",
        content: "Our Team | BESEKI COMPANY LIMITED, Mombasa",
      },
      {
        property: "og:description",
        content:
          "Meet the people behind BESEKI COMPANY LIMITED and the team you will deal with at our Lumumba Road showroom.",
      },
      {
        property: "og:url",
        content: "/team",
      },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <main>
      {/* HERO */}
      <section className="border-b bg-sand">
        <div className="container-page py-16 md:py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow">Our team</p>

              <h1 className="mt-3 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[56px]">
                The people behind BESEKI.
              </h1>

              <p className="mt-5 max-w-2xl text-[16px] leading-7 text-muted-foreground md:text-[17px]">
                A small, direct team focused on helping you find the right
                vehicle, understand the details and move through the buying
                process with confidence.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/contact">
                    Talk to the team
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>

                <Button variant="outline" asChild size="lg">
                  <Link to="/inventory">Browse vehicles</Link>
                </Button>
              </div>
            </div>

            <div className="border-t pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-sm font-semibold">
                Direct lines. Real people.
              </p>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                From your first enquiry to collection, we aim to keep the
                process clear and personal.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin
                  className="size-4 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{company.addressOneLine}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="border-b">
        <div className="container-page py-14 md:py-18 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="max-w-sm">
              <p className="eyebrow">Meet the team</p>

              <h2 className="mt-3 text-[30px] font-bold leading-tight tracking-[-0.02em] md:text-[38px]">
                People you can actually speak to.
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                Our team covers vehicle sales, sourcing, importation and
                after-sales support. The goal is simple: give customers useful
                information and make the process easier.
              </p>

              <div className="mt-7 border-t">
                <div className="flex gap-3 border-b py-4">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm">
                    Clear vehicle information
                  </span>
                </div>

                <div className="flex gap-3 border-b py-4">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm">
                    Straightforward communication
                  </span>
                </div>

                <div className="flex gap-3 border-b py-4">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm">
                    Support before and after purchase
                  </span>
                </div>
              </div>
            </div>

            <div>
              {teamProfiles.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2">
                  {teamProfiles.map((member) => (
                    <TeamMember key={member.id} member={member} />
                  ))}
                </div>
              ) : (
                <div className="border-y py-12">
                  <p className="text-sm text-muted-foreground">
                    Our team profiles will be available here soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="bg-sand">
        <div className="container-page py-14 md:py-18 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow">How we work</p>

              <h2 className="mt-3 text-[30px] font-bold leading-tight tracking-[-0.02em] md:text-[38px]">
                One conversation at a time.
              </h2>

              <p className="mt-4 max-w-md text-[15px] leading-7 text-muted-foreground">
                Buying a vehicle is a significant decision. We believe the
                people helping you make that decision should be accessible,
                knowledgeable and straightforward.
              </p>
            </div>

            <div className="border-t">
              <div className="grid gap-4 border-b py-6 sm:grid-cols-[52px_0.8fr_1fr]">
                <span className="text-sm font-bold text-primary">01</span>

                <h3 className="font-bold">Listen first</h3>

                <p className="text-sm leading-6 text-muted-foreground">
                  We start by understanding what you actually need — budget,
                  use, family requirements and preferences.
                </p>
              </div>

              <div className="grid gap-4 border-b py-6 sm:grid-cols-[52px_0.8fr_1fr]">
                <span className="text-sm font-bold text-primary">02</span>

                <h3 className="font-bold">Give you the details</h3>

                <p className="text-sm leading-6 text-muted-foreground">
                  Vehicle condition, specifications, pricing and the questions
                  that matter before you commit.
                </p>
              </div>

              <div className="grid gap-4 border-b py-6 sm:grid-cols-[52px_0.8fr_1fr]">
                <span className="text-sm font-bold text-primary">03</span>

                <h3 className="font-bold">Help you decide</h3>

                <p className="text-sm leading-6 text-muted-foreground">
                  Our role is to help you make an informed decision, not to
                  rush you into one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT TEAM */}
      <section className="border-t bg-ink text-ink-foreground">
        <div className="container-page py-14 md:py-18 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55">
                Speak with BESEKI
              </p>

              <h2 className="mt-3 text-[30px] font-bold leading-tight md:text-[40px]">
                Have a question about a vehicle?
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-white/70">
                Send us a message, call the showroom or visit us along Lumumba
                Road in Mombasa.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact">
                  Contact us
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>

              <a
                href={whatsappLink(waMessages.general)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER LINK */}
      <section>
        <div className="container-page py-8">
          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4" aria-hidden="true" />
              <span>BESEKI COMPANY LIMITED · Mombasa, Kenya</span>
            </div>

            <Link
              to="/"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
