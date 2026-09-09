import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/common/Section";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { VehicleSpecs } from "@/components/vehicles/VehicleSpecs";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { TestDriveForm, OfferForm } from "@/components/forms/Forms";
import { WhatsAppIcon } from "@/components/layout/Header";
import { vehicleName } from "@/data/vehicles";
import { getVehicle } from "@/lib/vehicles.functions";
import { useVehicles } from "@/lib/vehicles-context";
import { formatKes, formatKm, waMessages, whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/inventory/$slug")({
  loader: async ({ params }) => {
    const vehicle = await getVehicle({ data: { slug: params.slug } });
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Vehicle unavailable | BESEKI" }, { name: "robots", content: "noindex" }] };
    }
    const v = loaderData.vehicle;
    const name = `${v.make} ${v.model} ${v.year}`;
    const description = `${name} for sale in Mombasa at ${formatKes(v.price)}. ${formatKm(v.mileage)}, ${v.transmission}, ${v.fuel}. View photos and full specifications at BESEKI COMPANY LIMITED.`;
    return {
      meta: [
        { title: `${name} for Sale in Mombasa | BESEKI` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} for Sale in Mombasa | BESEKI` },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/inventory/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/inventory/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Car",
            name,
            brand: { "@type": "Brand", name: v.make },
            model: v.model,
            vehicleModelDate: String(v.year),
            mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileage, unitCode: "KMT" },
            fuelType: v.fuel,
            vehicleTransmission: v.transmission,
            bodyType: v.bodyType,
            color: v.color,
            offers: {
              "@type": "Offer",
              price: v.price,
              priceCurrency: "KES",
              availability:
                v.availability === "Available" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  component: VehicleDetail,
});

function VehicleDetail() {
  const { vehicle } = Route.useLoaderData();
  const vehicles = useVehicles();
  const name = vehicleName(vehicle);
  const related = vehicles
    .filter((v) => v.id !== vehicle.id && (v.bodyType === vehicle.bodyType || v.make === vehicle.make))
    .slice(0, 3);

  return (
    <>
      <div className="border-b bg-sand">
        <nav aria-label="Breadcrumb" className="container-page py-4">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <li>
              <Link to="/inventory" className="hover:text-foreground">
                Inventory
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <li className="font-medium text-foreground" aria-current="page">
              {name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container-page py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <VehicleGallery images={vehicle.images} alt={name} />

            <div className="mt-10">
              <h2 className="text-xl font-bold">About this vehicle</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{vehicle.description}</p>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold">Specifications</h2>
              <div className="mt-4">
                <VehicleSpecs vehicle={vehicle} />
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold">Key features</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {vehicle.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[14.5px]">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl border bg-card p-6">
              <p className="eyebrow">{vehicle.condition}</p>
              <h1 className="mt-2 text-[26px] font-bold leading-tight">{name}</h1>
              <p className="mt-2 text-[14px] text-muted-foreground">
                {formatKm(vehicle.mileage)} &middot; {vehicle.transmission} &middot; {vehicle.fuel}
              </p>
              <p className="price-type mt-5 text-[30px] leading-none">{formatKes(vehicle.price)}</p>
              <p className="mt-3 inline-flex rounded-full bg-muted px-3 py-1 text-[12px] font-semibold">
                {vehicle.availability}
              </p>

              <div className="mt-6 space-y-3">
                <Button size="lg" className="w-full" asChild>
                  <a href="#test-drive">Book a Test Drive</a>
                </Button>
                <Button size="lg" variant="secondary" className="w-full" asChild>
                  <a href="#make-offer">Make an Offer</a>
                </Button>
                <Button size="lg" variant="outline" className="w-full" asChild>
                  <a href={whatsappLink(waMessages.vehicle(name))} target="_blank" rel="noreferrer">
                    <WhatsAppIcon className="size-4 text-whatsapp" />
                    WhatsApp Dealer
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div id="test-drive" className="scroll-mt-28 rounded-xl border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold">Book a test drive</h2>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Tell us when suits you and we will have the {name} ready.
            </p>
            <div className="mt-6">
              <TestDriveForm vehicle={name} />
            </div>
          </div>
          <div id="make-offer" className="scroll-mt-28 rounded-xl border bg-card p-6 md:p-8">
            <h2 className="text-xl font-bold">Make an offer</h2>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Send us your figure and we will respond honestly, either way.
            </p>
            <div className="mt-6">
              <OfferForm vehicle={name} askingPrice={vehicle.price} />
            </div>
          </div>
        </div>
      </div>

      {related.length ? (
        <Section tone="muted">
          <SectionHeading eyebrow="You may also like" title="Similar vehicles at the yard" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
