import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/common/Section";
import { TeamMember } from "@/components/content/Cards";
import { teamProfiles } from "@/data/site";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team | BESEKI COMPANY LIMITED, Mombasa" },
      {
        name: "description",
        content:
          "Meet the people behind BESEKI COMPANY LIMITED in Mombasa — sales, vehicle sourcing and importation, and after-sales support.",
      },
      { property: "og:title", content: "Our Team | BESEKI COMPANY LIMITED, Mombasa" },
      { property: "og:description", content: "The people you will deal with at our Lumumba Road yard in Mombasa." },
      { property: "og:url", content: "/team" },
    ],
    links: [{ rel: "canonical", href: "/team" }],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our team"
        title="The people you will deal with"
        subtitle="Small team, direct lines. You will usually speak to the same person from your first enquiry through to collection."
      />

      <Section>
        <p className="mb-8 rounded-lg border-l-4 border-l-brand-blue bg-muted p-4 text-[14px] text-muted-foreground">
          The profiles below are placeholders. Replace each name, photo, role and biography with real staff details
          before publishing.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamProfiles.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </Section>
    </>
  );
}
