import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/common/Section";
import { TestimonialCard } from "@/components/content/Cards";
import { ReviewForm } from "@/components/forms/Forms";
import { listTestimonials } from "@/lib/content.functions";
import { mediaUrl } from "@/lib/media";

export const Route = createFileRoute("/testimonials")({
  loader: async () => {
    try {
      return { testimonials: await listTestimonials() };
    } catch {
      return { testimonials: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Customer Testimonials | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "Read genuine customer experiences from people who have bought vehicles from BESEKI COMPANY LIMITED in Mombasa.",
      },
      {
        property: "og:title",
        content: "Customer Testimonials | BESEKI COMPANY LIMITED",
      },
      {
        property: "og:description",
        content:
          "Discover what customers say about their vehicle-buying experience with BESEKI in Mombasa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { testimonials } = Route.useLoaderData();
  const featured = testimonials[0];
  const remaining = testimonials.filter((t) => t.id !== featured?.id);

  return (
    <main className="bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden border-b bg-muted/30">
        <div className="mx-auto grid min-h-[440px] max-w-[1280px] items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Customer Stories
            </p>

            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
              Trusted by drivers across Mombasa.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Every vehicle we sell becomes part of someone's journey. Read
              what our customers have shared about their experience with
              BESEKI.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/inventory"
                className="inline-flex h-12 items-center justify-center rounded-md bg-brand-red px-6 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Browse Vehicles
              </a>

              <a
                href="https://wa.me/254721886656"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-foreground/20 bg-background px-6 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                Talk to BESEKI
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-background">
            <div className="aspect-[4/3] bg-gradient-to-br from-brand-blue/10 via-background to-brand-red/10">
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div>
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10">
                    <span className="text-2xl text-brand-red">★</span>
                  </div>

                  <p className="text-lg font-semibold">
                    Real experiences.
                  </p>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Genuine customer feedback matters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST INTRO */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">
              Real Experiences
            </p>

            <h2 className="mt-3 max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
              Buying a car should feel straightforward.
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-base leading-7 text-muted-foreground">
              At BESEKI, we believe customers deserve clear communication,
              honest guidance and support throughout their vehicle-buying
              journey.
            </p>

            <div className="mt-8 grid gap-0 border-y sm:grid-cols-3">
              {[
                "Clear communication",
                "Vehicle-focused guidance",
                "Support beyond the sale",
              ].map((item) => (
                <div
                  key={item}
                  className="border-b px-4 py-5 text-sm font-semibold last:border-0 sm:border-b-0 sm:border-r sm:first:pl-0 sm:last:border-r-0"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FEATURED REVIEW */}
      {featured && (
        <section className="border-y bg-muted/25">
          <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.3fr_1fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
                  Featured Story
                </p>

                <div className="mt-5 text-7xl font-serif leading-none text-brand-red/20">
                  “
                </div>
              </div>

              <div className="max-w-4xl">
                <div className="mb-5 flex items-center gap-1 text-brand-red">
                  {Array.from({ length: featured.rating ?? 5 }).map(
                    (_, index) => (
                      <span key={index}>★</span>
                    ),
                  )}
                </div>

                <blockquote className="text-2xl font-medium leading-9 tracking-tight sm:text-3xl sm:leading-10">
                  “{featured.review}”
                </blockquote>

                <div className="mt-8 flex items-center gap-4 border-t pt-6">
                  {featured.imagePath ? (
                    <img
                      src={mediaUrl(featured.imagePath, "thumb")}
                      alt={featured.customerName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-bold text-brand-blue">
                      {featured.customerName?.charAt(0)}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold">{featured.customerName}</p>

                    {featured.vehicle && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {featured.vehicle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <Section>
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue">
            Customer Feedback
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            More customer experiences
          </h2>

          <p className="mt-4 text-muted-foreground">
            Genuine feedback from customers who have experienced the BESEKI
            difference.
          </p>
        </div>

        {remaining.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {remaining.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={
                  index === 0
                    ? "md:col-span-2 lg:col-span-2"
                    : ""
                }
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        ) : (
          <div className="border-y py-16 text-center">
            <p className="text-lg font-semibold">
              Customer stories are coming soon.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Once customers share their experiences with BESEKI, you'll find
              them here.
            </p>
          </div>
        )}
      </Section>

      {/* REVIEW FORM */}
      <section className="border-y bg-muted/25">
        <div className="mx-auto grid max-w-[1100px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
              Share Your Experience
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Bought a vehicle from BESEKI?
            </h2>

            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              We'd love to hear how your experience went. Your feedback helps
              future customers make a confident decision.
            </p>

            <div className="mt-8 border-l-2 border-brand-blue pl-5">
              <p className="text-sm font-semibold">
                Reviews are reviewed before publication.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                We value genuine and respectful customer feedback.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-background p-6 sm:p-8">
            <ReviewForm />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-brand-red text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-7 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              Ready for your next vehicle?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Find your next car with BESEKI.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
              Explore our current inventory or speak directly with our team in
              Mombasa.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <a
              href="/inventory"
              className="inline-flex h-12 items-center justify-center rounded-md bg-white px-6 text-sm font-semibold text-brand-red transition hover:bg-white/90"
            >
              Browse Inventory
            </a>

            <a
              href="https://wa.me/254721886656"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/40 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              WhatsApp BESEKI
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
