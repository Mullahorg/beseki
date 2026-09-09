import { createFileRoute } from "@tanstack/react-router";
import { CollectionAdmin } from "@/components/admin/Collection";

export const Route = createFileRoute("/_authenticated/admin/faqs")({
  component: () => (
    <CollectionAdmin
      spec={{
        table: "faqs",
        title: "FAQs",
        singular: "question",
        description: "Questions and answers shown on the FAQ page and in search results.",
        orderBy: { column: "position", ascending: true },
        defaults: { status: "published", position: 0, category: "General" },
        columns: [
          { name: "question", label: "Question" },
          { name: "category", label: "Category" },
          { name: "status", label: "Status" },
        ],
        fields: [
          { name: "question", label: "Question", required: true },
          { name: "answer", label: "Answer", type: "textarea", required: true },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: ["General", "Buying", "Financing", "Imports", "Trade-in", "Warranty", "After-sales"],
          },
          { name: "position", label: "Sort order", type: "number" },
          { name: "status", label: "Status", type: "status", options: ["draft", "published", "archived"] },
        ],
      }}
    />
  ),
});
