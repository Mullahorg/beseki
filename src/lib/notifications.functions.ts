import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Alerting for the BESEKI team.
 *
 * Email goes out through Resend and instant alerts go to Telegram. Both sets
 * of credentials are stored in the database and managed by a Super Admin from
 * the admin workspace, so nothing has to be changed in code.
 */

type Settings = {
  resend_api_key: string;
  resend_from: string;
  lead_recipients: string[];
  report_recipients: string[];
  telegram_bot_token: string;
  telegram_chat_id: string;
  email_enabled: boolean;
  telegram_enabled: boolean;
  alert_on_lead: boolean;
  alert_on_failure: boolean;
};

type Admin = Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"];

async function admin(): Promise<Admin> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function loadSettings(db: Admin): Promise<Settings | null> {
  const { data, error } = await db
    .from("notification_settings")
    .select(
      "resend_api_key,resend_from,lead_recipients,report_recipients,telegram_bot_token,telegram_chat_id,email_enabled,telegram_enabled,alert_on_lead,alert_on_failure",
    )
    .eq("id", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as unknown as Settings;
}

async function log(
  db: Admin,
  row: { channel: string; kind: string; target?: string | null; status: string; detail?: string | null },
) {
  try {
    await db.from("notification_log").insert({
      channel: row.channel,
      kind: row.kind,
      target: row.target ?? null,
      status: row.status,
      detail: row.detail ? row.detail.slice(0, 500) : null,
    } as never);
  } catch {
    /* logging must never break an alert */
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendEmail(
  db: Admin,
  s: Settings,
  kind: string,
  to: string[],
  subject: string,
  lines: string[],
): Promise<boolean> {
  const recipients = to.map((t) => t.trim()).filter((t) => t.includes("@"));
  if (!s.email_enabled || !s.resend_api_key || !s.resend_from || recipients.length === 0) return false;

  const html = `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#111">
    <h2 style="margin:0 0 12px">${escapeHtml(subject)}</h2>
    ${lines.map((l) => `<p style="margin:4px 0">${escapeHtml(l)}</p>`).join("")}
    <p style="margin-top:18px;color:#666;font-size:12px">Sent automatically by the BESEKI website.</p>
  </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${s.resend_api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: s.resend_from, to: recipients, subject, html }),
    });
    const ok = res.ok;
    await log(db, {
      channel: "email",
      kind,
      target: recipients.join(", "),
      status: ok ? "sent" : "failed",
      detail: ok ? null : `${res.status} ${await res.text().catch(() => "")}`,
    });
    return ok;
  } catch (err) {
    await log(db, {
      channel: "email",
      kind,
      target: recipients.join(", "),
      status: "failed",
      detail: err instanceof Error ? err.message : "Unknown error",
    });
    return false;
  }
}

async function sendTelegram(db: Admin, s: Settings, kind: string, text: string): Promise<boolean> {
  if (!s.telegram_enabled || !s.telegram_bot_token || !s.telegram_chat_id) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${s.telegram_bot_token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: s.telegram_chat_id,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const ok = res.ok;
    await log(db, {
      channel: "telegram",
      kind,
      target: s.telegram_chat_id,
      status: ok ? "sent" : "failed",
      detail: ok ? null : `${res.status} ${await res.text().catch(() => "")}`,
    });
    return ok;
  } catch (err) {
    await log(db, {
      channel: "telegram",
      kind,
      target: s.telegram_chat_id,
      status: "failed",
      detail: err instanceof Error ? err.message : "Unknown error",
    });
    return false;
  }
}

/** True when an alert of this kind was already sent in the last few minutes. */
async function recentlyAlerted(db: Admin, kind: string, minutes: number): Promise<boolean> {
  try {
    const since = new Date(Date.now() - minutes * 60_000).toISOString();
    const { count } = await db
      .from("notification_log")
      .select("id", { count: "exact", head: true })
      .eq("kind", kind)
      .gte("created_at", since);
    return (count ?? 0) > 0;
  } catch {
    return false;
  }
}

/** Alert the sales team that a customer enquiry just came in. */
export const notifyNewLead = createServerFn({ method: "POST" })
  .inputValidator((input: {
    type: string;
    name: string;
    phone: string;
    email?: string | null;
    vehicle?: string | null;
    source?: string | null;
    message?: string | null;
  }) => input)
  .handler(async ({ data }) => {
    try {
      const db = await admin();
      const s = await loadSettings(db);
      if (!s || !s.alert_on_lead) return { ok: false };

      const label = data.type.replace(/[-_]/g, " ");
      const lines = [
        `Type: ${label}`,
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        data.email ? `Email: ${data.email}` : "",
        data.vehicle ? `Vehicle: ${data.vehicle.replace(/-/g, " ")}` : "",
        data.source ? `Page: ${data.source}` : "",
        data.message ? `Message: ${data.message}` : "",
      ].filter(Boolean);

      const emailed = await sendEmail(
        db,
        s,
        "lead",
        s.lead_recipients,
        `New ${label} enquiry from ${data.name}`,
        lines,
      );
      const messaged = await sendTelegram(
        db,
        s,
        "lead",
        `🚗 <b>New ${escapeHtml(label)} enquiry</b>\n${lines.map(escapeHtml).join("\n")}`,
      );

      return { ok: emailed || messaged };
    } catch {
      return { ok: false };
    }
  });

/** Alert the Super Admin on Telegram (and email) when the site hits a failure. */
export const reportFailure = createServerFn({ method: "POST" })
  .inputValidator((input: { message: string; path?: string | null; detail?: string | null }) => input)
  .handler(async ({ data }) => {
    try {
      const db = await admin();
      const s = await loadSettings(db);
      if (!s || !s.alert_on_failure) return { ok: false };

      // Never flood the chat: one failure alert every 10 minutes.
      if (await recentlyAlerted(db, "failure", 10)) return { ok: false, throttled: true };

      const message = data.message.slice(0, 300);
      const lines = [
        `Problem: ${message}`,
        data.path ? `Page: ${data.path}` : "",
        data.detail ? `Details: ${data.detail.slice(0, 500)}` : "",
        `Time: ${new Date().toISOString()}`,
      ].filter(Boolean);

      const messaged = await sendTelegram(
        db,
        s,
        "failure",
        `🚨 <b>BESEKI website problem</b>\n${lines.map(escapeHtml).join("\n")}`,
      );
      const emailed = await sendEmail(
        db,
        s,
        "failure",
        s.report_recipients,
        "BESEKI website problem detected",
        lines,
      );

      return { ok: messaged || emailed };
    } catch {
      return { ok: false };
    }
  });

/** Super Admin only: send a test alert on both channels. */
export const sendTestAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { channel: "email" | "telegram" }) => input)
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase.rpc("get_my_staff_role");
    if (role !== "super_admin") throw new Error("Only a Super Admin can send test alerts");

    const db = await admin();
    const s = await loadSettings(db);
    if (!s) throw new Error("Alert settings are not available");

    if (data.channel === "email") {
      const to = s.report_recipients.length > 0 ? s.report_recipients : s.lead_recipients;
      if (!s.email_enabled) throw new Error("Email alerts are switched off");
      if (!s.resend_api_key) throw new Error("Add your Resend key first");
      if (!s.resend_from) throw new Error("Add the sender address first");
      if (to.length === 0) throw new Error("Add at least one recipient first");
      const ok = await sendEmail(db, s, "test", to, "BESEKI test alert", [
        "This is a test alert from your BESEKI workspace.",
        "If you can read this, email alerts are working.",
      ]);
      if (!ok) throw new Error("Resend did not accept the message. Check the key and sender address.");
      return { ok: true };
    }

    if (!s.telegram_enabled) throw new Error("Telegram alerts are switched off");
    if (!s.telegram_bot_token || !s.telegram_chat_id) throw new Error("Add the bot token and chat ID first");
    const ok = await sendTelegram(db, s, "test", "✅ <b>BESEKI test alert</b>\nTelegram alerts are working.");
    if (!ok) throw new Error("Telegram did not accept the message. Check the bot token and chat ID.");
    return { ok: true };
  });
