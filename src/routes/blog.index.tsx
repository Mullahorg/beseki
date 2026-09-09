import { Link, createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/common/Section";
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
          "Terms that apply to using the BESEKI website and enquiring about vehicles.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

const sections = [
  ["using-this-website", "Using this website"],
  ["vehicle-listings", "Vehicle listings"],
  ["pricing", "Pricing"],
  ["financing-estimates", "Financing"],
  ["enquiries", "Enquiries & appointments"],
  ["information-accuracy", "Information accuracy"],
  ["intellectual-property", "Intellectual property"],
];

function TermsPage() {
  return (
    <>
      {/* ---------------------------------------------------------
          HERO
      --------------------------------------------------------- */}
      <section className="border-b bg-background">
        <div className="container-page py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <p className="eyebrow">Legal</p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
                Terms &
                <span className="block text-brand-red">Conditions</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                The terms that apply when you use the BESEKI website, browse
                our vehicle listings or contact our team about a vehicle.
              </p>
            </div>

            <div className="border-t pt-4 text-sm text-muted-foreground lg:min-w-[190px]">
              <p className="font-medium text-foreground">BESEKI COMPANY LIMITED</p>
              <p className="mt-1">Mombasa, Kenya</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5 text-[13px] text-muted-foreground">
            <span>Website use</span>
            <span aria-hidden="true">•</span>
            <span>Vehicle listings</span>
            <span aria-hidden="true">•</span>
            <span>Pricing</span>
            <span aria-hidden="true">•</span>
            <span>Enquiries & appointments</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          CONTENT
      --------------------------------------------------------- */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,760px)] lg:justify-between lg:gap-16">
          {/* Desktop contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 border-t pt-5">
              <p className="eyebrow">On this page</p>

              <nav className="mt-5 space-y-1" aria-label="Terms sections">
                {sections.map(([href, label], index) => (
                  <a
                    key={href}
                    href={`#${href}`}
                    className="group flex items-start gap-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="w-5 shrink-0 text-[11px] font-semibold text-brand-red">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span>{label}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal article */}
          <article className="max-w-3xl">
            {/* Intro notice */}
            <div className="mb-12 border-l-4 border-brand-red bg-sand p-6 md:p-7">
              <p className="text-[15px] leading-relaxed">
                Please read these terms before using this website or relying
                on information contained in a vehicle listing. A website
                enquiry does not create a binding vehicle reservation or
                purchase agreement.
              </p>
            </div>

            <div className="divide-y">
              {/* 01 */}
              <section
                id="using-this-website"
                className="scroll-mt-28 py-10 first:pt-0"
              >
                <SectionNumber number="01" />

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Using this website
                </h2>

                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
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

              {/* 02 */}
              <section
                id="vehicle-listings"
                className="scroll-mt-28 py-10"
              >
                <SectionNumber number="02" />

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Vehicle listings & availability
                </h2>

                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
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

              {/* 03 */}
              <section id="pricing" className="scroll-mt-28 py-10">
                <SectionNumber number="03" />

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Pricing
                </h2>

                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
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

              {/* 04 */}
              <section
                id="financing-estimates"
                className="scroll-mt-28 py-10"
              >
                <SectionNumber number="04" />

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Financing estimates
                </h2>

                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
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

              {/* 05 */}
              <section id="enquiries" className="scroll-mt-28 py-10">
                <SectionNumber number="05" />

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Enquiries & appointments
                </h2>

                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
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

              {/* 06 */}
              <section
                id="information-accuracy"
                className="scroll-mt-28 py-10"
              >
                <SectionNumber number="06" />

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Information accuracy
                </h2>

                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
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

              {/* 07 */}
              <section
                id="intellectual-property"
                className="scroll-mt-28 py-10"
              >
                <SectionNumber number="07" />

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Intellectual property
                </h2>

                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
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

            {/* Mobile legal navigation */}
            <div className="mt-10 border-t pt-6 lg:hidden">
              <p className="eyebrow">Legal navigation</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {sections.map(([href, label]) => (
                  <a
                    key={href}
                    href={`#${href}`}
                    className="border-b py-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        </div>
      </Section>

      {/* ---------------------------------------------------------
          PURCHASE REMINDER
      --------------------------------------------------------- */}
      <section className="border-y bg-muted/40">
        <div className="container-page py-14 md:py-16">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <p className="eyebrow">Before you purchase</p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                Always confirm the vehicle details with our team.
              </h2>

              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                Vehicle condition, specification, price, availability and
                applicable terms should be confirmed before you commit to a
                purchase.
              </p>
            </div>

            <Button
              size="lg"
              asChild
              className="w-full md:w-auto"
            >
              <Link to="/contact">Contact BESEKI</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------
          LEGAL NAVIGATION
      --------------------------------------------------------- */}
      <section className="bg-background">
        <div className="container-page flex flex-wrap gap-x-6 gap-y-3 py-8 text-sm">
          <Link
            to="/privacy"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>

          <Link
            to="/contact"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact Us
          </Link>

          <Link
            to="/inventory"
            className="font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse Inventory
          </Link>
        </div>
      </section>
    </>
  );
}

function SectionNumber({ number }: { number: string }) {
  return (
    <p className="text-sm font-bold text-brand-red" aria-hidden="true">
      {number}
    </p>
  );
}
