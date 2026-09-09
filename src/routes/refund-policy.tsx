import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "How deposits, payments and refunds are handled at BESEKI COMPANY LIMITED, Mombasa. Terms are confirmed in writing for each individual sale.",
      },
      {
        property: "og:title",
        content: "Refund Policy | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "How deposits, payments and refunds are handled for each sale.",
      },
      {
        property: "og:url",
        content: "/refund-policy",
      },
    ],
    links: [{ rel: "canonical", href: "/refund-policy" }],
  }),
  component: RefundPolicyPage,
});

const legalPages = [
  {
    label: "Terms & Conditions",
    to: "/terms",
  },
  {
    label: "Privacy Policy",
    to: "/privacy-policy",
  },
  {
    label: "Refund Policy",
    to: "/refund-policy",
  },
];

function RefundPolicyPage() {
  return (
    <main>
      {/* HERO */}
      <section className="border-b bg-sand">
        <div className="container-page py-16 md:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Legal</p>

            <h1 className="mt-3 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[56px]">
              Refund Policy
            </h1>

            <p className="mt-5 max-w-2xl text-[16px] leading-7 text-muted-foreground md:text-[17px]">
              How deposits, payments and refunds are handled when purchasing a
              vehicle from BESEKI COMPANY LIMITED.
            </p>

            <p className="mt-5 text-sm text-muted-foreground">
              BESEKI COMPANY LIMITED · Mombasa, Kenya
            </p>
          </div>
        </div>
      </section>

      {/* LEGAL CONTENT */}
      <section className="border-b">
        <div className="container-page py-12 md:py-16">
          <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,720px)] lg:gap-16">
            {/* LEGAL NAVIGATION */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Legal information
              </p>

              <nav className="border-t">
                {legalPages.map((page) => {
                  const active = page.to === "/refund-policy";

                  return (
                    <Link
                      key={page.to}
                      to={page.to}
                      className={[
                        "flex items-center justify-between border-b py-3 text-sm transition-colors",
                        active
                          ? "font-semibold text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      ].join(" ")}
                    >
                      <span>{page.label}</span>

                      {active && (
                        <span className="size-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            {/* ARTICLE */}
            <article className="min-w-0">
              <div className="border-b pb-8">
                <p className="text-sm leading-6 text-muted-foreground">
                  This policy explains the general approach BESEKI COMPANY
                  LIMITED takes when handling deposits, cancellations, completed
                  sales and requests concerning payments. The specific terms of
                  an individual vehicle transaction are confirmed in the
                  relevant written agreement.
                </p>
              </div>

              {/* SECTION 01 */}
              <section className="border-b py-9 md:py-10">
                <div className="grid gap-5 sm:grid-cols-[48px_1fr]">
                  <span className="text-sm font-bold text-primary">01</span>

                  <div>
                    <h2 className="text-[22px] font-bold tracking-[-0.015em] md:text-[25px]">
                      Deposits
                    </h2>

                    <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground">
                      <p>
                        A deposit may be taken to reserve a vehicle while the
                        purchase process is being completed.
                      </p>

                      <p>
                        Whether a deposit is refundable, and the conditions
                        that apply to it, will be agreed and confirmed in
                        writing at the time the deposit is paid.
                      </p>

                      <p>
                        Customers should review those terms carefully before
                        making any payment.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 02 */}
              <section className="border-b py-9 md:py-10">
                <div className="grid gap-5 sm:grid-cols-[48px_1fr]">
                  <span className="text-sm font-bold text-primary">02</span>

                  <div>
                    <h2 className="text-[22px] font-bold tracking-[-0.015em] md:text-[25px]">
                      Completed sales
                    </h2>

                    <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground">
                      <p>
                        Once a vehicle sale has been completed and the vehicle
                        has been handed over, the transaction is generally
                        treated as final unless the applicable written sale
                        agreement provides otherwise.
                      </p>

                      <p>
                        This policy does not remove or limit any rights or
                        remedies available to a customer under applicable
                        Kenyan law.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 03 */}
              <section className="border-b py-9 md:py-10">
                <div className="grid gap-5 sm:grid-cols-[48px_1fr]">
                  <span className="text-sm font-bold text-primary">03</span>

                  <div>
                    <h2 className="text-[22px] font-bold tracking-[-0.015em] md:text-[25px]">
                      Cancellations
                    </h2>

                    <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground">
                      <p>
                        If you decide not to proceed with a vehicle purchase
                        before completion, please contact BESEKI as soon as
                        possible.
                      </p>

                      <p>
                        We will explain the applicable cancellation terms and
                        what happens to any amount already paid based on the
                        agreement made for that particular transaction.
                      </p>

                      <p>
                        Customers are encouraged to request clarification
                        before making a deposit or other payment.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 04 */}
              <section className="border-b py-9 md:py-10">
                <div className="grid gap-5 sm:grid-cols-[48px_1fr]">
                  <span className="text-sm font-bold text-primary">04</span>

                  <div>
                    <h2 className="text-[22px] font-bold tracking-[-0.015em] md:text-[25px]">
                      Faults after purchase
                    </h2>

                    <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground">
                      <p>
                        Warranty coverage varies depending on the vehicle and
                        the terms agreed at the time of purchase.
                      </p>

                      <p>
                        If a fault appears after purchase, customers should
                        contact the BESEKI team promptly and provide details of
                        the issue.
                      </p>

                      <p>
                        The applicable warranty or after-sales terms will then
                        be reviewed for the particular vehicle.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 05 */}
              <section className="border-b py-9 md:py-10">
                <div className="grid gap-5 sm:grid-cols-[48px_1fr]">
                  <span className="text-sm font-bold text-primary">05</span>

                  <div>
                    <h2 className="text-[22px] font-bold tracking-[-0.015em] md:text-[25px]">
                      Payment records
                    </h2>

                    <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground">
                      <p>
                        Customers should keep receipts, payment confirmations,
                        written agreements and other transaction records
                        relating to their vehicle purchase.
                      </p>

                      <p>
                        If you have a question about a payment or transaction
                        record, contact BESEKI and provide the relevant details
                        so our team can assist.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 06 */}
              <section className="py-9 md:py-10">
                <div className="grid gap-5 sm:grid-cols-[48px_1fr]">
                  <span className="text-sm font-bold text-primary">06</span>

                  <div>
                    <h2 className="text-[22px] font-bold tracking-[-0.015em] md:text-[25px]">
                      Questions about a refund
                    </h2>

                    <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground">
                      <p>
                        If you believe you may be entitled to a refund or need
                        clarification about a deposit or payment, please speak
                        to our team directly.
                      </p>

                      <p>
                        We will review the relevant transaction documents and
                        explain the applicable terms.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* IMPORTANT NOTE */}
              <div className="border bg-sand p-6 md:p-7">
                <div className="flex gap-4">
                  <Check
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />

                  <div>
                    <h2 className="text-base font-bold">
                      Before making a payment
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Make sure you understand the vehicle details, payment
                      amount, deposit terms, cancellation conditions and any
                      applicable warranty terms before completing your
                      transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* CONTACT CTA */}
              <div className="mt-10 flex flex-col gap-5 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">Need clarification?</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Speak to the BESEKI team before making a payment.
                  </p>
                </div>

                <Button asChild>
                  <Link to="/contact">
                    Contact BESEKI
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* FOOTER LEGAL REMINDER */}
      <section className="bg-background">
        <div className="container-page py-8">
          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              BESEKI COMPANY LIMITED · Mombasa, Kenya
            </p>

            <Link
              to="/"
              className="font-semibold text-foreground transition-colors hover:text-primary"
            >
              Back to website
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
