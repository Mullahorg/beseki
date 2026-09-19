import { Link } from "@tanstack/react-router";
import { ArrowUpRight, KeyRound, Mail, MapPin, Phone } from "lucide-react";

import { useNav, useSettings } from "@/lib/site-context";
import { mediaUrl } from "@/lib/media";
import { waMessages, whatsappLink } from "@/lib/whatsapp";

function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.52 3.48A11.82 11.82 0 0 0 12.05 0C5.51 0 .19 5.32.19 11.86c0 2.09.55 4.13 1.59 5.92L.09 24l6.36-1.67a11.82 11.82 0 0 0 5.6 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.24-6.15-3.4-8.41ZM12.06 21.75h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.77.99 1.01-3.68-.23-.38a9.84 9.84 0 0 1-1.51-5.24C2.17 6.43 6.6 2 12.05 2a9.84 9.84 0 0 1 6.99 2.9 9.85 9.85 0 0 1 2.9 7c0 5.45-4.43 9.85-9.88 9.85Zm5.41-7.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.23 1.35.2 1.86.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

export function Footer() {
  const settings = useSettings();

  const primaryNav = useNav("primary");
  const moreNav = useNav("more");
  const legalNav = useNav("legal");

  /*
   * settings.address is an object:
   * {
   *   line1,
   *   line2,
   *   city,
   *   country,
   *   postal
   * }
   *
   * Convert it to a string before rendering.
   */
  const formattedAddress = settings.address
    ? [
        settings.address.line1,
        settings.address.line2,
        settings.address.city,
        settings.address.country,
        settings.address.postal,
      ]
        .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
        .join(", ")
    : "";

  const logoSrc = settings.logoPath ? mediaUrl(settings.logoPath, "medium") : null;

  const phoneHref = settings.phoneTel ? `tel:${settings.phoneTel}` : undefined;

  const whatsappHref = whatsappLink(waMessages.general);
  const socialUrl = (label: string) =>
    settings.socials.find((social) => social.label.toLowerCase() === label)?.url;
  const facebookUrl = socialUrl("facebook");
  const instagramUrl = socialUrl("instagram");
  const tiktokUrl = socialUrl("tiktok");

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Top brand accent */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-blue-600" />

      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 size-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-10 size-80 rounded-full bg-blue-600/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {/* ============================================================
            RESPONSIVE FOOTER GRID
            Mobile/small screens:
            - Company = full width
            - Explore + Support = two columns
            - Contact = full width

            Large screens:
            - Original 4-column layout
        ============================================================ */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          {/* ============================================================
              COMPANY
          ============================================================ */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center rounded-xl transition-opacity hover:opacity-90"
              aria-label={settings.companyName}
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
                <span className="text-2xl font-black tracking-tight">
                  {settings.shortName?.slice(0, 4) || "BESE"}
                  <span className="text-primary">{settings.shortName?.slice(4) || "KI"}</span>
                </span>
              )}
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
              {settings.tagline ||
                "Quality vehicles. Straight answers. A dealership you can trust."}
            </p>

            {/* Social links */}
            <div className="mt-7 flex flex-wrap gap-2">
              {facebookUrl ? (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  <span className="text-sm font-bold">f</span>
                </a>
              ) : null}

              {instagramUrl ? (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  <span className="text-xs font-bold">ig</span>
                </a>
              ) : null}

              {tiktokUrl ? (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/65 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  <span className="text-sm font-bold">♪</span>
                </a>
              ) : null}
            </div>
          </div>

          {/* ============================================================
              EXPLORE
          ============================================================ */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">Explore</h3>

            <nav className="mt-5 space-y-3">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group flex items-center justify-between text-sm text-white/55 transition-colors hover:text-white"
                >
                  <span>{item.label}</span>

                  <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          {/* ============================================================
              SUPPORT
          ============================================================ */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">Support</h3>

            <nav className="mt-5 space-y-3">
              {moreNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="group flex items-center justify-between text-sm text-white/55 transition-colors hover:text-white"
                >
                  <span>{item.label}</span>

                  <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          {/* ============================================================
              CONTACT
          ============================================================ */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">Contact Us</h3>

            <div className="mt-5 space-y-4">
              {/* Phone */}
              {settings.phoneDisplay && phoneHref ? (
                <a href={phoneHref} className="group flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/65 transition-colors group-hover:bg-primary/20 group-hover:text-white">
                    <Phone className="size-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs text-white/35">Call us</span>

                    <span className="mt-0.5 block text-sm text-white/70 transition-colors group-hover:text-white">
                      {settings.phoneDisplay}
                    </span>
                  </span>
                </a>
              ) : null}

              {/* Email */}
              {settings.email ? (
                <a href={`mailto:${settings.email}`} className="group flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/65 transition-colors group-hover:bg-primary/20 group-hover:text-white">
                    <Mail className="size-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs text-white/35">Email</span>

                    <span className="mt-0.5 block break-all text-sm text-white/70 transition-colors group-hover:text-white">
                      {settings.email}
                    </span>
                  </span>
                </a>
              ) : null}

              {/* Address */}
              {formattedAddress ? (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/65">
                    <MapPin className="size-4" />
                  </span>

                  <p className="text-sm leading-6 text-white/55">{formattedAddress}</p>
                </div>
              ) : null}
            </div>

            {/* WhatsApp */}
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:brightness-105"
              >
                <WhatsAppIcon className="size-5" />
                Chat on WhatsApp
              </a>
            ) : null}
          </div>
        </div>

        {/* ================================================================
            BOTTOM BAR
        ================================================================ */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-5 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {settings.companyName}. All rights reserved.
            </p>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalNav.length > 0 ? (
                <>
                  {legalNav.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              ) : null}
              <Link
                to="/auth"
                aria-label="Staff sign in"
                className="inline-flex items-center gap-1.5 text-white/25 transition-colors hover:text-white/60"
              >
                <KeyRound className="size-3" aria-hidden="true" />
                Staff access
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
