import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { useNav, useSettings } from "@/lib/site-context";
import { mediaUrl } from "@/lib/media";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const WhatsAppIcon = ({
  className,
}: {
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.42-9.41 2.51 0 4.88.98 6.65 2.76a9.34 9.34 0 0 1 2.76 6.66c0 5.19-4.23 9.41-9.42 9.41zM20.46 3.54A11.75 11.75 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L.08 24l6.35-1.66a11.83 11.83 0 0 0 5.62 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.46-8.37z" />
  </svg>
);

export function Footer() {
  const settings = useSettings();
  const primaryNav = useNav("primary");
  const moreNav = useNav("more");
  const legalNav = useNav("legal");

  const currentYear = new Date().getFullYear();

  const logoSrc = settings.logoPath
    ? mediaUrl(settings.logoPath, "medium")
    : null;

  return (
    <footer className="relative overflow-hidden bg-ink text-ink-foreground">
      {/* Premium brand accent */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-primary/70 to-blue-700"
        aria-hidden="true"
      />

      {/* Decorative background elements */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-700/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative pb-8 pt-14 sm:pb-10 sm:pt-16">
        {/* Main footer grid */}
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.2fr] lg:gap-10">
          {/* =========================================================
              COMPANY
          ========================================================== */}
          <div className="min-w-0">
            <Link
              to="/"
              aria-label={`${settings.companyName} — home`}
              className="inline-flex items-center transition-opacity duration-200 hover:opacity-90"
            >
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={settings.companyName}
                  className="h-14 w-auto max-w-[250px] object-contain object-left sm:h-16 md:h-[68px]"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-2xl font-black tracking-tight sm:text-3xl">
                  {settings.shortName.slice(0, 4)}
                  <span className="text-primary">
                    {settings.shortName.slice(4)}
                  </span>
                </span>
              )}
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-ink-foreground/65">
              {settings.tagline ||
                "Trusted new and locally used motor vehicles in Mombasa."}
            </p>

            {/* Social links */}
            <div className="mt-6 flex flex-wrap gap-2">
              {settings.facebookUrl ? (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-white/65 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  f
                </a>
              ) : null}

              {settings.instagramUrl ? (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-bold uppercase text-white/65 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  ig
                </a>
              ) : null}

              {settings.tiktokUrl ? (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-bold uppercase text-white/65 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  tk
                </a>
              ) : null}
            </div>
          </div>

          {/* =========================================================
              MOBILE: TWO COLUMNS
          ========================================================== */}
          <div className="grid grid-cols-2 gap-8 lg:contents">
            {/* Explore */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                Explore
              </h3>

              <nav
                aria-label="Explore"
                className="mt-5 space-y-3"
              >
                {primaryNav.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    activeOptions={{
                      exact: item.href === "/",
                    }}
                    activeProps={{
                      className: "text-primary",
                    }}
                    className="group flex items-center gap-1.5 text-sm text-white/65 transition-colors duration-200 hover:text-white"
                  >
                    <span>{item.label}</span>

                    <ArrowUpRight
                      className="size-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                Support
              </h3>

              <nav
                aria-label="Support"
                className="mt-5 space-y-3"
              >
                {moreNav.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    className="group flex items-center gap-1.5 text-sm text-white/65 transition-colors duration-200 hover:text-white"
                  >
                    <span>{item.label}</span>

                    <ArrowUpRight
                      className="size-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* =========================================================
              CONTACT
          ========================================================== */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">
              {/* Phone */}
              <a
                href={`tel:${settings.phoneTel}`}
                className="group flex items-start gap-3 text-sm text-white/65 transition-colors hover:text-white"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/55 transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                  <Phone className="size-4" aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                    Call / WhatsApp
                  </span>

                  <span className="mt-1 block font-medium">
                    {settings.phoneDisplay}
                  </span>
                </span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${settings.email}`}
                className="group flex items-start gap-3 text-sm text-white/65 transition-colors hover:text-white"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/55 transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                  <Mail className="size-4" aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                    Email
                  </span>

                  <span className="mt-1 block break-all font-medium">
                    {settings.email}
                  </span>
                </span>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3 text-sm text-white/65">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/55">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                    Showroom
                  </span>

                  <span className="mt-1 block leading-5">
                    {settings.address}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            WHATSAPP CTA
        ========================================================== */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]">
          <div className="relative p-5 sm:p-6">
            {/* Small decorative accent */}
            <div
              className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/[0.06] to-transparent"
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-base font-bold text-white sm:text-lg">
                  Looking for your next vehicle?
                </p>

                <p className="mt-1 text-sm leading-5 text-white/50">
                  Talk to our team and let us help you find the right car.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <a
                  href={whatsappLink(waMessages.general)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105"
                >
                  <WhatsAppIcon className="size-5" />
                  Chat on WhatsApp
                </a>

                <a
                  href={`tel:${settings.phoneTel}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <Phone className="size-4" />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM BAR
        ========================================================== */}
        <div className="mt-9 border-t border-white/10 pt-6 sm:mt-10 sm:pt-7">
          <div className="flex flex-col gap-4 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
            <p>
              © {currentYear}{" "}
              <span className="font-medium text-white/55">
                {settings.companyName}
              </span>
              . All rights reserved.
            </p>

            {legalNav.length > 0 ? (
              <nav
                aria-label="Legal"
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
              >
                {legalNav.map((item) => (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={cn(
                      "transition-colors duration-200 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
