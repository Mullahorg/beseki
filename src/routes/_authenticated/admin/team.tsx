import { createFileRoute } from "@tanstack/react-router";
import { CollectionAdmin } from "@/components/admin/Collection";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: () => (
    <CollectionAdmin
      spec={{
        table: "team_members",
        title: "Team",
        singular: "team member",
        description: "Real people only — publish a member once their details and photo are correct.",
        orderBy: { column: "position", ascending: true },
        defaults: { status: "draft", position: 0 },
        columns: [
          { name: "name", label: "Name" },
          { name: "position_title", label: "Role" },
          { name: "phone", label: "Phone" },
          { name: "status", label: "Status" },
        ],
        fields: [
          { name: "name", label: "Full name", required: true },
          { name: "position_title", label: "Role", required: true },
          { name: "bio", label: "Short bio", type: "textarea" },
          { name: "phone", label: "Phone" },
          { name: "email", label: "Email" },
          { name: "media_id", label: "Photo", type: "media" },
          { name: "position", label: "Sort order", type: "number" },
          { name: "status", label: "Status", type: "status", options: ["draft", "published", "archived"] },
        ],
      }}
    />
  ),
});
