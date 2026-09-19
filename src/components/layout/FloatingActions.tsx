import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CarFront,
  CircleDollarSign,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/Header";
import { useSettings } from "@/lib/site-context";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface ChatMessage {
  from: "agent" | "you";
  text: string;
}

const quickActions = [
  {
    label: "Find a vehicle",
    icon: CarFront,
  },
  {
    label: "Book a test drive",
    icon: MessageCircle,
  },
  {
    label: "Financing",
    icon: CircleDollarSign,
  },
  {
    label: "Trade-In",
    icon: ArrowRight,
  },
  {
    label: "Talk to an agent",
    icon: MessageCircle,
  },
] as const;

export function FloatingActions() {
  const settings = useSettings();
  const [chatOpen, setChatOpen] = useState(false);

  const whatsappHref = whatsappLink(waMessages.general);

  return (
    <>
      {/* Floating action buttons */}
      <div
        className={cn(
          "fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3",
          "sm:bottom-5 sm:right-5",
          "md:bottom-6 md:right-6",
        )}
      >
        {/* Chat button */}
        {!chatOpen && (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            aria-label="Open BESEKI chat"
            className={cn(
              "group relative flex size-12 items-center justify-center rounded-full",
              "border border-border/80 bg-background/95 text-foreground",
              "shadow-[0_8px_30px_rgba(0,0,0,0.14)] backdrop-blur-md",
              "transition-all duration-300",
              "hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl",
              "active:translate-y-0",
            )}
          >
            <MessageCircle
              className="size-5 transition-transform duration-300 group-hover:scale-110"
              aria-hidden="true"
            />

            {/* Online indicator */}
            <span
              className="absolute right-0.5 top-0.5 size-3 rounded-full border-2 border-background bg-emerald-500"
              aria-label="Available"
            />
          </button>
        )}

        {/* WhatsApp */}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`Chat with ${settings.companyName || "BESEKI"} on WhatsApp`}
            className={cn(
              "group relative flex size-14 items-center justify-center rounded-full",
              "bg-whatsapp text-primary-foreground",
              "shadow-[0_10px_30px_rgba(37,211,102,0.28)]",
              "transition-all duration-300",
              "hover:-translate-y-1 hover:bg-whatsapp/90 hover:shadow-[0_14px_35px_rgba(37,211,102,0.38)]",
              "active:translate-y-0",
            )}
          >
            <WhatsAppIcon className="size-7 transition-transform duration-300 group-hover:scale-110" />

            <span className="pointer-events-none absolute -left-2 top-1/2 hidden -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block">
              WhatsApp us
            </span>
          </a>
        )}
      </div>

      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

function ChatWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settings = useSettings();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "agent",
      text: "Hi 👋 Welcome to BESEKI. How can we help you today?",
    },
  ]);

  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, typing, open]);

  const reply = (text: string) => {
    if (!text.trim()) return;

    setMessages((m) => [
      ...m,
      {
        from: "you",
        text: text.trim(),
      },
    ]);

    setTyping(true);

    window.setTimeout(() => {
      setTyping(false);

      setMessages((m) => [
        ...m,
        {
          from: "agent",
          text: `Thanks for reaching out. Our live chat is not staffed yet. For an immediate response, message our team on WhatsApp at ${settings.phoneDisplay || settings.phoneTel || "our official WhatsApp number"}.`,
        },
      ]);
    }, 700);
  };

  const handleQuick = (action: (typeof quickActions)[number]["label"]) => {
    if (action === "Find a vehicle") {
      onClose();
      navigate({ to: "/inventory" });
      return;
    }

    if (action === "Financing") {
      onClose();
      navigate({ to: "/financing" });
      return;
    }

    if (action === "Trade-In") {
      onClose();
      navigate({ to: "/trade-in" });
      return;
    }

    if (action === "Book a test drive") {
      onClose();
      navigate({
        to: "/contact",
        hash: "book",
      });
      return;
    }

    reply(action);
  };

  if (!open) return null;

  const whatsappHref = whatsappLink(waMessages.general);

  return (
    <div
      role="dialog"
      aria-label="Chat with BESEKI"
      aria-modal="false"
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden",
        "inset-x-3 bottom-3",
        "max-h-[78vh]",
        "rounded-2xl border border-border/80",
        "bg-background/98 shadow-[0_24px_80px_rgba(0,0,0,0.22)]",
        "backdrop-blur-xl",
        "sm:inset-x-auto sm:right-5 sm:w-[390px]",
        "md:bottom-6 md:right-6",
      )}
    >
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-ink px-4 py-4 text-ink-foreground">
        {/* Decorative gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-20 size-40 rounded-full bg-red-700/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 bottom-[-70px] size-40 rounded-full bg-blue-700/15 blur-3xl"
        />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-red-900 shadow-lg">
              <CarFront className="size-5 text-white" />

              <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-ink bg-emerald-500" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {settings.shortName || "BESEKI"} Assistant
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <p className="text-[11px] text-ink-foreground/55">Here to help with your enquiry</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              "text-ink-foreground/55",
              "transition-colors hover:bg-white/10 hover:text-white",
            )}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className={cn(
          "min-h-0 flex-1 space-y-4 overflow-y-auto",
          "bg-gradient-to-b from-background to-muted/20",
          "px-4 py-5",
        )}
      >
        {/* Welcome trust message */}
        {messages.length === 1 && (
          <div className="mb-5 rounded-xl border border-primary/10 bg-primary/[0.035] p-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />

              <p className="text-[11px] leading-5 text-muted-foreground">
                Ask us about vehicles, test drives, trade-ins, financing, or anything else you need
                help with.
              </p>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={`${m.from}-${i}`}
            className={cn("flex", m.from === "you" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "relative max-w-[88%] px-3.5 py-3 text-sm leading-6",
                m.from === "agent"
                  ? "rounded-2xl rounded-tl-md border border-border/60 bg-card text-foreground shadow-sm"
                  : "rounded-2xl rounded-tr-md bg-brand-blue text-brand-blue-foreground shadow-sm",
              )}
            >
              {m.from === "agent" && (
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="size-3 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    BESEKI
                  </span>
                </div>
              )}

              {m.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-md border border-border/60 bg-card px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Bottom controls */}
      <div className="border-t border-border/70 bg-background px-3.5 pb-3.5 pt-3">
        {/* Quick actions */}
        <div className="no-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.label}
                type="button"
                onClick={() => handleQuick(action.label)}
                className={cn(
                  "group flex shrink-0 items-center gap-1.5 rounded-full",
                  "border border-border bg-background px-3 py-2",
                  "text-[11px] font-semibold text-muted-foreground",
                  "transition-all duration-200",
                  "hover:border-primary/40 hover:bg-primary/[0.04] hover:text-primary",
                )}
              >
                <Icon className="size-3.5 transition-transform group-hover:scale-110" />
                {action.label}
              </button>
            );
          })}
        </div>

        {/* Message form */}
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();

            const message = draft.trim();

            if (!message || typing) return;

            reply(message);
            setDraft("");
          }}
        >
          <div className="relative flex-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask us anything..."
              aria-label="Message"
              disabled={typing}
              className={cn(
                "h-11 w-full rounded-xl border border-border",
                "bg-muted/30 px-3.5 pr-3",
                "text-sm text-foreground placeholder:text-muted-foreground/60",
                "outline-none transition-all",
                "focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/10",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            />
          </div>

          <Button
            type="submit"
            size="iconSm"
            aria-label="Send message"
            disabled={!draft.trim() || typing}
            className={cn(
              "size-11 shrink-0 rounded-xl",
              "bg-brand-blue text-brand-blue-foreground",
              "shadow-sm transition-all",
              "hover:-translate-y-0.5 hover:shadow-md",
              "disabled:translate-y-0 disabled:opacity-40",
            )}
          >
            <Send className="size-4" />
          </Button>
        </form>

        {/* WhatsApp handoff */}
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "group mt-3 flex items-center justify-center gap-2",
              "rounded-xl border border-whatsapp/20",
              "bg-whatsapp/[0.07] px-3 py-2.5",
              "text-xs font-bold text-whatsapp",
              "transition-all duration-200",
              "hover:border-whatsapp/30 hover:bg-whatsapp/[0.12]",
            )}
          >
            <WhatsAppIcon className="size-4" />

            <span>Prefer a direct response? WhatsApp us</span>

            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        )}

        <p className="mt-2 text-center text-[9px] text-muted-foreground/50">
          BESEKI COMPANY LIMITED · Mombasa
        </p>
      </div>
    </div>
  );
}
