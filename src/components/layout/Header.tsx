import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNav, useSettings } from "@/lib/site-context";
import type { NavItem } from "@/lib/content.functions";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { SearchDialog } from "@/components/layout/SearchDialog";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.470 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.42-9.41 2.51 0 4.88.98 6.65 2.76a9.34 9.34 0 0 1 2.76 6.66c0 5.19-4.23 9.41-9.42 9.41zM20.46 3.54A11.75 11.75 0 0 0 12.05 0C5.5 0 .18 5.32.18 11.86c0 2.09.55 4.13 1.59 5.93L.08 24l6.35-1.66a11.83 11.83 0 0 0 5.62 1.43h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.46-8.37z" />
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
      <div className="bg-ink text-ink-foreground">
        <div className="container-page grid min-h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-1.5 text-[12px]">
          <p className="min-w-0 truncate text-ink-foreground/75">
            {settings.announcementEnabled ? settings.announcement : ""}
          </p>
          <a
            href={`tel:${settings.phoneTel}`}
            className="hidden items-center gap-1.5 font-medium hover:underline sm:inline-flex"
          >
            <Phone className="size-3.5" aria-hidden="true" />
            {settings.phoneDisplay}
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-background/98 transition-all duration-150",
          scrolled ? "shadow-header" : "border-transparent",
        )}
      >
        <div
          className={cn(
            "container-page flex items-center justify-between gap-4 transition-all duration-200",
            scrolled ? "h-14 md:h-16" : "h-16 md:h-[76px]",
          )}
        >
          <Link to="/" className="flex min-w-0 items-baseline gap-2" aria-label={`${settings.companyName} — home`}>
            <span className="shrink-0 text-xl font-bold md:text-2xl">
              BESE<span className="text-primary">KI</span>
            </span>
            <span className="hidden text-[10px] font-semibold uppercase text-muted-foreground lg:inline">
              Motor Vehicles
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                activeOptions={{ exact: item.href === "/" }}
                activeProps={{ className: "text-primary" }}
                className="border-b-2 border-transparent px-3 py-2 text-[14px] font-medium text-foreground/75 transition-colors hover:text-primary aria-[current=page]:border-primary"
              >
                {item.label}
              </Link>
            ))}
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
                className="flex items-center gap-1 border-b-2 border-transparent px-3 py-2 text-[14px] font-medium text-foreground/75 transition-colors hover:text-primary"
              >
                More
                <ChevronDown
                  className={cn("size-4 transition-transform", moreOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </button>
              {moreOpen ? (
                <div className="absolute right-0 top-full w-52 pt-2">
                  <ul className="overflow-hidden rounded-md border bg-popover py-1.5 shadow-lift">
                    {moreNav.map((item) => (
                      <li key={item.id}>
                        <Link
                          to={item.href}
                          className="block px-4 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-accent hover:text-primary"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </nav>

          <div className="flex items-center gap-1.5 md:gap-2">
            <Button
              variant="ghost"
              size="iconSm"
              aria-label="Search vehicles"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </Button>
            <Button variant="whatsapp" size="sm" className="hidden sm:inline-flex" asChild>
              <a href={whatsappLink(waMessages.general)} target="_blank" rel="noreferrer">
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
            </Button>
            <Button
              variant="ghost"
              size="iconSm"
              className="lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={[...primaryNav, ...moreNav]}
        phoneDisplay={settings.phoneDisplay}
        phoneTel={settings.phoneTel}
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
}: {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  phoneDisplay: string;
  phoneTel: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={cn("fixed inset-0 z-[60] lg:hidden", open ? "visible" : "invisible")}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col border-l bg-background shadow-lift transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <span className="text-lg font-bold">
            BESE<span className="text-primary">KI</span>
          </span>
          <Button variant="ghost" size="iconSm" aria-label="Close menu" onClick={onClose}>
            <X />
          </Button>
        </div>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  activeOptions={{ exact: item.href === "/" }}
                  activeProps={{ className: "text-primary bg-accent" }}
                  onClick={onClose}
                  className="flex min-h-12 items-center border-b border-border/60 px-3 text-[15px] font-medium transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-2 border-t p-4">
          <Button variant="whatsapp" className="w-full" size="lg" asChild>
            <a href={whatsappLink(waMessages.general)} target="_blank" rel="noreferrer">
              <WhatsAppIcon className="size-[18px]" />
              WhatsApp {phoneDisplay}
            </a>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <a href={`tel:${phoneTel}`}>Call us</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export { WhatsAppIcon };
