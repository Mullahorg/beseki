import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/layout/Header";
import { company } from "@/data/company";
import { waMessages, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface ChatMessage {
  from: "agent" | "you";
  text: string;
}

const quickActions = [
  "Find a vehicle",
  "Book a test drive",
  "Financing",
  "Trade-In",
  "Talk to an agent",
] as const;

export function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 md:bottom-6 md:right-6">
        {!chatOpen ? (
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            aria-label="Open chat"
            className="flex size-10 items-center justify-center rounded-full border bg-background text-foreground shadow-card transition-colors hover:border-foreground/30"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
          </button>
        ) : null}
        <a
          href={whatsappLink(waMessages.general)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Chat with ${company.name} on WhatsApp`}
          className="flex size-13 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-card transition-colors hover:bg-whatsapp/90"
        >
          <WhatsAppIcon className="size-7" />
        </a>
      </div>
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

function ChatWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "agent", text: "Hi 👋 How can we help you today?" },
  ]);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, open]);

  const reply = (text: string) => {
    setMessages((m) => [...m, { from: "you", text }]);
    window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "agent",
          text: "Thanks — this chat isn't staffed yet. For an immediate reply, message our team on WhatsApp at 0721 886656 and someone will help you directly.",
        },
      ]);
    }, 550);
  };

  const handleQuick = (action: (typeof quickActions)[number]) => {
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
      navigate({ to: "/contact", hash: "book" });
      return;
    }
    reply(action);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Chat with BESEKI"
      className={cn(
        "fixed inset-x-3 bottom-3 z-50 flex max-h-[76vh] flex-col overflow-hidden rounded-lg border bg-background shadow-lift sm:inset-x-auto sm:right-4 sm:w-[380px] md:bottom-6 md:right-6",
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b bg-ink px-4 py-3.5 text-ink-foreground">
        <div>
          <p className="text-sm font-semibold">{company.shortName} enquiries</p>
          <p className="text-xs text-ink-foreground/60">Replies come through WhatsApp</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close chat" className="p-1">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-md px-3.5 py-2.5 text-sm leading-relaxed",
              m.from === "agent"
                ? "bg-muted text-foreground"
                : "ml-auto bg-brand-blue text-brand-blue-foreground",
            )}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="border-t px-4 py-3">
        <div className="no-scrollbar -mx-1 mb-3 flex gap-2 overflow-x-auto px-1">
          {quickActions.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => handleQuick(a)}
              className="shrink-0 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
            >
              {a}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            reply(draft.trim());
            setDraft("");
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message"
            aria-label="Message"
            className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:border-ring"
          />
          <Button type="submit" size="iconSm" aria-label="Send message">
            <Send />
          </Button>
        </form>
        <a
          href={whatsappLink(waMessages.general)}
          target="_blank"
          rel="noreferrer"
          className="mt-2.5 block text-center text-xs font-medium text-whatsapp hover:underline"
        >
          Continue on WhatsApp instead
        </a>
      </div>
    </div>
  );
}
