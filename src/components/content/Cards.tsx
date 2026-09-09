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
import { company } from "@/data/company";
import type { BlogPost } from "@/data/blog";
import type { FaqItem } from "@/data/faq";
import type { TeamProfile, Testimonial } from "@/data/site";

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

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col border-t-2 border-primary bg-card py-6 md:px-1">
      <Rating value={testimonial.rating} />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground">
        &ldquo;{testimonial.review}&rdquo;
      </blockquote>
      <figcaption className="mt-5 border-t pt-4 text-[13px]">
        <span className="font-semibold">{testimonial.customer}</span>
        <span className="block text-muted-foreground">{testimonial.vehicle}</span>
        <span className="mt-2 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Placeholder — awaiting real review
        </span>
      </figcaption>
    </figure>
  );
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="flex h-full flex-col border-t bg-card py-6 md:px-1">
      <p className="eyebrow">{post.category}</p>
      <h3 className="mt-3 text-[18px] font-semibold leading-snug">
        <Link to="/blog/$slug" params={{ slug: post.slug }} className="transition-colors hover:text-primary">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <p className="mt-5 text-[12.5px] text-muted-foreground">
        {new Date(post.date).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })} &middot;{" "}
        {post.readMinutes} min read
      </p>
    </article>
  );
}

export function TeamMember({ member }: { member: TeamProfile }) {
  return (
    <article className="flex h-full flex-col rounded-lg border bg-card p-6">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted text-lg font-bold text-muted-foreground">
        {member.position.charAt(0)}
      </div>
      <h3 className="mt-5 text-[17px] font-bold">{member.name}</h3>
      <p className="text-[13px] font-medium text-brand-blue">{member.position}</p>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-muted-foreground">{member.bio}</p>
      <div className="mt-5 space-y-2 border-t pt-4 text-[13px]">
        <a href={`tel:${company.phoneTel}`} className="flex items-center gap-2 hover:text-primary">
          <Phone className="size-3.5" aria-hidden="true" />
          {member.phone}
        </a>
        <a
          href={whatsappLink(`Hello ${company.name}, I would like to speak to your ${member.position} team.`)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 hover:text-primary"
        >
          <WhatsAppIcon className="size-3.5 text-whatsapp" />
          WhatsApp
        </a>
        <a href={`mailto:${member.email}`} className="flex items-center gap-2 break-all hover:text-primary">
          <Mail className="size-3.5" aria-hidden="true" />
          {member.email}
        </a>
      </div>
    </article>
  );
}

export function FAQAccordion({ items, idPrefix }: { items: FaqItem[]; idPrefix: string }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={item.q} value={`${idPrefix}-${i}`}>
          <AccordionTrigger className="text-left text-[15px] font-semibold">{item.q}</AccordionTrigger>
          <AccordionContent className="text-[14.5px] leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
