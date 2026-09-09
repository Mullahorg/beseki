import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/common/Section";
import { BlogCard } from "@/components/content/Cards";
import { EmptyState } from "@/components/common/States";
import { blogCategories, blogPosts } from "@/data/blog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Car Buying Advice & Guides | BESEKI Blog, Mombasa" },
      {
        name: "description",
        content:
          "Practical car buying tips, maintenance advice, vehicle guides and notes on the Mombasa automotive market from BESEKI COMPANY LIMITED.",
      },
      { property: "og:title", content: "Car Buying Advice & Guides | BESEKI Blog, Mombasa" },
      {
        property: "og:description",
        content: "Buying tips, maintenance advice and vehicle guides from our Mombasa team.",
      },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [category, setCategory] = useState("All");
  const posts = category === "All" ? blogPosts : blogPosts.filter((p) => p.category === category);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Advice from the yard"
        subtitle="Short, practical pieces on buying, running and importing vehicles in Kenya."
      />

      <Section>
        <div
          className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2"
          role="group"
          aria-label="Filter articles by category"
        >
          {["All", ...blogCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors",
                category === c
                  ? "border-brand-blue bg-brand-blue text-brand-blue-foreground"
                  : "bg-card hover:border-foreground/30",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {posts.length === 0 ? (
          <EmptyState
            title="No articles in this category yet"
            message="Choose another category to see what else we have written."
            actionLabel="Show all articles"
            onAction={() => setCategory("All")}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
