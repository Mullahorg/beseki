import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  TikTok,
} from "lucide-react";
import { useNav, useSettings } from "@/lib/site-context";
import { mediaUrl } from "@/lib/media";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.48 0 .13 5.35.13 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.65a11.9 11.9 0 0 0 5.78 1.48h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.46-8.43ZM12.06 21.85h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.87 9.87 0 0 1-1.51-5.31c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.15 1.03 7.03 2.91a9.88 9.88 0 0 1 2.91 7.04c0 5.48-4.46 9.94-9.94 9.94Zm5.45-7.44c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.47-1.74-1.64-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.71.64.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "group flex h-10 w-10 items-center justify-center rounded-full",
        "border border-white/10 bg-white/[0.05]",
        "text-white/60 transition-all duration-300",
        "hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:text-white",
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

  const formattedAddress = settings.address
    ? [
        settings.address.line1,
        settings.address.line2,
        settings.address.city,
        settings.address.country,
        settings.address.postal,
      ]
        .filter(
          (value): value is string =>
            typeof value === "string" && value.trim().length > 0,
        )
        .join(", ")
    : "";

  const phoneHref = settings.phoneTel
    ? `tel:${settings.phoneTel}`
    : undefined;

  const emailHref = settings.email
    ? `mailto:${settings.email}`
    : undefined;

  const whatsappHref = whatsappLink(waMessages.general);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Premium brand accent */}
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-red-700 via-red-500 to-blue-700" />

      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-red-700/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-blue-700/10 blur-3xl"
      />

      <div className="relative">
        {/* Main footer */}
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.15fr]">
            {/* Company */}
            <div className="max-w-md">
              <Link
                to="/"
                className="inline-flex items-center rounded-xl transition-opacity hover:opacity-90"
                aria-label={settings.companyName || "BESEKI COMPANY LIMITED"}
              >
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={settings.companyName || "BESEKI COMPANY LIMITED"}
                    className="h-14 w-auto max-w-[230px] object-contain object-left"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-red-900 font-black text-white shadow-lg">
                      B
                    </div>

                    <div>
                      <p className="text-base font-extrabold tracking-tight text-white">
                        {settings.companyName || "BESEKI COMPANY LIMITED"}
                      </p>

                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                        Motor Vehicles
                      </p>
                    </div>
                  </div>
                )}
              </Link>

              <p className="mt-6 text-sm leading-7 text-white/55">
                {settings.tagline ||
                  "Quality vehicles. Straight answers. A dealership you can trust in Mombasa."}
              </p>

              {/* Trust indicators */}
              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-700/15 text-red-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Deal with confidence
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-white/45">
                    Clear information and customer-focused service.
                  </p>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-7 flex items-center gap-2">
                <SocialIcon
                  href={settings.facebookUrl || ""}
                  label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </SocialIcon>

                <SocialIcon
                  href={settings.instagramUrl || ""}
                  label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </SocialIcon>

                <SocialIcon
                  href={settings.tiktokUrl || ""}
                  label="TikTok"
                >
                  <span className="text-sm font-bold">♪</span>
                </SocialIcon>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                Explore
              </h3>

              <ul className="mt-5 space-y-3">
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                    >
                      <span>{item.label}</span>

                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support / More */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                Services
              </h3>

              <ul className="mt-5 space-y-3">
                {moreNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
                    >
                      <span>{item.label}</span>

                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                Contact Us
              </h3>

              <div className="mt-5 space-y-4">
                {phoneHref && (
                  <a
                    href={phoneHref}
                    className="group flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/50 transition-colors group-hover:bg-red-700/15 group-hover:text-red-400">
                      <Phone className="h-4 w-4" />
                    </span>

                    <span>
                      <span className="block text-[11px] uppercase tracking-wider text-white/35">
                        Call us
                      </span>

                      <span className="mt-1 block text-sm font-medium text-white/75 transition-colors group-hover:text-white">
                        {settings.phoneDisplay || settings.phoneTel}
                      </span>
                    </span>
                  </a>
                )}

                {emailHref && (
                  <a
                    href={emailHref}
                    className="group flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/50 transition-colors group-hover:bg-blue-700/15 group-hover:text-blue-400">
                      <Mail className="h-4 w-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-wider text-white/35">
                        Email
                      </span>

                      <span className="mt-1 block break-all text-sm font-medium text-white/75 transition-colors group-hover:text-white">
                        {settings.email}
                      </span>
                    </span>
                  </a>
                )}

                {formattedAddress && (
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/50">
                      <MapPin className="h-4 w-4" />
                    </span>

                    <span>
                      <span className="block text-[11px] uppercase tracking-wider text-white/35">
                        Showroom
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-white/60">
                        {formattedAddress}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* WhatsApp CTA */}
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-7 flex items-center justify-center gap-2.5 rounded-xl",
                    "bg-[#25D366] px-5 py-3.5",
                    "text-sm font-bold text-white shadow-lg shadow-black/20",
                    "transition-all duration-300",
                    "hover:-translate-y-0.5 hover:brightness-105 hover:shadow-xl",
                  )}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  WhatsApp Us
                </a>
              )}
            </div>
          </div>

          {/* Conversion CTA */}
          <div className="mt-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025]">
            <div className="relative px-6 py-8 sm:px-8 lg:flex lg:items-center lg:justify-between lg:px-10 lg:py-9">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-red-700/10 blur-3xl"
              />

              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                  Ready for your next vehicle?
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Find a vehicle that fits your journey.
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-white/50">
                  Browse our available vehicles or speak directly with the
                  BESEKI team for assistance.
                </p>
              </div>

              <div className="relative mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
                <Link
                  to="/inventory"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl",
                    "bg-white px-5 py-3.5",
                    "text-sm font-bold text-ink",
                    "transition-all duration-300",
                    "hover:-translate-y-0.5 hover:bg-white/90",
                  )}
                >
                  Browse Inventory
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-xl",
                      "border border-white/15 bg-white/[0.04] px-5 py-3.5",
                      "text-sm font-bold text-white",
                      "transition-all duration-300",
                      "hover:-translate-y-0.5 hover:bg-white/10",
                    )}
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Talk to Us
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.08]">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p className="text-xs text-white/35">
              © {currentYear}{" "}
              <span className="text-white/55">
                {settings.companyName || "BESEKI COMPANY LIMITED"}
              </span>
              . All rights reserved.
            </p>

            {legalNav.length > 0 && (
              <nav
                aria-label="Legal navigation"
                className="flex flex-wrap items-center gap-x-5 gap-y-2"
              >
                {legalNav.map((item, index) => (
                  <span key={item.href} className="flex items-center gap-5">
                    {index > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-white/20"
                      />
                    )}

                    <Link
                      to={item.href}
                      className="text-xs text-white/35 transition-colors hover:text-white/70"
                    >
                      {item.label}
                    </Link>
                  </span>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
