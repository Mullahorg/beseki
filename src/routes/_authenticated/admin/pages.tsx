import { createFileRoute } from "@tanstack/react-router";
import { CollectionAdmin } from "@/components/admin/Collection";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  component: () => (
    <CollectionAdmin
      spec={{
        table: "pages",
        title: "Pages",
        singular: "page",
        description: "Standalone pages such as About, Warranty, Privacy and Terms.",
        orderBy: { column: "title", ascending: true },
        defaults: { status: "draft", is_system: false },
        protectedFlag: "is_system",
        columns: [
          { name: "title", label: "Title" },
          { name: "slug", label: "Address" },
          { name: "status", label: "Status" },
        ],
        fields: [
          { name: "title", label: "Title", required: true },
          { name: "slug", label: "Address", required: true, hint: "For example: about, warranty, privacy" },
          { name: "intro", label: "Intro", type: "textarea" },
          { name: "body", label: "Page content", type: "textarea", hint: "Blank line starts a new paragraph." },
          { name: "featured_media_id", label: "Header image", type: "media" },
          { name: "seo_title", label: "SEO title" },
          { name: "seo_description", label: "SEO description", type: "textarea" },
          { name: "status", label: "Status", type: "status", options: ["draft", "published", "archived"] },
        ],
      }}
    />
  ),
});
