import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { ContactForm, AppointmentForm } from "@/components/forms/Forms";
import { WhatsAppIcon } from "@/components/layout/Header";
import { company } from "@/data/company";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      {
        title: "Contact & Showroom Visit | BESEKI COMPANY LIMITED, Mombasa",
      },
      {
        name: "description",
        content:
          "Visit BESEKI COMPANY LIMITED at Railway Station, along Lumumba Road, Mombasa. Call 0721 886656, send an enquiry, or schedule a showroom visit or test drive.",
      },
      {
        property: "og:title",
        content: "Contact & Showroom Visit | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "Find us on Lumumba Road, Mombasa. Send an enquiry or book a showroom visit.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section className="border-b bg-background">
        <div className="container-page">
          <div className="grid min-h-[500px] items-end gap-12 py-16 md:py-20 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
            <div className="max-w-[720px]">
              <p className="eyebrow">Contact BESEKI</p>

              <h1 className="mt-5 max-w-[680px] text-[42px] font-bold leading-[1.02] tracking-[-0.04em] md:text-[58px] lg:text-[64px]">
                Come and see the cars for yourself.
              </h1>

              <p className="mt-6 max-w-[600px] text-[17px] leading-relaxed text-muted-foreground md:text-[18px]">
                Visit our showroom in Mombasa, send us an enquiry, or arrange
                a time that works for you. If you already know which vehicle
                you want to see, tell us and we will have it ready.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href="#book">
                    Schedule a Visit
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </a>
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
                    WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>

            <div className="border-t pt-6 lg:border-t-0 lg:border-l lg:pl-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Showroom
              </p>

              <p className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
                Railway Station
                <br />
                Lumumba Road
              </p>

              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {company.address.city}, {company.address.country}
              </p>

              <div className="mt-7 h-px w-16 bg-primary" />

              <p className="mt-6 text-sm font-medium">
                Prefer to speak first?
              </p>

              <a
                href={`tel:${company.phoneTel}`}
                className="mt-2 block text-xl font-bold hover:text-primary"
              >
                {company.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT + FORM */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
          {/* CONTACT DETAILS */}
          <div>
            <p className="eyebrow">Find us</p>

            <h2 className="mt-3 max-w-[420px] text-3xl font-bold leading-tight md:text-[40px]">
              Everything you need before you visit.
            </h2>

            <div className="mt-10 border-t">
              <div className="flex gap-4 border-b py-6">
                <MapPin
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <div>
                  <p className="font-semibold">Showroom</p>

                  <address className="mt-2 text-[14.5px] not-italic leading-relaxed text-muted-foreground">
                    {company.address.line1}
                    <br />
                    {company.address.line2}
                    <br />
                    {company.address.city}, {company.address.country}
                    <br />
                    {company.address.postal}
                  </address>
                </div>
              </div>

              <div className="flex gap-4 border-b py-6">
                <Phone
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <div>
                  <p className="font-semibold">Phone & WhatsApp</p>

                  <a
                    href={`tel:${company.phoneTel}`}
                    className="mt-2 block text-[14.5px] text-muted-foreground hover:text-primary"
                  >
                    {company.phoneDisplay}
                  </a>

                  <a
                    href={whatsappLink(waMessages.general)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-[14px] font-medium text-primary"
                  >
                    Message us on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex gap-4 border-b py-6">
                <Mail
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <p className="font-semibold">Email</p>

                  <a
                    href={`mailto:${company.email}`}
                    className="mt-2 block break-all text-[14.5px] text-muted-foreground hover:text-primary"
                  >
                    {company.email}
                  </a>
                </div>
              </div>
            </div>

            {/* HOURS */}
            <div className="mt-10">
              <div className="flex items-center gap-2">
                <Clock3
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                <p className="eyebrow">Opening hours</p>
              </div>

              <dl className="mt-4">
                {company.hours.map((h) => (
                  <div
                    key={h.days}
                    className="flex justify-between gap-5 border-b py-3 text-[14px]"
                  >
                    <dt className="text-muted-foreground">{h.days}</dt>
                    <dd className="font-medium">{h.time}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Please confirm hours by phone before travelling a long
                distance.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <a
                  href={company.map.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin className="mr-2 size-4" aria-hidden="true" />
                  Get Directions
                </a>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <a
                  href={`tel:${company.phoneTel}`}
                >
                  <Phone className="mr-2 size-4" aria-hidden="true" />
                  Call Us
                </a>
              </Button>
            </div>
          </div>

          {/* ENQUIRY */}
          <div className="lg:pt-3">
            <div className="border-t border-foreground pt-6">
              <p className="eyebrow">Send an enquiry</p>

              <h2 className="mt-3 text-2xl font-bold md:text-[32px]">
                Tell us what you need.
              </h2>

              <p className="mt-3 max-w-[580px] text-[15px] leading-relaxed text-muted-foreground">
                Looking for a particular vehicle, arranging a viewing or just
                have a question? Send the details and the BESEKI team will get
                back to you.
              </p>

              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* MAP */}
      <section
        aria-label="Showroom location map"
        className="border-y bg-muted"
      >
        <div className="container-page py-6 md:py-8">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Our location</p>
              <h2 className="mt-2 text-2xl font-bold">
                Find BESEKI on Lumumba Road.
              </h2>
            </div>

            <a
              href={company.map.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Open directions →
            </a>
          </div>

          <div className="overflow-hidden rounded-[14px] border bg-background">
            <iframe
              title={`Map showing ${company.map.query}`}
              src={company.map.embedSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[320px] w-full border-0 md:h-[440px]"
            />
          </div>
        </div>
      </section>

      {/* APPOINTMENT */}
      <Section tone="muted">
        <div
          id="book"
          className="scroll-mt-28"
        >
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CalendarDays
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <p className="eyebrow mt-7">Appointments</p>

              <h2 className="mt-3 max-w-[430px] text-3xl font-bold leading-tight md:text-[40px]">
                Let us have the car ready for you.
              </h2>

              <p className="mt-5 max-w-[430px] text-[15px] leading-relaxed text-muted-foreground">
                Schedule a showroom visit, test drive or video call. If you
                are coming to view a specific vehicle, include it in your
                request so our team can prepare.
              </p>

              <div className="mt-7 border-t pt-5">
                <p className="text-sm font-semibold">
                  Not sure what you want yet?
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  That is fine. Tell us what you are looking for and we can
                  help you narrow down your options.
                </p>
              </div>
            </div>

            <div className="border-t border-foreground pt-6 md:pt-8">
              <AppointmentForm />
            </div>
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page py-14 md:py-18">
          <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
                Prefer a quick conversation?
              </p>

              <h2 className="mt-3 text-2xl font-bold md:text-[34px]">
                Call or WhatsApp the BESEKI team.
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <a href={`tel:${company.phoneTel}`}>
                  <Phone className="mr-2 size-4" aria-hidden="true" />
                  Call {company.phoneDisplay}
                </a>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
