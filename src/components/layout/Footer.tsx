import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useNav, useSettings } from "@/lib/site-context";
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

export function Footer() {
  const settings = useSettings();
  const primaryNav = useNav("primary");
  const moreNav = useNav("more");
  const legalNav = useNav("legal");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-foreground/10 bg-ink text-ink-foreground">
      {/* Main footer */}
      <div className="container-page py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.25fr] lg:gap-12">
          {/* Company */}
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center"
              aria-label={`${settings.companyName} — home`}
            >
              <span className="text-2xl font-bold tracking-tight md:text-3xl">
                {settings.shortName.slice(0, 4)}
                <span className="text-primary-foreground/90">
                  {settings.shortName.slice(4)}
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-foreground/65">
              {settings.companyName}. {settings.tagline}.
            </p>

            <div className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-ink-foreground/50">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{settings.address.postal}</span>
            </div>

            {settings.socials.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-2">
                {settings.socials.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(
                        "inline-flex rounded-full border border-ink-foreground/15",
                        "px-3 py-1.5 text-xs font-medium",
                        "text-ink-foreground/65 transition-all duration-200",
                        "hover:border-ink-foreground/30",
                        "hover:bg-ink-foreground/5 hover:text-ink-foreground",
                      )}
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Navigation area
              2 columns on mobile so links don't create a very tall footer */}
          <div className="grid grid-cols-2 gap-8 lg:contents">
            <nav aria-label="Explore">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-foreground/40">
                Explore
              </h2>

              <ul className="mt-4 space-y-2.5">
                {primaryNav.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.href}
                      className={cn(
                        "text-sm text-ink-foreground/70",
                        "transition-colors duration-200",
                        "hover:text-ink-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Support">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-foreground/40">
                Support
              </h2>

              <ul className="mt-4 space-y-2.5">
                {moreNav.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.href}
                      className={cn(
                        "text-sm text-ink-foreground/70",
                        "transition-colors duration-200",
                        "hover:text-ink-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-foreground/40">
              Contact
            </h2>

            <address className="mt-4 space-y-4 text-sm not-italic">
              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-ink-foreground/40"
                  aria-hidden
                />

                <span className="leading-relaxed text-ink-foreground/70">
                  {settings.address.line1}
                  <br />
                  {settings.address.line2}
                  <br />
                  {settings.address.city}, {settings.address.country}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="size-4 shrink-0 text-ink-foreground/40"
                  aria-hidden
                />

                <a
                  href={`tel:${settings.phoneTel}`}
                  className="text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                >
                  {settings.phoneDisplay}
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Mail
                  className="mt-0.5 size-4 shrink-0 text-ink-foreground/40"
                  aria-hidden
                />

                <a
                  href={`mailto:${settings.email}`}
                  className="break-all text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                >
                  {settings.email}
                </a>
              </div>
            </address>

            {/* Mobile-friendly WhatsApp CTA */}
            <a
              href={`https://wa.me/${settings.phoneTel.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "mt-6 inline-flex items-center gap-2 rounded-full",
                "border border-ink-foreground/15 px-4 py-2.5",
                "text-xs font-semibold text-ink-foreground/80",
                "transition-all duration-200",
                "hover:border-ink-foreground/30",
                "hover:bg-ink-foreground/5 hover:text-ink-foreground",
              )}
            >
              <WhatsAppIcon className="size-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-foreground/10">
        <div
          className={cn(
            "container-page flex flex-col gap-4 py-5",
            "text-xs text-ink-foreground/45",
            "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <p>
            © {year} {settings.companyName}. All rights reserved.
          </p>

          {legalNav.length > 0 ? (
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalNav.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    className="transition-colors hover:text-ink-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
