import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/common/Section";
import { ContactForm, AppointmentForm } from "@/components/forms/Forms";
import { WhatsAppIcon } from "@/components/layout/Header";
import { company } from "@/data/company";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Showroom Visit | BESEKI COMPANY LIMITED, Mombasa" },
      {
        name: "description",
        content:
          "Visit BESEKI COMPANY LIMITED at Railway Station, along Lumumba Road, Mombasa. Call 0721 886656, send an enquiry, or schedule a showroom visit or test drive.",
      },
      { property: "og:title", content: "Contact & Showroom Visit | BESEKI COMPANY LIMITED" },
      {
        property: "og:description",
        content: "Find us on Lumumba Road, Mombasa. Send an enquiry or book a showroom visit.",
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
      <PageHero
        eyebrow="Contact"
        title={`Visit ${company.name}`}
        subtitle="Come and see the cars for yourself, or get in touch first and we will have everything ready."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <h2 className="text-xl font-bold">Where to find us</h2>
            <ul className="mt-6 space-y-6">
              <li className="flex gap-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-[15px] font-semibold">Showroom</p>
                  <address className="mt-1 text-[14.5px] not-italic leading-relaxed text-muted-foreground">
                    {company.address.line1}
                    <br />
                    {company.address.line2}
                    <br />
                    {company.address.city}, {company.address.country}
                    <br />
                    {company.address.postal}
                  </address>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-[15px] font-semibold">Phone &amp; WhatsApp</p>
                  <a
                    href={`tel:${company.phoneTel}`}
                    className="mt-1 block text-[14.5px] text-muted-foreground hover:text-primary"
                  >
                    {company.phoneDisplay}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-[15px] font-semibold">Email</p>
                  <a
                    href={`mailto:${company.email}`}
                    className="mt-1 block break-all text-[14.5px] text-muted-foreground hover:text-primary"
                  >
                    {company.email}
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-8">
              <p className="eyebrow">Opening hours</p>
              <dl className="mt-3 space-y-2">
                {company.hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 border-b py-2 text-[14.5px]">
                    <dt className="text-muted-foreground">{h.days}</dt>
                    <dd className="font-medium">{h.time}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">
                Please confirm hours by phone before travelling a long distance.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <a href={company.map.directionsUrl} target="_blank" rel="noreferrer">
                  Get Directions
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={whatsappLink(waMessages.general)} target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="size-4 text-whatsapp" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold">Send an enquiry</h2>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Fill in the form and we will get back to you as soon as we can.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <section aria-label="Showroom location map" className="border-y">
        <iframe
          title={`Map showing ${company.map.query}`}
          src={company.map.embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[320px] w-full border-0 md:h-[420px]"
        />
      </section>

      <Section tone="muted">
        <div id="book" className="mx-auto max-w-3xl scroll-mt-28 rounded-xl border bg-card p-6 md:p-10">
          <p className="eyebrow">Appointments</p>
          <h2 className="mt-2 text-2xl font-bold">Schedule a Visit</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Book a showroom visit, a test drive, or a video call if you are out of town.
          </p>
          <div className="mt-8">
            <AppointmentForm />
          </div>
        </div>
      </Section>
    </>
  );
}
