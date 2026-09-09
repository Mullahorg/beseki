import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { Section } from "@/components/common/Section";
import { BlogCard } from "@/components/content/Cards";
import { blogPosts } from "@/data/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);

    if (!post) {
      throw notFound();
    }

    return { post };
  },

  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article unavailable | BESEKI" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const { post } = loaderData;

    return {
      meta: [
        {
          title: `${post.title} | BESEKI COMPANY LIMITED`,
        },
        {
          name: "description",
          content: post.excerpt,
        },
        {
          property: "og:title",
          content: post.title,
        },
        {
          property: "og:description",
          content: post.excerpt,
        },
        {
          property: "og:type",
          content: "article",
        },
        {
          property: "og:url",
          content: `/blog/${params.slug}`,
        },
      ],

      links: [
        {
          rel: "canonical",
          href: `/blog/${params.slug}`,
        },
      ],

      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            articleSection: post.category,
            author: {
              "@type": "Organization",
              name: "BESEKI COMPANY LIMITED",
            },
            publisher: {
              "@type": "Organization",
              name: "BESEKI COMPANY LIMITED",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `/blog/${params.slug}`,
            },
          }),
        },
      ],
    };
  },

  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  const related = blogPosts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.category === post.category,
    )
    .slice(0, 3);

  const date = new Date(post.date).toLocaleDateString(
    "en-KE",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <>
      {/* =========================================================
          ARTICLE HERO
      ========================================================= */}
      <header className="border-b bg-background">
        <div className="container-page py-12 md:py-20">
          <div className="mx-auto max-w-4xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft
                className="size-3.5"
                aria-hidden="true"
              />
              Back to articles
            </Link>

            <div className="mt-10 max-w-3xl">
              <p className="eyebrow">{post.category}</p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl md:leading-[1.05]">
                {post.title}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {post.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-5 text-[13px] text-muted-foreground">
                <span>{date}</span>

                <span
                  className="text-border"
                  aria-hidden="true"
                >
                  •
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Clock3
                    className="size-3.5"
                    aria-hidden="true"
                  />
                  {post.readMinutes} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          ARTICLE CONTENT
      ========================================================= */}
      <main>
        <Section>
          <div className="grid gap-12 lg:grid-cols-[180px_minmax(0,700px)] lg:justify-center lg:gap-16">
            {/* Desktop article information */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 border-t pt-5">
                <p className="eyebrow">Article</p>

                <div className="mt-4 space-y-4 text-[13px] text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">
                      Category
                    </p>
                    <p className="mt-1">{post.category}</p>
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      Published
                    </p>
                    <p className="mt-1">{date}</p>
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      Reading time
                    </p>
                    <p className="mt-1">
                      {post.readMinutes} minutes
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Article body */}
            <article className="max-w-3xl">
              <div className="space-y-6 text-[16px] leading-[1.85] text-foreground md:text-[17px]">
                {post.body.map((paragraph, index) => (
                  <p
                    key={`${post.slug}-${index}`}
                    className={
                      index === 0
                        ? "first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-brand-red first-letter:float-left first-letter:mr-2"
                        : undefined
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Article footer */}
              <div className="mt-12 border-t pt-6">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-brand-red"
                >
                  <ArrowLeft
                    className="size-4"
                    aria-hidden="true"
                  />
                  Back to all articles
                </Link>
              </div>
            </article>
          </div>
        </Section>

        {/* =======================================================
            RELATED ARTICLES
        ======================================================= */}
        {related.length > 0 ? (
          <Section tone="muted">
            <div className="flex flex-col gap-4 border-b pb-7 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">
                  Keep reading
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
                  More in {post.category}
                </h2>
              </div>

              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:text-brand-red"
              >
                View all articles
                <ArrowRight
                  className="size-4"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((relatedPost) => (
                <BlogCard
                  key={relatedPost.slug}
                  post={relatedPost}
                />
              ))}
            </div>
          </Section>
        ) : null}

        {/* =======================================================
            DEALERSHIP CTA
        ======================================================= */}
        <section className="border-t bg-brand-red text-white">
          <div className="container-page py-14 md:py-16">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div className="max-w-2xl">
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/70">
                  Looking for your next car?
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                  Browse the latest vehicles from BESEKI.
                </h2>

                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/80">
                  Explore our current inventory or speak directly with our
                  team about a vehicle you are interested in.
                </p>
              </div>

              <Button
                size="lg"
                variant="secondary"
                asChild
                className="w-full md:w-auto"
              >
                <Link to="/inventory">
                  Browse Inventory
                  <ArrowRight
                    className="ml-1 size-4"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
