import { createFileRoute } from "@tanstack/react-router";
import { CollectionAdmin } from "@/components/admin/Collection";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: () => (
    <CollectionAdmin
      spec={{
        table: "testimonials",
        title: "Testimonials",
        singular: "testimonial",
        description: "Only published testimonials appear on the website.",
        orderBy: { column: "position", ascending: true },
        defaults: { status: "draft", rating: 5, position: 0 },
        columns: [
          { name: "customer_name", label: "Customer" },
          { name: "vehicle", label: "Vehicle" },
          { name: "rating", label: "Rating" },
          { name: "status", label: "Status" },
        ],
        fields: [
          { name: "customer_name", label: "Customer name", required: true },
          { name: "vehicle", label: "Vehicle bought" },
          { name: "rating", label: "Rating (1-5)", type: "number" },
          { name: "review", label: "Review", type: "textarea", required: true },
          { name: "happened_on", label: "Date of purchase", type: "date" },
          { name: "media_id", label: "Customer photo", type: "media" },
          { name: "position", label: "Sort order", type: "number" },
          { name: "status", label: "Status", type: "status", options: ["draft", "published", "archived"] },
        ],
      }}
    />
  ),
});
