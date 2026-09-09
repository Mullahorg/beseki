import { useMemo, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  Check,
  ChevronRight,
  HandCoins,
  MapPin,
  Search,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { TestimonialCard, BlogCard } from "@/components/content/Cards";
import { WhatsAppIcon } from "@/components/layout/Header";
import { company } from "@/data/company";
import { blogPosts } from "@/data/blog";
import { services, testimonials } from "@/data/site";
import {
  bodyTypes,
  fuels,
  makesOf,
  priceBands,
  transmissions,
  yearsOf,
} from "@/data/vehicles";
import { useVehicles } from "@/lib/vehicles-context";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import heroImage from "@/assets/hero-alphard.jpg";
import showroomImage from "@/assets/showroom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Cars for Sale in Mombasa | BESEKI COMPANY LIMITED",
      },
      {
        name: "description",
        content:
          "New and locally used cars for sale in Mombasa. Visit BESEKI COMPANY LIMITED along Lumumba Road, browse our stock online or book a test drive today.",
      },
      {
        property: "og:title",
        content: "Cars for Sale in Mombasa | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "New and locally used motor vehicles in Mombasa. Browse the stock, book a test drive or talk to us on WhatsApp.",
      },
      {
        property: "og:url",
        content: "/",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

type SearchForm = {
  make: string;
  model: string;
  price: string;
  year: string;
  transmission: string;
  fuel: string;
};

function QuickSearch() {
  const navigate = useNavigate();
  const vehicles = useVehicles();

  const makes = makesOf(vehicles);
  const years = yearsOf(vehicles);

  const [form, setForm] = useState<SearchForm>({
    make: "",
    model: "",
    price: "",
    year: "",
    transmission: "",
    fuel: "",
  });

  const models = useMemo(() => {
    return [
      ...new Set(
        vehicles
          .filter((vehicle) => !form.make || vehicle.make === form.make)
          .map((vehicle) => vehicle.model),
      ),
    ].sort();
  }, [vehicles, form.make]);

  function updateField(key: keyof SearchForm, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "make" ? { model: "" } : {}),
    }));
  }

  const selectClass =
    "h-11 w-full rounded-md border border-white/15 bg-white px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

  const fields = [
    {
      id: "home-search-make",
      label: "Make",
      key: "make" as const,
      options: makes,
    },
    {
      id: "home-search-model",
      label: "Model",
      key: "model" as const,
      options: models,
    },
    {
      id: "home-search-price",
      label: "Price",
      key: "price" as const,
      options: priceBands.map((band) => band.label),
    },
    {
      id: "home-search-year",
      label: "Year",
      key: "year" as const,
      options: years.map(String),
    },
    {
      id: "home-search-transmission",
      label: "Transmission",
      key: "transmission" as const,
      options: [...transmissions],
    },
    {
      id: "home-search-fuel",
      label: "Fuel",
      key: "fuel" as const,
      options: [...fuels],
    },
  ];

  return (
    <form
      aria-label="Search BESEKI vehicle inventory"
      onSubmit={(event) => {
        event.preventDefault();

        navigate({
          to: "/inventory",
          search: Object.fromEntries(
            Object.entries(form).filter(([, value]) => Boolean(value)),
          ),
        });
      }}
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      {fields.map((fieldConfig) => (
        <div key={fieldConfig.id} className="min-w-0">
          <label
            htmlFor={fieldConfig.id}
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60"
          >
            {fieldConfig.label}
          </label>

          <select
            id={fieldConfig.id}
            value={form[fieldConfig.key]}
            onChange={(event) =>
              updateField(fieldConfig.key, event.target.value)
            }
            className={selectClass}
          >
            <option value="">Any</option>

            {fieldConfig.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="md:col-span-2 lg:col-span-3 xl:col-span-6">
        <Button
          type="submit"
          size="lg"
          className="h-11 w-full bg-primary px-7"
        >
          <Search className="size-4" aria-hidden="true" />
          Search Inventory
        </Button>
      </div>
    </form>
  );
}

function HomePage() {
  const vehicles = useVehicles();

  const featured = vehicles
    .filter((vehicle) => vehicle.featured)
    .slice(0, 6);

  const latest = [...vehicles]
    .sort((a, b) => b.year - a.year)
    .slice(0, 3);

  const posts = blogPosts.slice(0, 3);

  const totalVehicles = vehicles.length;

  return (
    <main className="min-w-0 overflow-x-hidden">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Vehicle displayed at a car showroom in Mombasa"
            width={1920}
            height={1080}
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Simple overlay - intentionally no complex gradients */}
        <div className="absolute inset-0 bg-black/65" />

        <div className="container-page relative">
          <div className="grid min-h-[560px] items-center py-20 md:min-h-[600px] lg:min-h-[640px]">
            <div className="max-w-2xl">
              <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/75">
                BESEKI COMPANY LIMITED · MOMBASA
              </p>

              <h1 className="max-w-3xl text-[40px] font-bold leading-[1.05] tracking-[-0.03em] sm:text-[52px] lg:text-[66px]">
                The right car starts with a{" "}
                <span className="text-white/65">straight answer.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[16px] leading-7 text-white/80 sm:text-[17px]">
                New and locally used motor vehicles, carefully selected and
                available to view at our showroom along Lumumba Road, Mombasa.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link to="/inventory">
                    Browse Inventory
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/35 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <Link to="/contact" hash="book">
                    Book a Test Drive
                  </Link>
                </Button>

                <a
                  href={whatsappLink(waMessages.general)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SEARCH
          IMPORTANT: NORMAL FLOW - NO NEGATIVE MARGIN
      ========================================================= */}
      <section className="relative z-10 bg-ink py-8 text-ink-foreground md:py-10">
        <div className="container-page">
          <div className="border border-white/10 bg-[#151820] p-5 md:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55">
                  Search stock
                </p>

                <h2 className="mt-2 text-[22px] font-bold md:text-[26px]">
                  What are you looking for?
                </h2>
              </div>

              <Link
                to="/inventory"
                className="inline-flex items-center text-sm font-semibold text-white/75 transition-colors hover:text-white"
              >
                Advanced search
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </div>

            <QuickSearch />
          </div>
        </div>
      </section>

      {/* =========================================================
          INVENTORY
      ========================================================= */}
      <section className="border-b bg-background py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow">Current stock</p>

              <h2 className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.02em] md:text-[40px]">
                Cars worth coming to see.
              </h2>

              <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground">
                Browse our latest vehicles online, then come to the yard,
                inspect the car properly and ask every question you need to.
              </p>
            </div>

            <div className="flex items-center gap-6 border-t pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="text-3xl font-bold">{totalVehicles}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  vehicles listed
                </p>
              </div>

              <div className="h-10 w-px bg-border" />

              <div>
                <p className="text-3xl font-bold">Mombasa</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Lumumba Road
                </p>
              </div>
            </div>
          </div>

          {featured.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((vehicle, index) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  priority={index < 3}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 border-y py-12">
              <p className="text-sm text-muted-foreground">
                New vehicles are being added. Browse the full inventory to see
                the latest stock.
              </p>
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <Button variant="outline" asChild>
              <Link to="/inventory">
                View all vehicles
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST
      ========================================================= */}
      <section className="border-b bg-sand">
        <div className="container-page">
          <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {[
              {
                icon: BadgeCheck,
                title: "Quality focused",
                copy: "We inspect vehicles before putting them forward.",
              },
              {
                icon: HandCoins,
                title: "Clear pricing",
                copy: "We discuss the vehicle and its price openly.",
              },
              {
                icon: MapPin,
                title: "Visit the yard",
                copy: "See the actual car along Lumumba Road.",
              },
              {
                icon: Wrench,
                title: "After the sale",
                copy: "Our team remains reachable after handover.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 px-0 py-6 sm:px-6 lg:px-7"
              >
                <item.icon
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />

                <div>
                  <h3 className="text-[15px] font-bold">{item.title}</h3>

                  <p className="mt-1.5 text-[13.5px] leading-6 text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY BESEKI
      ========================================================= */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="eyebrow">Why BESEKI</p>

              <h2 className="mt-3 text-[30px] font-bold leading-tight tracking-[-0.025em] md:text-[40px]">
                Buying a car should feel straightforward.
              </h2>

              <p className="mt-5 text-[15px] leading-7 text-muted-foreground">
                We are a Mombasa dealership, not a call centre. You deal with
                real people, see the actual vehicle and get space to make a
                decision properly.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/about">About BESEKI</Link>
                </Button>

                <Button variant="outline" asChild>
                  <Link to="/contact">
                    Visit us
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="border-t">
              {[
                {
                  number: "01",
                  title: "See the car properly",
                  copy:
                    "Photos help you shortlist. Seeing the vehicle in person helps you decide.",
                },
                {
                  number: "02",
                  title: "Ask uncomfortable questions",
                  copy:
                    "Condition, mileage, history, paperwork or previous repairs — ask before you buy.",
                },
                {
                  number: "03",
                  title: "Take your time",
                  copy:
                    "We would rather help you choose the right car than push you into the wrong one.",
                },
                {
                  number: "04",
                  title: "Stay connected",
                  copy:
                    "The same BESEKI team remains available for questions after the sale.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="grid gap-4 border-b py-6 sm:grid-cols-[56px_0.7fr_1fr] sm:items-start"
                >
                  <span className="text-sm font-bold text-primary">
                    {item.number}
                  </span>

                  <h3 className="text-[16px] font-bold">{item.title}</h3>

                  <p className="text-[14px] leading-6 text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BODY TYPES
      ========================================================= */}
      <section className="border-y bg-sand py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Browse by type</p>

              <h2 className="mt-2 text-[28px] font-bold leading-tight md:text-[36px]">
                Start with the shape you need.
              </h2>
            </div>

            <Button variant="outline" asChild>
              <Link to="/inventory">Browse all</Link>
            </Button>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-px overflow-hidden border bg-border md:grid-cols-3 lg:grid-cols-6">
            {bodyTypes.map((type) => {
              const count = vehicles.filter(
                (vehicle) => vehicle.bodyType === type,
              ).length;

              return (
                <Link
                  key={type}
                  to="/inventory"
                  search={{ bodyType: type }}
                  className="group bg-background p-5 transition-colors hover:bg-card"
                >
                  <Car
                    className="size-5 text-brand-blue"
                    aria-hidden="true"
                  />

                  <div className="mt-8">
                    <h3 className="text-[15px] font-bold group-hover:text-primary">
                      {type}
                    </h3>

                    <p className="mt-1 text-[12px] text-muted-foreground">
                      {count} {count === 1 ? "vehicle" : "vehicles"}
                    </p>
                  </div>

                  <ArrowRight
                    className="mt-5 size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINANCING / TRADE IN
      ========================================================= */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="grid overflow-hidden border lg:grid-cols-2">
            <div className="bg-ink p-8 text-ink-foreground md:p-10 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55">
                Financing
              </p>

              <h2 className="mt-3 max-w-md text-[28px] font-bold leading-tight md:text-[34px]">
                Make the monthly figure work for you.
              </h2>

              <p className="mt-4 max-w-md text-[15px] leading-7 text-white/70">
                Start with an indicative calculation, then talk to our team
                about available financing options.
              </p>

              <Button className="mt-7" variant="secondary" asChild>
                <Link to="/financing">
                  Explore Financing
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="bg-background p-8 md:p-10 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                Trade-in
              </p>

              <h2 className="mt-3 max-w-md text-[28px] font-bold leading-tight md:text-[34px]">
                Your current car could be part of the deal.
              </h2>

              <p className="mt-4 max-w-md text-[15px] leading-7 text-muted-foreground">
                Tell us about your current vehicle and we will review the
                details and come back with an indicative estimate.
              </p>

              <Button className="mt-7" asChild>
                <Link to="/trade-in">
                  Value My Trade-In
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          LATEST ARRIVALS
      ========================================================= */}
      <section className="border-y bg-sand py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Latest arrivals</p>

              <h2 className="mt-2 text-[30px] font-bold leading-tight md:text-[38px]">
                Recently added to the yard.
              </h2>

              <p className="mt-3 max-w-xl text-[15px] leading-7 text-muted-foreground">
                New stock changes quickly. These are some of the most recently
                added vehicles in the current inventory.
              </p>
            </div>

            <Button variant="outline" asChild>
              <Link to="/inventory" search={{ sort: "newest" }}>
                See all arrivals
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {latest.length > 0 && (
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <div>
              <p className="eyebrow">Beyond the sale</p>

              <h2 className="mt-2 text-[30px] font-bold leading-tight md:text-[38px]">
                More than simply handing over the keys.
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                From financing conversations to after-sales support, our goal
                is to make the ownership journey easier.
              </p>

              <Button className="mt-6" variant="outline" asChild>
                <Link to="/services">
                  Explore our services
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="border-t">
              {services.slice(0, 6).map((service, index) => (
                <Link
                  key={service.slug}
                  to="/services"
                  className="group grid gap-4 border-b py-5 sm:grid-cols-[44px_0.7fr_1fr_auto] sm:items-center"
                >
                  <span className="text-xs font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-[16px] font-bold group-hover:text-primary">
                    {service.title}
                  </h3>

                  <p className="text-[14px] leading-6 text-muted-foreground">
                    {service.summary}
                  </p>

                  <ChevronRight
                    className="hidden size-4 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS
      ========================================================= */}
      <section className="border-y bg-sand py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Customer stories</p>

              <h2 className="mt-2 text-[30px] font-bold leading-tight md:text-[38px]">
                What buyers say.
              </h2>

              <p className="mt-3 max-w-xl text-[14px] leading-6 text-muted-foreground">
                Customer reviews should be published only after they have been
                verified.
              </p>
            </div>

            <Button variant="outline" asChild>
              <Link to="/testimonials">
                Read all stories
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          BLOG
      ========================================================= */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">From BESEKI</p>

              <h2 className="mt-2 text-[30px] font-bold leading-tight md:text-[38px]">
                Useful reading before you buy.
              </h2>
            </div>

            <Button variant="outline" asChild>
              <Link to="/blog">
                Read the blog
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SHOWROOM
      ========================================================= */}
      <section className="border-t bg-ink text-ink-foreground">
        <div className="container-page grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55">
              Visit BESEKI
            </p>

            <h2 className="mt-3 max-w-xl text-[32px] font-bold leading-tight md:text-[42px]">
              Come see the cars for yourself.
            </h2>

            <p className="mt-5 max-w-lg text-[15px] leading-7 text-white/70">
              Our showroom is at {company.addressOneLine}. Come during working
              hours or message us first so we can have the vehicle ready.
            </p>

            <div className="mt-7 space-y-3 text-sm text-white/75">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{company.addressOneLine}</span>
              </div>

              <div className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span>View the vehicle in person</span>
              </div>

              <div className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span>Ask questions before making a decision</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a
                  href={company.map.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions
                </a>
              </Button>

              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact" hash="book">
                  Schedule a Visit
                </Link>
              </Button>

              <a
                href={whatsappLink(waMessages.general)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp Us
              </a>
            </div>
          </div>

          <img
            src={showroomImage}
            alt="Vehicles displayed at the BESEKI yard in Mombasa"
            width={1280}
            height={854}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-page flex flex-col gap-7 py-14 md:flex-row md:items-center md:justify-between md:py-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground/70">
              Ready when you are
            </p>

            <h2 className="mt-2 text-[28px] font-bold leading-tight md:text-[36px]">
              Found a car you like?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-primary-foreground/75">
              Ask a question, book a viewing or speak to the BESEKI team
              directly.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-white text-ink hover:bg-white/90"
            >
              <Link to="/contact">
                Contact BESEKI
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <a
              href={whatsappLink(waMessages.general)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
