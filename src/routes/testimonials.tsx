import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/common/Section";
import { TestimonialCard } from "@/components/content/Cards";
import { ReviewForm } from "@/components/forms/Forms";
import { testimonials } from "@/data/site";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Customer Testimonials | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "Reviews from customers of BESEKI COMPANY LIMITED in Mombasa. Bought a vehicle from us? Leave a review and tell others about your experience.",
      },
      { property: "og:title", content: "Customer Testimonials | BESEKI COMPANY LIMITED" },
      { property: "og:description", content: "What customers say about buying a vehicle from BESEKI in Mombasa." },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="What our customers say"
        subtitle="Feedback from people who have bought a vehicle from our Mombasa yard."
      />

      <Section>
        <p className="mb-8 rounded-lg border-l-4 border-l-brand-blue bg-muted p-4 text-[14px] text-muted-foreground">
          The reviews below are placeholders. Replace them with genuine customer feedback, published with permission,
          before going live.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <div className="mx-auto max-w-2xl rounded-xl border bg-card p-6 md:p-10">
          <h2 className="text-xl font-bold">Leave a review</h2>
          <p className="mt-2 text-[14.5px] text-muted-foreground">
            Reviews are checked by our team before they appear on this page.
          </p>
          <div className="mt-6">
            <ReviewForm />
          </div>
        </div>
      </Section>
    </>
  );
}
