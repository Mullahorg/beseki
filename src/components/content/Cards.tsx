import { Link } from "@tanstack/react-router";
import { Mail, Phone, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WhatsAppIcon } from "@/components/layout/Header";
import { whatsappLink } from "@/lib/whatsapp";
import { useSettings } from "@/lib/site-context";
import { mediaUrl, mediaSrcSet } from "@/lib/media";
import type { BlogRecord, FaqRecord, TeamRecord, TestimonialRecord } from "@/lib/content.functions";

export function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={i <= value ? "size-4 fill-primary text-primary" : "size-4 text-border"}
        />
      ))}
    </div>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: TestimonialRecord }) {
  return (
    <figure className="flex h-full flex-col border-t-2 border-primary bg-card py-6 md:px-1">
      <Rating value={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
        &ldquo;{testimonial.review}&rdquo;
      </blockquote>
      <figcaption className="mt-5 border-t pt-4 text-[13px]">
        <span className="font-semibold">{testimonial.customerName}</span>
        {testimonial.vehicle ? <span className="block text-muted-foreground">{testimonial.vehicle}</span> : null}
      </figcaption>
    </figure>
  );
}

export function BlogCard({ post }: { post: BlogRecord }) {
  const words = post.body.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(words / 200));

  return (
    <article className="flex h-full flex-col border-t bg-card py-6 md:px-1">
      {post.imagePath ? (
        <img
          src={mediaUrl(post.imagePath, "card")}
          srcSet={mediaSrcSet(post.imagePath)}
          sizes="(min-width: 768px) 33vw, 100vw"
          alt={post.imageAlt || post.title}
          loading="lazy"
          className="mb-5 aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <p className="eyebrow">{post.category}</p>
      <h3 className="mt-3 text-[18px] font-semibold leading-snug">
        <Link to="/blog/$slug" params={{ slug: post.slug }} className="transition-colors hover:text-primary">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <p className="mt-5 text-[12.5px] text-muted-foreground">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("en-KE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "Unpublished"}{" "}
        &middot; {readMinutes} min read
      </p>
    </article>
  );
}

export function TeamMember({ member }: { member: TeamRecord }) {
  const settings = useSettings();
  const phone = member.phone || settings.phoneDisplay;
  const email = member.email || settings.email;

  return (
    <article className="flex h-full flex-col rounded-lg border bg-card p-6">
      {member.imagePath ? (
        <img
          src={mediaUrl(member.imagePath, "thumb")}
          alt={member.name}
          loading="lazy"
          className="size-16 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-16 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
          {member.positionTitle.charAt(0)}
        </div>
      )}
      <h3 className="mt-5 text-[17px] font-bold">{member.name}</h3>
      <p className="text-[13px] font-medium text-brand-blue">{member.positionTitle}</p>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">{member.bio}</p>
      <div className="mt-5 space-y-2 border-t pt-4 text-[13px]">
        <a href={`tel:${settings.phoneTel}`} className="flex items-center gap-2 hover:text-primary">
          <Phone className="size-3.5" aria-hidden="true" />
          {phone}
        </a>
        <a
          href={whatsappLink(
            `Hello ${settings.companyName}, I would like to speak to your ${member.positionTitle} team.`,
          )}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-primary"
        >
          <WhatsAppIcon className="size-3.5 text-whatsapp" />
          WhatsApp
        </a>
        <a href={`mailto:${email}`} className="flex items-center gap-2 break-all hover:text-primary">
          <Mail className="size-3.5" aria-hidden="true" />
          {email}
        </a>
      </div>
    </article>
  );
}

export function FAQAccordion({ items, idPrefix }: { items: FaqRecord[]; idPrefix: string }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={item.id} value={`${idPrefix}-${i}`}>
          <AccordionTrigger className="text-left text-[15px] font-semibold">{item.question}</AccordionTrigger>
          <AccordionContent className="text-[14.5px] leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
