import { useMemo, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/content/Cards";
import { listBlogPosts } from "@/lib/content.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    try {
      return { posts: await listBlogPosts() };
    } catch {
      return { posts: [] };
    }
  },
  head: () => ({
    meta: [
      { title: "Car Buying Advice & News | BESEKI COMPANY LIMITED" },
      {
        name: "description",
        content:
          "Practical articles on buying, financing, importing and maintaining vehicles in Mombasa, written by the BESEKI COMPANY LIMITED team.",
      },
      { property: "og:title", content: "Car Buying Advice & News | BESEKI COMPANY LIMITED" },
      {
        property: "og:description",
        content: "Guides on buying, financing, importing and maintaining vehicles in Mombasa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { posts } = Route.useLoaderData();
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))],
    [posts],
  );

  const visible = category === "All" ? posts : posts.filter((p) => p.category === category);
  const [lead, ...rest] = visible;

  return (
    <>
      {/* HERO */}
      <section className="border-b bg-background">
        <div className="container-page py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow">From BESEKI</p>

              <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-[-0.03em] md:text-[56px]">
                Useful reading before you buy.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Practical guidance on choosing, financing, importing and looking after a
                vehicle on the Kenyan coast.
              </p>
            </div>

            <Button size="lg" asChild>
              <Link to="/inventory">
                Browse Inventory
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Section>
        {posts.length === 0 ? (
          <div className="border-y py-16 text-center">
            <p className="text-lg font-semibold">Articles are on the way.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Once articles are published they will appear here.
            </p>
          </div>
        ) : (
          <>
            {categories.length > 2 && (
              <nav aria-label="Article categories" className="mb-10 flex flex-wrap gap-2 border-b pb-5">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    aria-pressed={category === c}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors",
                      category === c
                        ? "border-primary bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </nav>
            )}

            {lead && (
              <article className="grid gap-8 border-b pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <p className="eyebrow">{lead.category}</p>

                  <h2 className="mt-3 text-[30px] font-bold leading-tight tracking-[-0.02em] md:text-[40px]">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: lead.slug }}
                      className="transition-colors hover:text-primary"
                    >
                      {lead.title}
                    </Link>
                  </h2>

                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground">
                    {lead.excerpt}
                  </p>

                  <Link
                    to="/blog/$slug"
                    params={{ slug: lead.slug }}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-primary"
                  >
                    Read the article
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>

                <div className="lg:justify-self-end">
                  <p className="text-sm text-muted-foreground">
                    {lead.publishedAt
                      ? new Date(lead.publishedAt).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                </div>
              </article>
            )}

            {rest.length > 0 && (
              <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      {/* CTA */}
      <section className="border-t bg-primary text-primary-foreground">
        <div className="container-page flex flex-col gap-7 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] opacity-75">
              Ready to look at cars?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-[38px]">
              See what is on the yard today.
            </h2>
          </div>

          <Button size="lg" variant="secondary" asChild className="md:shrink-0">
            <Link to="/inventory">
              Browse Inventory
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
