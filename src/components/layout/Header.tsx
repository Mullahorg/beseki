import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav, useSettings } from "@/lib/site-context";
import { mediaUrl } from "@/lib/media";
import type { NavItem } from "@/lib/content.functions";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/layout/SearchDialog";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.42-9.41 2.51 0 4.88.98 6.65 2.76a9.34 9.34 0 0 1 2.76 6.66c0 5.19-4.23 9.41-9.42 9.41zM20.46 3.54A11.75 11.75 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L.08 24l6.35-1.66a11.83 11.83 0 0 0 5.62 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.46-8.37z" />
  </svg>
);

export function Header() {
  const settings = useSettings();
  const primaryNav = useNav("primary");
  const moreNav = useNav("more");

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Top information bar */}
      <div className="bg-ink text-ink-foreground">
        <div className="container-page grid min-h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-1.5 text-[12px]">
          <div className="announcement-track min-w-0 overflow-hidden text-ink-foreground/75">
            {settings.announcementEnabled && settings.announcement ? (
              <div className="announcement-marquee" aria-label={settings.announcement}>
                <span>{settings.announcement}</span>
                <span aria-hidden="true">{settings.announcement}</span>
              </div>
            ) : null}
          </div>

          <a
            href={`tel:${settings.phoneTel}`}
            className="hidden items-center gap-1.5 font-medium transition-opacity hover:opacity-80 sm:inline-flex"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            {settings.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-background/95 backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-300 ease-out",
          scrolled ? "border-border/80 shadow-header" : "border-border/40 shadow-none",
        )}
      >
        <div
          className={cn(
            "container-page flex items-center justify-between gap-4 transition-[height] duration-300 ease-out",
            scrolled ? "h-16 md:h-[72px]" : "h-[76px] md:h-[88px]",
          )}
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label={`${settings.companyName} — home`}
            className="group flex min-w-0 shrink-0 items-center"
          >
            {settings.logoPath ? (
              <img
                src={mediaUrl(settings.logoPath, "medium")}
                alt={settings.companyName}
                className={cn(
                  "w-auto shrink-0 object-contain transition-all duration-300",
                  scrolled
                    ? "h-10 max-w-[180px] md:h-12 md:max-w-[220px]"
                    : "h-12 max-w-[210px] md:h-16 md:max-w-[260px]",
                )}
              />
            ) : (
              <span
                className={cn(
                  "font-bold tracking-tight transition-all duration-300",
                  scrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl",
                )}
              >
                {settings.shortName.slice(0, 4)}
                <span className="text-primary">{settings.shortName.slice(4) || ""}</span>
              </span>
            )}
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                activeOptions={{ exact: item.href === "/" }}
                activeProps={{
                  className: "text-primary after:scale-x-100",
                }}
                className={cn(
                  "group relative flex items-center px-3 py-3 text-[14px] font-medium",
                  "text-foreground/70 transition-colors duration-200",
                  "hover:text-primary",
                  "after:absolute after:bottom-1.5 after:left-3 after:right-3",
                  "after:h-0.5 after:origin-center after:scale-x-0",
                  "after:rounded-full after:bg-primary",
                  "after:transition-transform after:duration-200",
                  "hover:after:scale-x-100",
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* More menu */}
            {moreNav.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setMoreOpen(true)}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  onClick={() => setMoreOpen((v) => !v)}
                  className={cn(
                    "group relative flex items-center gap-1 px-3 py-3",
                    "text-[14px] font-medium text-foreground/70",
                    "transition-colors duration-200 hover:text-primary",
                  )}
                >
                  More
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      moreOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={cn(
                      "absolute bottom-1.5 left-3 right-3 h-0.5",
                      "origin-center rounded-full bg-primary",
                      "scale-x-0 transition-transform duration-200",
                      moreOpen && "scale-x-100",
                    )}
                  />
                </button>

                {moreOpen ? (
                  <div className="absolute right-0 top-full w-56 pt-3">
                    <div className="overflow-hidden rounded-xl border border-border/70 bg-popover shadow-lift">
                      <ul className="p-1.5">
                        {moreNav.map((item) => (
                          <li key={item.id}>
                            <Link
                              to={item.href}
                              activeProps={{
                                className: "bg-accent text-primary",
                              }}
                              className={cn(
                                "flex items-center rounded-lg px-3.5 py-2.5",
                                "text-sm font-medium text-foreground/80",
                                "transition-colors duration-150",
                                "hover:bg-accent hover:text-primary",
                              )}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </nav>

          {/* Header actions */}
          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            <Button
              variant="ghost"
              size="iconSm"
              aria-label="Search vehicles"
              onClick={() => setSearchOpen(true)}
              className="transition-colors hover:bg-accent hover:text-primary"
            >
              <Search />
            </Button>

            <Button
              variant="whatsapp"
              size="sm"
              className="hidden rounded-full px-4 shadow-sm transition-all hover:shadow-md sm:inline-flex"
              asChild
            >
              <a href={whatsappLink(waMessages.general)} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
            </Button>

            <Button
              variant="ghost"
              size="iconSm"
              className="rounded-full transition-colors hover:bg-accent hover:text-primary lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </Button>
          </div>
        </div>

        {/* Subtle brand accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={[...primaryNav, ...moreNav]}
        phoneDisplay={settings.phoneDisplay}
        phoneTel={settings.phoneTel}
        logoPath={settings.logoPath}
        companyName={settings.companyName}
        shortName={settings.shortName}
      />

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  items,
  phoneDisplay,
  phoneTel,
  logoPath,
  companyName,
  shortName,
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  phoneDisplay: string;
  phoneTel: string;
  logoPath?: string | null;
  companyName: string;
  shortName: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={cn("fixed inset-0 z-[60] lg:hidden", open ? "visible" : "invisible")}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-ink/60 backdrop-blur-[2px]",
          "transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={cn(
          "absolute inset-y-0 right-0 flex w-[90%] max-w-sm flex-col",
          "border-l border-border/70 bg-background shadow-lift",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer header */}
        <div className="flex min-h-[76px] items-center justify-between border-b border-border/70 px-5">
          <Link
            to="/"
            onClick={onClose}
            aria-label={`${companyName} — home`}
            className="flex min-w-0 items-center"
          >
            {logoPath ? (
              <img
                src={mediaUrl(logoPath, "medium")}
                alt={companyName}
                className="h-11 max-w-[190px] w-auto object-contain"
              />
            ) : (
              <span className="text-xl font-bold tracking-tight">
                {shortName.slice(0, 4)}
                <span className="text-primary">{shortName.slice(4) || ""}</span>
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="iconSm"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-full hover:bg-accent hover:text-primary"
          >
            <X />
          </Button>
        </div>

        {/* Navigation */}
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Menu
          </div>

          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  activeOptions={{ exact: item.href === "/" }}
                  activeProps={{
                    className: "bg-accent text-primary shadow-sm",
                  }}
                  onClick={onClose}
                  className={cn(
                    "flex min-h-12 items-center rounded-xl px-4",
                    "text-[15px] font-medium text-foreground/80",
                    "transition-all duration-150",
                    "hover:bg-accent hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact actions */}
        <div className="space-y-2 border-t border-border/70 bg-muted/20 p-4">
          <Button variant="whatsapp" className="w-full rounded-xl shadow-sm" size="lg" asChild>
            <a href={whatsappLink(waMessages.general)} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="size-[18px]" />
              WhatsApp {phoneDisplay}
            </a>
          </Button>

          <Button variant="outline" className="w-full rounded-xl" asChild>
            <a href={`tel:${phoneTel}`}>
              <Phone className="size-4" />
              Call us
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { WhatsAppIcon };
