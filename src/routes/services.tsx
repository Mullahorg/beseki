import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/common/Section";
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
          "Vehicle inspection, sourcing, importation assistance, maintenance and after-sales support from BESEKI COMPANY LIMITED along Lumumba Road, Mombasa.",
      },
      { property: "og:title", content: "Our Services | BESEKI COMPANY LIMITED, Mombasa" },
      {
        property: "og:description",
        content: "Inspection, sourcing, importation assistance, maintenance and after-sales support in Mombasa.",
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
      <PageHero
        eyebrow="Services"
        title="What we do, beyond selling cars"
        subtitle="Most of our work happens around the sale — checking vehicles, finding the right one, and staying reachable afterwards."
      />

      <Section>
        <div className="space-y-14 md:space-y-20">
          {services.map((service, i) => (
            <article
              key={service.slug}
              id={service.slug}
              className={cn(
                "grid scroll-mt-28 gap-8 border-t pt-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16",
                i === 0 && "border-t-0 pt-0",
              )}
            >
              <div>
                <p className="eyebrow">0{i + 1}</p>
                <h2 className="mt-2 text-2xl font-bold leading-tight md:text-[30px]">{service.title}</h2>
                <p className="mt-3 text-[15px] text-muted-foreground">{service.summary}</p>
              </div>
              <div>
                <p className="text-[15.5px] leading-relaxed">{service.detail}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {service.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[14.5px] text-muted-foreground">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <section className="border-t bg-sand">
        <div className="container-page flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Need help with something specific?</h2>
            <p className="mt-2 text-[15px] text-muted-foreground">Tell us what you are trying to do and we will advise.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={whatsappLink(waMessages.general)} target="_blank" rel="noreferrer">
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
