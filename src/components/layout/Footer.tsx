import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNav, useSettings } from "@/lib/site-context";
import { mediaUrl } from "@/lib/media";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.42-9.41 2.51 0 4.88.98 6.65 2.76a9.34 9.34 0 0 1 2.76 6.66c0 5.19-4.23 9.41-9.42 9.41zM20.46 3.54A11.75 11.75 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L.08 24l6.35-1.66a11.83 11.83 0 0 0 5.62 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.46-8.37z" />
  </svg>
);

function FooterSocialLink({
  href,
  label,
  children,
}: {
  href?: string | null;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={cn(
        "flex size-10 items-center justify-center rounded-full",
        "border border-white/10 bg-white/[0.05]",
        "text-white/65 transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-white/20",
        "hover:bg-white/10 hover:text-white",
      )}
    >
      {children}
    </a>
  );
}

export function Footer() {
  const settings = useSettings();

  const primaryNav = useNav("primary");
  const moreNav = useNav("more");
  const legalNav = useNav("legal");

  const logoSrc = settings.logoPath
    ? mediaUrl(settings.logoPath, "medium")
    : null;

  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-ink-foreground">
      {/* Brand accent */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-secondary"
      />

      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 size-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 size-80 rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="container-page relative">
        {/* Main footer */}
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.45fr_0.8fr_0.8fr_1.15fr] lg:gap-10 lg:py-20">
          {/* Company */}
          <div className="max-w-md">
            <Link
              to="/"
              aria-label={`${settings.companyName} — home`}
              className="group inline-flex items-center"
            >
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={settings.companyName}
                  className="h-14 w-auto max-w-[250px] object-contain object-left transition-opacity duration-200 group-hover:opacity-90 sm:h-16 md:h-[68px]"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {settings.shortName.slice(0, 4)}
                  <span className="text-primary">
                    {settings.shortName.slice(4) || ""}
                  </span>
                </span>
              )}
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
              {settings.tagline ||
                "Your trusted partner for quality vehicles in Mombasa."}
            </p>

            {/* Trust statement */}
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <span className="text-sm font-bold">✓</span>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Straight answers. Quality vehicles.
                </p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  A dealership experience built around transparency and trust.
                </p>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-2">
              <FooterSocialLink
                href={settings.facebookUrl}
                label="Facebook"
              >
                <span className="text-sm font-bold">f</span>
              </FooterSocialLink>

              <FooterSocialLink
                href={settings.instagramUrl}
                label="Instagram"
              >
                <span className="text-sm font-semibold">◎</span>
              </FooterSocialLink>

              <FooterSocialLink
                href={settings.tiktokUrl}
                label="TikTok"
              >
                <span className="text-sm font-bold">♪</span>
              </FooterSocialLink>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Explore
            </h3>

            <ul className="mt-5 space-y-1">
              {primaryNav.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    className="group flex items-center py-2 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    <ChevronRight className="mr-1 size-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Support
            </h3>

            <ul className="mt-5 space-y-1">
              {moreNav.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    className="group flex items-center py-2 text-sm text-white/55 transition-colors hover:text-white"
                  >
                    <ChevronRight className="mr-1 size-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">
              {/* Address */}
              {settings.address ? (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/65">
                    <MapPin className="size-4" />
                  </div>

                  <p className="text-sm leading-6 text-white/55">
                    {settings.address}
                  </p>
                </div>
              ) : null}

              {/* Phone */}
              {settings.phoneTel ? (
                <a
                  href={`tel:${settings.phoneTel}`}
                  className="group flex items-center gap-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/65 transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                    <Phone className="size-4" />
                  </div>

                  <span className="text-sm text-white/60 transition-colors group-hover:text-white">
                    {settings.phoneDisplay}
                  </span>
                </a>
              ) : null}

              {/* Email */}
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="group flex items-center gap-3"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/65 transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                    <Mail className="size-4" />
                  </div>

                  <span className="break-all text-sm text-white/60 transition-colors group-hover:text-white">
                    {settings.email}
                  </span>
                </a>
              ) : null}
            </div>

            {/* Contact CTA */}
            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row lg:flex-col">
              <Button
                variant="whatsapp"
                size="sm"
                className="rounded-full shadow-sm"
                asChild
              >
                <a
                  href={whatsappLink(waMessages.general)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp Us
                </a>
              </Button>

              {settings.phoneTel ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  asChild
                >
                  <a href={`tel:${settings.phoneTel}`}>
                    <Phone className="size-4" />
                    Call Us
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p className="text-white/40">
            © {year} {settings.companyName}. All rights reserved.
          </p>

          {legalNav.length > 0 ? (
            <nav aria-label="Legal">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {legalNav.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.href}
                      className="text-white/40 transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>

      {/* Floating back-to-top */}
      <a
        href="#top"
        aria-label="Back to top"
        className={cn(
          "absolute bottom-6 right-4 hidden size-10 items-center justify-center rounded-full",
          "border border-white/10 bg-white/[0.05] text-white/50",
          "transition-all duration-200 hover:-translate-y-1",
          "hover:bg-white/10 hover:text-white sm:flex",
        )}
      >
        <ArrowUpRight className="size-4 -rotate-45" />
      </a>
    </footer>
  );
}

export { WhatsAppIcon };
