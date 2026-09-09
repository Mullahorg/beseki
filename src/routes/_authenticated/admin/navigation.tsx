import { createFileRoute } from "@tanstack/react-router";
import { CollectionAdmin } from "@/components/admin/Collection";

export const Route = createFileRoute("/_authenticated/admin/navigation")({
  component: () => (
    <CollectionAdmin
      spec={{
        table: "nav_items",
        title: "Navigation",
        singular: "link",
        description: "Links in the top menu and footer. Lower sort numbers appear first.",
        orderBy: { column: "position", ascending: true },
        defaults: { menu: "header", position: 0, visible: true, external: false, is_cta: false },
        columns: [
          { name: "label", label: "Label" },
          { name: "href", label: "Link" },
          { name: "menu", label: "Menu" },
          { name: "position", label: "Order" },
        ],
        fields: [
          { name: "label", label: "Label", required: true },
          { name: "href", label: "Link", required: true, placeholder: "/inventory" },
          { name: "menu", label: "Menu", type: "select", options: ["header", "footer", "footer-legal", "mobile"] },
          { name: "position", label: "Sort order", type: "number" },
        ],
      }}
    />
  ),
});
