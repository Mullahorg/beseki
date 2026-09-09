import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { FAQAccordion } from "@/components/content/Cards";
import { faqGroups } from "@/data/faq";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/layout/Header";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      {
        title: "Frequently Asked Questions | BESEKI COMPANY LIMITED",
      },
      {
        name: "description",
        content:
          "Answers to common questions about buying a vehicle, financing, trade-ins, importation, documentation, warranty and test drives at BESEKI COMPANY LIMITED, Mombasa.",
      },
      {
        property: "og:title",
        content: "Frequently Asked Questions | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "Common questions about buying a car from BESEKI in Mombasa, answered.",
      },
      {
        property: "og:url",
        content: "/faq",
      },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqGroups.flatMap((group) =>
            group.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          ),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function FaqPage() {
  return (
    <>
      {/* HERO */}
      <section className="border-b bg-background">
        <div className="container-page">
          <div className="grid min-h-[500px] items-center gap-12 py-16 md:py-20 lg:grid-cols-[1fr_0.7fr] lg:gap-20">
            <div className="max-w-[720px]">
              <p className="eyebrow">Frequently asked questions</p>

              <h1 className="mt-5 max-w-[680px] text-[42px] font-bold leading-[1.02] tracking-[-0.04em] md:text-[58px] lg:text-[64px]">
                The answers before you make a decision.
              </h1>

              <p className="mt-6 max-w-[600px] text-[17px] leading-relaxed text-muted-foreground md:text-[18px]">
                From choosing a vehicle and arranging a test drive to
                financing, trade-ins and after-sales support, here are the
                questions we hear most often.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/inventory">
                    Browse Inventory
                    <ArrowRight
                      className="ml-2 size-4"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <a
                    href={whatsappLink(waMessages.general)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <WhatsAppIcon
                      className="mr-2 size-4 text-whatsapp"
                      aria-hidden="true"
                    />
                    Ask Us Directly
                  </a>
                </Button>
              </div>
            </div>

            <div className="border-t pt-7 lg:border-l lg:border-t-0 lg:pl-10">
              <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                <Search
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Looking for something specific?
              </p>

              <p className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
                Start with a category below.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Jump directly to questions about vehicles, financing,
                trade-ins, documentation, test drives and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CONTENT */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* CATEGORY NAV */}
          <aside className="lg:self-start">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow">Browse topics</p>

              <nav
                aria-label="FAQ categories"
                className="mt-5 border-t"
              >
                <ul>
                  {faqGroups.map((group, index) => {
                    const id = slugify(group.category);

                    return (
                      <li key={group.category}>
                        <a
                          href={`#${id}`}
                          className="group flex items-center justify-between gap-4 border-b py-3.5 text-[14px] font-medium transition-colors hover:text-primary"
                        >
                          <span>{group.category}</span>

                          <span className="text-xs text-muted-foreground transition-colors group-hover:text-primary">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-8 border-t pt-6">
                <p className="text-sm font-semibold">
                  Cannot find your answer?
                </p>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Speak directly with the BESEKI team. We are happy to help.
                </p>

                <a
                  href={whatsappLink(waMessages.general)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <MessageCircle
                    className="size-4"
                    aria-hidden="true"
                  />
                  WhatsApp us
                </a>
              </div>
            </div>
          </aside>

          {/* QUESTIONS */}
          <div className="min-w-0">
            <div className="space-y-16">
              {faqGroups.map((group, groupIndex) => {
                const id = slugify(group.category);

                return (
                  <section
                    key={group.category}
                    id={id}
                    className="scroll-mt-28"
                    aria-labelledby={`${id}-heading`}
                  >
                    <div className="flex items-start gap-5 border-b pb-5">
                      <span className="hidden text-xs font-semibold tracking-[0.18em] text-primary sm:block">
                        {String(groupIndex + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <p className="eyebrow">
                          Questions & answers
                        </p>

                        <h2
                          id={`${id}-heading`}
                          className="mt-2 text-2xl font-bold md:text-[30px]"
                        >
                          {group.category}
                        </h2>
                      </div>
                    </div>

                    <div className="mt-2">
                      <FAQAccordion
                        items={group.items}
                        idPrefix={id}
                      />
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* BUYING GUIDANCE */}
      <section className="border-y bg-muted/40">
        <div className="container-page py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="eyebrow">Still deciding?</p>

              <h2 className="mt-3 max-w-[430px] text-3xl font-bold leading-tight md:text-[40px]">
                You do not have to know everything before you call.
              </h2>
            </div>

            <div>
              <p className="max-w-[700px] text-[20px] font-medium leading-relaxed tracking-[-0.02em] md:text-[27px]">
                Tell us what you need, what you are comfortable spending and
                how you intend to use the vehicle. We can help you work through
                the options.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    Talk to the Team
                    <ArrowRight
                      className="ml-2 size-4"
                      aria-hidden="true"
                    />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link to="/financing">Explore Financing</Link>
                </Button>

                <Button size="lg" variant="outline" asChild>
                  <Link to="/trade-in">Value Your Trade-In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-14 md:py-18">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center md:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
                Have a question?
              </p>

              <h2 className="mt-3 max-w-[650px] text-3xl font-bold leading-tight tracking-tight md:text-[42px]">
                Ask us directly. We are here to help.
              </h2>

              <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed opacity-85">
                If your question is not covered above, call, WhatsApp or send
                us an enquiry and the BESEKI team will get back to you.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <a
                  href={whatsappLink(waMessages.general)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon
                    className="mr-2 size-4"
                    aria-hidden="true"
                  />
                  WhatsApp Us
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link to="/contact">
                  Contact BESEKI
                  <ArrowRight
                    className="ml-2 size-4"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
