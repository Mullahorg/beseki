import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, MapPin, Wrench, BadgeCheck, HandCoins, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/common/Section";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { TestimonialCard, BlogCard } from "@/components/content/Cards";
import { WhatsAppIcon } from "@/components/layout/Header";
import { company } from "@/data/company";
import { blogPosts } from "@/data/blog";
import { services, testimonials } from "@/data/site";
import { bodyTypes, makesOf, transmissions, fuels, yearsOf, priceBands } from "@/data/vehicles";
import { useVehicles } from "@/lib/vehicles-context";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import heroImage from "@/assets/hero-alphard.jpg";
import showroomImage from "@/assets/showroom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cars for Sale in Mombasa | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "New and locally used cars for sale in Mombasa. Visit BESEKI COMPANY LIMITED along Lumumba Road, browse our stock online or book a test drive today.",
      },
      { property: "og:title", content: "Cars for Sale in Mombasa | BESEKI COMPANY LIMITED" },
      {
        property: "og:description",
        content:
          "New and locally used motor vehicles in Mombasa. Browse the stock, book a test drive or talk to us on WhatsApp.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function QuickSearch() {
  const navigate = useNavigate();
  const vehicles = useVehicles();
  const makes = makesOf(vehicles);
  const years = yearsOf(vehicles);
  const [form, setForm] = useState({
    make: "",
    model: "",
    price: "",
    year: "",
    transmission: "",
    fuel: "",
  });
  const models = [...new Set(vehicles.filter((v) => !form.make || v.make === form.make).map((v) => v.model))].sort();

  const field =
    "w-full appearance-none rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({
          to: "/inventory",
          search: Object.fromEntries(Object.entries(form).filter(([, v]) => v)),
        });
      }}
      className="grid gap-4 md:grid-cols-3 lg:grid-cols-6"
      aria-label="Quick vehicle search"
    >
      {[
        { id: "qs-make", label: "Make", key: "make" as const, options: makes },
        { id: "qs-model", label: "Model", key: "model" as const, options: models },
        { id: "qs-price", label: "Price", key: "price" as const, options: priceBands.map((b) => b.label) },
        { id: "qs-year", label: "Year from", key: "year" as const, options: years.map(String) },
        { id: "qs-trans", label: "Transmission", key: "transmission" as const, options: [...transmissions] },
        { id: "qs-fuel", label: "Fuel", key: "fuel" as const, options: [...fuels] },
      ].map((f) => (
        <div key={f.id} className="space-y-1.5">
          <label htmlFor={f.id} className="block text-[13px] font-medium">
            {f.label}
          </label>
          <select
            id={f.id}
            value={form[f.key]}
            onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value, ...(f.key === "make" ? { model: "" } : {}) }))}
            className={field}
          >
            <option value="">Any</option>
            {f.options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      ))}
      <div className="md:col-span-3 lg:col-span-6">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Search Vehicles
        </Button>
      </div>
    </form>
  );
}

function HomePage() {
  const vehicles = useVehicles();
  const featured = vehicles.filter((v) => v.featured).slice(0, 6);
  const latest = [...vehicles].sort((a, b) => b.year - a.year).slice(0, 3);
  const posts = blogPosts.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImage}
            alt="A silver MPV parked outside a car showroom in Mombasa"
            width={1920}
            height={1080}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/60" />
        </div>
        <div className="container-page flex min-h-[520px] flex-col justify-center py-20 text-ink-foreground md:min-h-[620px]">
          <h1 className="max-w-2xl text-[34px] font-bold leading-[1.1] md:text-[56px]">
            Find Your Next Car in Mombasa
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-foreground/85">
            New and locally used vehicles, sold honestly from our yard along Lumumba Road.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/inventory">Browse Inventory</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact" hash="book">
                Book a Test Drive
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-ink-foreground/40 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground">
              <a href={whatsappLink(waMessages.general)} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="size-4" />
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick search */}
      <section className="border-b bg-background py-8 md:py-10">
        <div className="container-page">
          <QuickSearch />
        </div>
      </section>

      {/* Featured vehicles */}
      <Section>
        <SectionHeading
          eyebrow="Featured"
          title="Vehicles worth a look this week"
          subtitle="A selection from our current stock. Every vehicle can be viewed at the yard before you commit."
          action={
            <Button variant="outline" asChild>
              <Link to="/inventory">
                View all vehicles
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
          ))}
        </div>
      </Section>

      {/* Trust strip */}
      <section className="border-y bg-sand py-8">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BadgeCheck, title: "Quality Assured", copy: "Every vehicle is checked before it reaches the yard." },
            { icon: HandCoins, title: "Fair & Transparent Pricing", copy: "The price you see is the price we discuss." },
            { icon: MapPin, title: "Mombasa Showroom", copy: "See and drive the car in person, along Lumumba Road." },
            { icon: Wrench, title: "After-Sales Support", copy: "We remain reachable long after the handover." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <h3 className="text-[15px] font-semibold">{item.title}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why BESEKI */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Why BESEKI</p>
            <h2 className="mt-2 text-2xl font-bold leading-tight md:text-[34px]">
              Buying a car should feel straightforward.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              We are a Mombasa dealership, not a call centre. You speak to the same people from the first WhatsApp
              message to the day you drive away.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/about">About BESEKI</Link>
            </Button>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              {
                title: "You see the car, not just photos",
                copy: "Our stock sits at the yard. Come and look at it, start it cold, drive it.",
              },
              {
                title: "Straight answers on condition",
                copy: "If a car has a mark, a repair or high mileage, we say so before you ask.",
              },
              {
                title: "Paperwork handled properly",
                copy: "Logbook, transfer and records are dealt with correctly, without shortcuts.",
              },
              {
                title: "We are still here afterwards",
                copy: "Service questions, spares advice or a second car later — the same number works.",
              },
            ].map((r) => (
              <div key={r.title}>
                <h3 className="text-[16px] font-bold">{r.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{r.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Browse by type */}
      <Section tone="muted">
        <SectionHeading eyebrow="Browse" title="Find the shape that suits you" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {bodyTypes.map((type) => (
            <Link
              key={type}
              to="/inventory"
              search={{ bodyType: type }}
              className="group flex flex-col items-start gap-3 rounded-xl border bg-card p-5 transition-colors hover:border-primary"
            >
              <Car className="size-5 text-brand-blue" aria-hidden="true" />
              <span className="text-[15px] font-semibold group-hover:text-primary">{type}</span>
              <span className="text-[12.5px] text-muted-foreground">
                {vehicles.filter((v) => v.bodyType === type).length} in stock
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Financing + Trade-in */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col rounded-xl border bg-card p-8">
            <p className="eyebrow">Financing</p>
            <h2 className="mt-2 text-[24px] font-bold leading-snug">Spread the cost over time</h2>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted-foreground">
              Work out an indicative monthly payment, then talk to us about arranging finance through a lender.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link to="/financing">Explore Financing</Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col rounded-xl border bg-card p-8">
            <p className="eyebrow">Trade-In</p>
            <h2 className="mt-2 text-[24px] font-bold leading-snug">Use your current car as part payment</h2>
            <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted-foreground">
              Send us the details of your vehicle and we will come back to you with an indicative figure.
            </p>
            <div className="mt-6">
              <Button variant="secondary" asChild>
                <Link to="/trade-in">Request a Trade-In Estimate</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Services"
          title="What we do beyond the sale"
          action={
            <Button variant="outline" asChild>
              <Link to="/services">All services</Link>
            </Button>
          }
        />
        <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.slug} className="border-t pt-5">
              <h3 className="text-[16px] font-bold">{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{s.summary}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Latest arrivals */}
      <Section>
        <SectionHeading
          eyebrow="Latest arrivals"
          title="Recently added to the yard"
          action={
            <Button variant="outline" asChild>
              <Link to="/inventory" search={{ sort: "newest" }}>
                See all arrivals
              </Link>
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Customers"
          title="What buyers say"
          subtitle="These entries are placeholders until real, verified customer reviews are added."
          action={
            <Button variant="outline" asChild>
              <Link to="/testimonials">All reviews</Link>
            </Button>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </Section>

      {/* Blog */}
      <Section>
        <SectionHeading
          eyebrow="From the blog"
          title="Practical reading before you buy"
          action={
            <Button variant="outline" asChild>
              <Link to="/blog">Read the blog</Link>
            </Button>
          }
        />
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </Section>

      {/* Showroom CTA */}
      <section className="bg-ink text-ink-foreground">
        <div className="container-page grid items-center gap-10 py-16 md:py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-ink-foreground/70">Visit us</p>
            <h2 className="mt-2 text-[28px] font-bold leading-tight md:text-[38px]">
              Come see the cars for yourself
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-foreground/80">
              {company.addressOneLine}. Walk in during working hours, or message us first and we will have the vehicle
              ready for you.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <a href={company.map.directionsUrl} target="_blank" rel="noreferrer">
                  Get Directions
                </a>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/contact" hash="book">
                  Schedule a Visit
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-ink-foreground/40 bg-transparent text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                <a href={whatsappLink(waMessages.general)} target="_blank" rel="noreferrer">
                  <WhatsAppIcon className="size-4" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
          <img
            src={showroomImage}
            alt="Vehicles displayed at the BESEKI yard in Mombasa"
            width={1280}
            height={854}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-xl object-cover"
          />
        </div>
      </section>
    </>
  );
}
