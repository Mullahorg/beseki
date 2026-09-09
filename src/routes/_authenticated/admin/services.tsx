import { createFileRoute } from "@tanstack/react-router";
import { CollectionAdmin } from "@/components/admin/Collection";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: () => (
    <CollectionAdmin
      spec={{
        table: "services",
        title: "Services",
        singular: "service",
        description: "What BESEKI offers, shown on the homepage and services page.",
        orderBy: { column: "position", ascending: true },
        defaults: { status: "published", position: 0, points: [] },
        columns: [
          { name: "title", label: "Service" },
          { name: "slug", label: "Slug" },
          { name: "status", label: "Status" },
        ],
        fields: [
          { name: "title", label: "Title", required: true },
          { name: "slug", label: "Slug", required: true, hint: "Used in the web address, e.g. vehicle-import" },
          { name: "summary", label: "Short summary", type: "textarea" },
          { name: "detail", label: "Full description", type: "textarea" },
          { name: "points", label: "Key points", type: "list", hint: "One point per line" },
          { name: "media_id", label: "Image", type: "media" },
          { name: "position", label: "Sort order", type: "number" },
          { name: "status", label: "Status", type: "status", options: ["draft", "published", "archived"] },
        ],
      }}
    />
  ),
});
