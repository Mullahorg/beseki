import { Link, createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/common/Section";
import { LegalPage } from "@/components/common/LegalPage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "The terms that apply to using the BESEKI COMPANY LIMITED website, including vehicle listings, pricing, availability and enquiries.",
      },
      {
        property: "og:title",
        content: "Terms & Conditions | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "Terms that apply to using this website and enquiring about vehicles.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      {/* Editorial Legal Hero */}
      <section className="border-b bg-background">
        <div className="container-page py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="eyebrow">Legal</p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Terms &
              <span className="block text-brand-red">Conditions</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              The terms that apply when you use the BESEKI website, browse our
              vehicle listings or contact our team about a vehicle.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
              <span>Website use</span>
              <span>•</span>
              <span>Vehicle listings</span>
              <span>•</span>
              <span>Enquiries & appointments</span>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Content */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
          <aside className="hidden lg:block">
            <div className="sticky top-28 border-t pt-5">
              <p className="eyebrow">On this page</p>

              <nav className="mt-5 space-y-3 text-sm">
                {[
                  ["Using this website", "#using-this-website"],
                  ["Vehicle listings", "#vehicle-listings"],
                  ["Pricing", "#pricing"],
                  ["Financing estimates", "#financing-estimates"],
                  ["Enquiries", "#enquiries"],
                  ["Information accuracy", "#information-accuracy"],
                  ["Intellectual property", "#intellectual-property"],
                ].map(([label, href]) => (
                  <a
                    key={href}
                    href={href}
                    className="block text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="max-w-3xl">
            <div className="mb-12 border-l-4 border-brand-red bg-sand p-6">
              <p className="text-[15px] leading-relaxed">
                Please read these terms before using this website or relying
                on information contained in a vehicle listing. A website
                enquiry does not create a binding vehicle reservation or
                purchase agreement.
              </p>
            </div>

            <div className="divide-y">
              <section
                id="using-this-website"
                className="scroll-mt-28 py-9 first:pt-0"
              >
                <p className="text-sm font-bold text-brand-red">01</p>
                <h2 className="mt-2 text-2xl font-bold">
                  Using this website
                </h2>

                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p>
                    By using this website, you agree to use it lawfully and in
                    a way that does not interfere with its operation or
                    compromise the security, availability or functionality of
                    the website.
                  </p>

                  <p>
                    You must not misuse our enquiry forms, submit misleading
                    information, attempt to gain unauthorised access to any
                    part of the website or use the website for fraudulent or
                    unlawful purposes.
                  </p>
                </div>
              </section>

              <section
                id="vehicle-listings"
                className="scroll-mt-28 py-9"
              >
                <p className="text-sm font-bold text-brand-red">02</p>
                <h2 className="mt-2 text-2xl font-bold">
                  Vehicle listings & availability
                </h2>

                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p>
                    We make reasonable efforts to keep vehicle listings,
                    specifications, photographs, mileage and availability
                    accurate and current.
                  </p>

                  <p>
                    However, vehicle information can change. A vehicle may be
                    sold, reserved, withdrawn or have its specification or
                    asking price changed without the website being updated
                    immediately.
                  </p>

                  <p>
                    Vehicles are sold subject to availability at the time of
                    purchase. Please confirm the exact vehicle, specification,
                    condition and price with our team before making a purchase
                    decision.
                  </p>

                  <p>
                    Photographs are provided to help you understand the
                    vehicle. They should not replace a physical inspection.
                    We strongly recommend inspecting the vehicle in person
                    before committing to a purchase.
                  </p>
                </div>
              </section>

              <section id="pricing" className="scroll-mt-28 py-9">
                <p className="text-sm font-bold text-brand-red">03</p>
                <h2 className="mt-2 text-2xl font-bold">Pricing</h2>

                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p>
                    Prices displayed on this website are stated in Kenya
                    Shillings and represent our asking prices unless expressly
                    stated otherwise.
                  </p>

                  <p>
                    Unless confirmed otherwise in writing, advertised prices
                    do not include transfer, registration, insurance,
                    financing, government or other third-party costs that may
                    apply to the transaction.
                  </p>

                  <p>
                    The final transaction price and applicable costs should be
                    confirmed with BESEKI before payment or completion of a
                    purchase.
                  </p>
                </div>
              </section>

              <section
                id="financing-estimates"
                className="scroll-mt-28 py-9"
              >
                <p className="text-sm font-bold text-brand-red">04</p>
                <h2 className="mt-2 text-2xl font-bold">
                  Financing estimates
                </h2>

                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p>
                    Any financing calculator or repayment estimate provided
                    on this website is for general guidance only.
                  </p>

                  <p>
                    It is not an offer of credit, a loan approval or a
                    guarantee that financing will be available on the
                    displayed terms.
                  </p>

                  <p>
                    Actual interest rates, repayment amounts, deposits,
                    processing fees, loan periods and eligibility requirements
                    are determined by the relevant lender and your individual
                    application.
                  </p>
                </div>
              </section>

              <section id="enquiries" className="scroll-mt-28 py-9">
                <p className="text-sm font-bold text-brand-red">05</p>
                <h2 className="mt-2 text-2xl font-bold">
                  Enquiries & appointments
                </h2>

                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p>
                    Submitting a contact form, WhatsApp enquiry, test-drive
                    request, financing request or appointment request does not
                    create a binding reservation or purchase agreement.
                  </p>

                  <p>
                    A vehicle is only considered held or reserved when this
                    has been expressly agreed with our team.
                  </p>

                  <p>
                    Appointment and test-drive availability is subject to
                    confirmation by BESEKI and may depend on vehicle
                    availability and operational circumstances.
                  </p>
                </div>
              </section>

              <section
                id="information-accuracy"
                className="scroll-mt-28 py-9"
              >
                <p className="text-sm font-bold text-brand-red">06</p>
                <h2 className="mt-2 text-2xl font-bold">
                  Information accuracy
                </h2>

                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p>
                    We aim to provide useful and accurate information, but
                    website content may contain errors, omissions or
                    information that has become outdated.
                  </p>

                  <p>
                    If you notice an apparent error in a listing or other
                    website content, please contact us so that we can review
                    and, where appropriate, correct it.
                  </p>

                  <p>
                    Information on this website should therefore be verified
                    with our team before you rely on it for a purchase,
                    financing decision or other transaction.
                  </p>
                </div>
              </section>

              <section
                id="intellectual-property"
                className="scroll-mt-28 py-9"
              >
                <p className="text-sm font-bold text-brand-red">07</p>
                <h2 className="mt-2 text-2xl font-bold">
                  Intellectual property
                </h2>

                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
                  <p>
                    Unless otherwise stated, the content of this website,
                    including text, photographs, branding, graphics, layouts
                    and other materials, belongs to BESEKI COMPANY LIMITED or
                    is used with appropriate permission.
                  </p>

                  <p>
                    You may view and use the website for legitimate personal
                    or business enquiry purposes, but you must not reproduce,
                    redistribute, modify or commercially exploit our content
                    without permission.
                  </p>
                </div>
              </section>
            </div>
          </article>
        </div>
      </Section>

      {/* Important Reminder */}
      <section className="border-y bg-muted/40">
        <div className="container-page py-14 md:py-16">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <p className="eyebrow">Before you purchase</p>

              <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                Always confirm the vehicle details with our team.
              </h2>

              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Vehicle condition, specification, price, availability and
                applicable terms should be confirmed before you commit to a
                purchase.
              </p>
            </div>

            <Button size="lg" asChild className="w-full md:w-auto">
              <Link to="/contact">Contact BESEKI</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Legal Navigation */}
      <section className="bg-background">
        <div className="container-page flex flex-wrap gap-x-6 gap-y-3 py-8 text-sm">
          <Link
            to="/privacy-policy"
            className="font-medium text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>

          <Link
            to="/contact"
            className="font-medium text-muted-foreground hover:text-foreground"
          >
            Contact Us
          </Link>

          <Link
            to="/inventory"
            className="font-medium text-muted-foreground hover:text-foreground"
          >
            Browse Inventory
          </Link>
        </div>
      </section>
    </>
  );
}
