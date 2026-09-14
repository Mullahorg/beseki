import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { useNav } from "@/hooks/use-nav";
import { useSettings } from "@/hooks/use-settings";
import { mediaUrl } from "@/lib/media";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function Footer() {
  const { settings } = useSettings();
  const { primaryNav, moreNav, legalNav } = useNav();

  const currentYear = new Date().getFullYear();

  const logoSrc = settings.logoPath
    ? mediaUrl(settings.logoPath, "medium")
    : null;

  const phone = settings.phone ?? "0721 886656";
  const email = settings.email ?? "benkise26@gmail.com";
  const address =
    settings.address ??
    "Railway Station, Along Lumumba Road, Mombasa";

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Brand accent */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-primary/80 to-blue-700" />

      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-700/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        {/* Main footer */}
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr_1fr_1.2fr] lg:gap-10">
          {/* Company */}
          <div className="min-w-0">
            <Link
              to="/"
              aria-label={settings.companyName ?? "BESEKI COMPANY LIMITED"}
              className="inline-flex items-center transition-opacity duration-200 hover:opacity-90"
            >
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={settings.companyName ?? "BESEKI COMPANY LIMITED"}
                  className="h-14 w-auto max-w-[240px] object-contain object-left sm:h-16"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="text-2xl font-black tracking-tight">
                  BESEKI
                </span>
              )}
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              {settings.tagline ??
                "Trusted new and locally used motor vehicles in Mombasa."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  f
                </a>
              )}

              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  ig
                </a>
              )}

              {settings.tiktokUrl && (
                <a
                  href={settings.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  tk
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 lg:contents">
            {/* Explore */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Explore
              </h3>

              <nav className="mt-5 space-y-3" aria-label="Explore">
                {primaryNav.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group flex items-center gap-1.5 text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Support
              </h3>

              <nav className="mt-5 space-y-3" aria-label="Support">
                {moreNav.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group flex items-center gap-1.5 text-sm text-white/70 transition-colors duration-200 hover:text-white"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-70"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/45">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="group flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                  <Phone className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/35">
                    Call / WhatsApp
                  </span>
                  <span className="mt-1 block">{phone}</span>
                </span>
              </a>

              <a
                href={`mailto:${email}`}
                className="group flex items-start gap-3 text-sm text-white/70 transition-colors hover:text-white"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/60 transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                  <Mail className="h-4 w-4" />
                </span>

                <span className="min-w-0 break-all">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/35">
                    Email
                  </span>
                  <span className="mt-1 block">{email}</span>
                </span>
              </a>

              <div className="flex items-start gap-3 text-sm text-white/70">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/60">
                  <MapPin className="h-4 w-4" />
                </span>

                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/35">
                    Showroom
                  </span>
                  <span className="mt-1 block leading-5">{address}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-bold text-white">
                Looking for your next vehicle?
              </p>
              <p className="mt-1 text-sm text-white/55">
                Talk to our team and let us help you find the right car.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={whatsappLink(waMessages.general)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
              </a>

              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                Call Us
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-5 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
            <p>
              © {currentYear}{" "}
              <span className="font-medium text-white/55">
                {settings.companyName ?? "BESEKI COMPANY LIMITED"}
              </span>
              . All rights reserved.
            </p>

            <nav
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
              aria-label="Legal"
            >
              {legalNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "transition-colors duration-200 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
