import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/common/Section";
import { ContactForm } from "@/components/forms/Forms";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/Header";
import { company } from "@/data/company";
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
      { property: "og:title", content: "Warranty & After-Sales Support | BESEKI COMPANY LIMITED" },
      { property: "og:description", content: "Ask our Mombasa team about the warranty terms for a specific vehicle." },
      { property: "og:url", content: "/warranty" },
    ],
    links: [{ rel: "canonical", href: "/warranty" }],
  }),
  component: WarrantyPage,
});

function WarrantyPage() {
  return (
    <>
      <PageHero
        eyebrow="Warranty"
        title="Warranty and after-sales support"
        subtitle="Cover differs from one vehicle to the next, so we would rather tell you the exact terms for the car you are looking at than publish a figure that may not apply."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <div className="rounded-xl border-l-4 border-l-primary bg-sand p-6">
              <h2 className="text-[17px] font-bold">Warranty coverage varies by vehicle</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                Contact our team for the specific warranty terms applicable to your vehicle.
              </p>
            </div>

            <div className="mt-10 space-y-8">
              <div className="border-t pt-6">
                <h3 className="text-[17px] font-bold">Warranty enquiry</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                  Tell us which vehicle you are considering, or which one you bought, and we will confirm what cover
                  applies and for how long.
                </p>
              </div>
              <div className="border-t pt-6">
                <h3 className="text-[17px] font-bold">Service support</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                  We can advise on servicing intervals and coordinate repairs, whether or not the work falls under a
                  warranty.
                </p>
              </div>
              <div className="border-t pt-6">
                <h3 className="text-[17px] font-bold">After-sales enquiry</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                  Paperwork, transfer of ownership, a warning light you do not recognise — call or message us and we
                  will help.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <a href={`tel:${company.phoneTel}`}>Call {company.phoneDisplay}</a>
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
            <h2 className="text-xl font-bold">Send a warranty enquiry</h2>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Include the vehicle details and we will come back with the applicable terms.
            </p>
            <div className="mt-6">
              <ContactForm defaultSubject="Warranty enquiry" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
