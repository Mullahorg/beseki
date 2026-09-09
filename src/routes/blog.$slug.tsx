import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/common/Section";
import { BlogCard } from "@/components/content/Cards";
import { blogPosts } from "@/data/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article unavailable | BESEKI" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} | BESEKI COMPANY LIMITED` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
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
            publisher: { "@type": "Organization", name: "BESEKI COMPANY LIMITED" },
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const related = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const date = new Date(post.date).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <article className="container-page py-10 md:py-16">
        <div className="mx-auto max-w-[700px]">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            All articles
          </Link>
          <p className="eyebrow mt-6">{post.category}</p>
          <h1 className="mt-3 text-[32px] font-bold leading-tight md:text-[40px]">{post.title}</h1>
          <p className="mt-4 text-[13px] text-muted-foreground">
            {date} &middot; {post.readMinutes} min read
          </p>
          <div className="mt-8 space-y-5 text-[16.5px] leading-relaxed">
            {post.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      {related.length ? (
        <Section tone="muted">
          <h2 className="mb-8 text-2xl font-bold">More in {post.category}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
