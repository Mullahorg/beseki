import { createFileRoute } from "@tanstack/react-router";
import { CollectionAdmin } from "@/components/admin/Collection";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: () => (
    <CollectionAdmin
      spec={{
        table: "blog_posts",
        title: "Blog",
        singular: "post",
        description: "Write and publish articles. Drafts stay hidden from the public site.",
        orderBy: { column: "created_at", ascending: false },
        defaults: { status: "draft", category: "News" },
        columns: [
          { name: "title", label: "Title" },
          { name: "category", label: "Category" },
          { name: "published_at", label: "Published" },
          { name: "status", label: "Status" },
        ],
        fields: [
          { name: "title", label: "Title", required: true },
          { name: "slug", label: "Slug", required: true },
          { name: "excerpt", label: "Excerpt", type: "textarea" },
          { name: "body", label: "Article", type: "textarea", hint: "Plain paragraphs; blank line starts a new one." },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: ["News", "Buying guide", "Ownership", "Imports", "Financing", "Reviews"],
          },
          { name: "featured_media_id", label: "Cover image", type: "media" },
          { name: "published_at", label: "Publish date", type: "date" },
          { name: "seo_title", label: "SEO title" },
          { name: "seo_description", label: "SEO description", type: "textarea" },
          { name: "status", label: "Status", type: "status", options: ["draft", "published", "archived"] },
        ],
      }}
    />
  ),
});
