import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Section } from "@/components/common/Section";
import { VehicleGallery } from "@/components/vehicles/VehicleGallery";
import { VehicleSpecs } from "@/components/vehicles/VehicleSpecs";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { WhatsAppIcon } from "@/components/layout/Header";
import { OfferForm, TestDriveForm } from "@/components/forms/Forms";
import { getVehicle } from "@/lib/vehicles.functions";
import { useVehicles } from "@/lib/vehicles-context";
import { useSettings } from "@/lib/site-context";
import { vehicleName } from "@/data/vehicles";
import { formatKes, formatKm, waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

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
    const name = vehicleName(v);
    const description = `${name} for sale in Mombasa at BESEKI COMPANY LIMITED. ${formatKes(v.price)}, ${formatKm(v.mileage)}, ${v.transmission}, ${v.fuel}.`;

    return {
      meta: [
        { title: `${name} for Sale in Mombasa | BESEKI` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} for Sale in Mombasa` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
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
                v.availability === "Available"
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },

  component: VehicleDetailPage,
});

function VehicleDetailPage() {
  const { vehicle } = Route.useLoaderData();
  const all = useVehicles();
  const settings = useSettings();

  const name = vehicleName(vehicle);
  const similar = all
    .filter((v) => v.slug !== vehicle.slug && (v.bodyType === vehicle.bodyType || v.make === vehicle.make))
    .slice(0, 3);

  const sold = vehicle.availability === "Sold";

  return (
    <main className="min-w-0">
      {/* BREADCRUMB */}
      <div className="border-b bg-background">
        <div className="container-page flex items-center gap-2 py-4 text-[13px] text-muted-foreground">
          <Link to="/inventory" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Inventory
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{name}</span>
        </div>
      </div>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          {/* LEFT: gallery + details */}
          <div className="min-w-0">
            <VehicleGallery images={vehicle.images} alt={name} />

            <div className="mt-10">
              <h2 className="text-xl font-bold tracking-tight">Specifications</h2>
              <div className="mt-5">
                <VehicleSpecs vehicle={vehicle} />
              </div>
            </div>

            {vehicle.description ? (
              <div className="mt-10 border-t pt-8">
                <h2 className="text-xl font-bold tracking-tight">About this vehicle</h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                  {vehicle.description}
                </p>
              </div>
            ) : null}

            {vehicle.features.length > 0 ? (
              <div className="mt-10 border-t pt-8">
                <h2 className="text-xl font-bold tracking-tight">Features</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {vehicle.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-[15px]">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* FORMS */}
            <div className="mt-12 grid gap-10 border-t pt-10 lg:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Book a test drive</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tell us when suits you and we will confirm a time.
                </p>
                <div className="mt-6">
                  <TestDriveForm vehicle={name} vehicleId={vehicle.id} vehicleSlug={vehicle.slug} />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight">Make an offer</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send us your figure and we will come back to you honestly.
                </p>
                <div className="mt-6">
                  <OfferForm
                    vehicle={name}
                    askingPrice={vehicle.price}
                    vehicleId={vehicle.id}
                    vehicleSlug={vehicle.slug}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: summary */}
          <aside className="min-w-0">
            <div className="lg:sticky lg:top-28">
              <div className="border p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
                      vehicle.availability === "Available"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {vehicle.availability}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {vehicle.condition}
                  </span>
                </div>

                <h1 className="mt-4 text-[26px] font-bold leading-tight tracking-tight md:text-[32px]">
                  {name}
                </h1>

                <p className="mt-3 text-2xl font-bold text-primary">{formatKes(vehicle.price)}</p>

                <dl className="mt-5 grid grid-cols-2 gap-3 border-t pt-5 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Mileage</dt>
                    <dd className="font-medium">{formatKm(vehicle.mileage)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Transmission</dt>
                    <dd className="font-medium">{vehicle.transmission}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Fuel</dt>
                    <dd className="font-medium">{vehicle.fuel}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Body</dt>
                    <dd className="font-medium">{vehicle.bodyType}</dd>
                  </div>
                </dl>

                {sold ? (
                  <p className="mt-5 border-t pt-5 text-sm text-muted-foreground">
                    This vehicle has been sold. Talk to us about similar stock arriving soon.
                  </p>
                ) : null}

                <div className="mt-6 space-y-3 border-t pt-6">
                  <Button size="lg" className="w-full" asChild>
                    <a href={`tel:${settings.phoneTel}`}>
                      <Phone className="size-4" aria-hidden="true" />
                      Call {settings.phoneDisplay}
                    </a>
                  </Button>

                  <a
                    href={whatsappLink(waMessages.vehicle(name, formatKes(vehicle.price)))}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border px-5 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    <WhatsAppIcon className="size-4" />
                    WhatsApp about this car
                  </a>

                  <Button size="lg" variant="outline" className="w-full" asChild>
                    <Link to="/financing">Estimate monthly payment</Link>
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* SIMILAR VEHICLES */}
      {similar.length > 0 ? (
        <Section tone="muted">
          <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Also on the yard</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Similar vehicles</h2>
            </div>

            <Link to="/inventory" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
              View all inventory
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </Section>
      ) : null}
    </main>
  );
}
