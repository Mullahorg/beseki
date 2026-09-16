import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bell, Loader2, Mail, Save, Send, Shield } from "lucide-react";
import { toast } from "sonner";

import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { AdminError, AdminLoading } from "@/components/admin/AdminBits";
import { RoleGate } from "@/components/admin/RoleGate";
import { Field, TextInput } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { sendTestAlert } from "@/lib/notifications.functions";

export const Route = createFileRoute("/_authenticated/admin/notifications")({
  component: NotificationsPage,
});

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

type LogRow = {
  id: string;
  channel: string;
  kind: string;
  target: string | null;
  status: string;
  detail: string | null;
  created_at: string;
};

const EMPTY: Settings = {
  resend_api_key: "",
  resend_from: "",
  lead_recipients: [],
  report_recipients: [],
  telegram_bot_token: "",
  telegram_chat_id: "",
  email_enabled: false,
  telegram_enabled: false,
  alert_on_lead: true,
  alert_on_failure: true,
};

const COLUMNS =
  "resend_api_key,resend_from,lead_recipients,report_recipients,telegram_bot_token,telegram_chat_id,email_enabled,telegram_enabled,alert_on_lead,alert_on_failure";

const table = () =>
  supabase.from("notification_settings") as never as {
    select: (c: string) => {
      eq: (c: string, v: boolean) => {
        maybeSingle: () => Promise<{ data: Settings | null; error: { message: string } | null }>;
      };
    };
    update: (v: Partial<Settings>) => {
      eq: (c: string, v: boolean) => Promise<{ error: { message: string } | null }>;
    };
  };

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-admin-line bg-admin-surface p-4 transition-colors hover:border-admin-focus/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 accent-[hsl(var(--primary))]"
      />
      <span>
        <span className="block text-sm font-semibold text-admin-foreground">{label}</span>
        <span className="mt-0.5 block text-xs text-admin-muted">{hint}</span>
      </span>
    </label>
  );
}

function when(iso: string) {
  return new Date(iso).toLocaleString("en-KE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NotificationsPage() {
  const qc = useQueryClient();
  const testAlert = useServerFn(sendTestAlert);

  const [form, setForm] = useState<Settings>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<"email" | "telegram" | null>(null);

  const settingsQuery = useQuery({
    queryKey: ["admin", "notification-settings"],
    retry: 1,
    queryFn: async (): Promise<Settings> => {
      const { data, error } = await table().select(COLUMNS).eq("id", true).maybeSingle();
      if (error) throw new Error(error.message);
      return { ...EMPTY, ...(data ?? {}) };
    },
  });

  const logQuery = useQuery({
    queryKey: ["admin", "notification-log"],
    retry: 1,
    queryFn: async (): Promise<LogRow[]> => {
      const { data, error } = await (supabase.from("notification_log") as never as {
        select: (c: string) => {
          order: (c: string, o: { ascending: boolean }) => {
            limit: (n: number) => Promise<{ data: LogRow[] | null; error: { message: string } | null }>;
          };
        };
      })
        .select("id,channel,kind,target,status,detail,created_at")
        .order("created_at", { ascending: false })
        .limit(25);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  useEffect(() => {
    if (settingsQuery.data) setForm(settingsQuery.data);
  }, [settingsQuery.data]);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const listValue = (list: string[]) => list.join(", ");
  const parseList = (value: string) =>
    value
      .split(/[,\n;]/)
      .map((v) => v.trim())
      .filter(Boolean);

  async function save() {
    setSaving(true);
    try {
      const { error } = await table().update(form).eq("id", true);
      if (error) throw new Error(error.message);
      toast.success("Alert settings saved");
      await qc.invalidateQueries({ queryKey: ["admin", "notification-settings"] });
    } catch (err) {
      toast.error("Could not save alert settings", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function test(channel: "email" | "telegram") {
    setTesting(channel);
    try {
      await testAlert({ data: { channel } });
      toast.success(channel === "email" ? "Test email sent" : "Test message sent to Telegram");
      await qc.invalidateQueries({ queryKey: ["admin", "notification-log"] });
    } catch (err) {
      toast.error("Test alert failed", {
        description: err instanceof Error ? err.message : "Please check the details and try again.",
      });
    } finally {
      setTesting(null);
    }
  }

  return (
    <RoleGate allow={["super_admin"]}>
      <AdminHeader
        title="Alerts & notifications"
        description="Send enquiry alerts by email and get instant Telegram messages when something goes wrong."
        action={
          <Button onClick={() => void save()} disabled={saving || settingsQuery.isLoading}>
            {saving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="size-4" aria-hidden="true" />
            )}
            Save changes
          </Button>
        }
      />

      {settingsQuery.isLoading ? (
        <AdminLoading rows={5} />
      ) : settingsQuery.isError ? (
        <AdminError message="We could not load your alert settings. Only a Super Admin can open this page." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Toggle
              label="Email alerts"
              hint="Send alerts through Resend to the addresses below."
              checked={form.email_enabled}
              onChange={(v) => set("email_enabled", v)}
            />
            <Toggle
              label="Telegram alerts"
              hint="Send instant messages to your Telegram chat."
              checked={form.telegram_enabled}
              onChange={(v) => set("telegram_enabled", v)}
            />
            <Toggle
              label="Alert on new enquiries"
              hint="Notify the team the moment a customer sends a form."
              checked={form.alert_on_lead}
              onChange={(v) => set("alert_on_lead", v)}
            />
            <Toggle
              label="Alert on website problems"
              hint="Warn you about errors that could take the site down."
              checked={form.alert_on_failure}
              onChange={(v) => set("alert_on_failure", v)}
            />
          </div>

          <AdminCard className="mt-6">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-primary" aria-hidden="true" />
              <h2 className="text-base font-semibold">Email (Resend)</h2>
            </div>
            <p className="mt-1 text-sm text-admin-muted">
              Create an API key at resend.com, verify your sending domain there, then paste the key
              below. It is stored securely and only Super Admins can see this page.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Resend API key" htmlFor="resend-key">
                <TextInput
                  id="resend-key"
                  type="password"
                  autoComplete="off"
                  placeholder="re_..."
                  value={form.resend_api_key}
                  onChange={(e) => set("resend_api_key", e.target.value)}
                />
              </Field>
              <Field label="Sender address" htmlFor="resend-from" hint="Must use a domain verified in Resend.">
                <TextInput
                  id="resend-from"
                  placeholder="BESEKI Alerts <alerts@yourdomain.com>"
                  value={form.resend_from}
                  onChange={(e) => set("resend_from", e.target.value)}
                />
              </Field>
              <Field
                label="Enquiry alerts go to"
                htmlFor="lead-recipients"
                hint="Sales and admin addresses, separated by commas."
              >
                <TextInput
                  id="lead-recipients"
                  placeholder="sales@beseki.co.ke, manager@beseki.co.ke"
                  value={listValue(form.lead_recipients)}
                  onChange={(e) => set("lead_recipients", parseList(e.target.value))}
                />
              </Field>
              <Field
                label="Problem reports go to"
                htmlFor="report-recipients"
                hint="Usually the Super Admins only."
              >
                <TextInput
                  id="report-recipients"
                  placeholder="owner@beseki.co.ke"
                  value={listValue(form.report_recipients)}
                  onChange={(e) => set("report_recipients", parseList(e.target.value))}
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void test("email")} disabled={testing !== null}>
                {testing === "email" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="size-4" aria-hidden="true" />
                )}
                Send test email
              </Button>
              <span className="self-center text-xs text-admin-muted">Save your changes before testing.</span>
            </div>
          </AdminCard>

          <AdminCard className="mt-6">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-primary" aria-hidden="true" />
              <h2 className="text-base font-semibold">Telegram</h2>
            </div>
            <p className="mt-1 text-sm text-admin-muted">
              Message @BotFather on Telegram to create a bot and copy its token. Then send your bot a
              message and paste your chat ID below — failures are reported there within seconds.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Bot token" htmlFor="tg-token">
                <TextInput
                  id="tg-token"
                  type="password"
                  autoComplete="off"
                  placeholder="123456:ABC-DEF..."
                  value={form.telegram_bot_token}
                  onChange={(e) => set("telegram_bot_token", e.target.value)}
                />
              </Field>
              <Field label="Chat ID" htmlFor="tg-chat" hint="Your personal chat, or a group the bot is in.">
                <TextInput
                  id="tg-chat"
                  placeholder="-1001234567890"
                  value={form.telegram_chat_id}
                  onChange={(e) => set("telegram_chat_id", e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void test("telegram")} disabled={testing !== null}>
                {testing === "telegram" ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="size-4" aria-hidden="true" />
                )}
                Send test message
              </Button>
              <span className="self-center text-xs text-admin-muted">Save your changes before testing.</span>
            </div>
          </AdminCard>

          <AdminCard className="mt-6">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-primary" aria-hidden="true" />
              <h2 className="text-base font-semibold">Recent alerts</h2>
            </div>

            {logQuery.isLoading ? (
              <div className="mt-5">
                <AdminLoading rows={3} />
              </div>
            ) : logQuery.isError ? (
              <div className="mt-5">
                <AdminError message="We could not load the alert history." />
              </div>
            ) : (logQuery.data?.length ?? 0) === 0 ? (
              <p className="mt-4 text-sm text-admin-muted">Nothing sent yet.</p>
            ) : (
              <ul className="mt-5 space-y-2">
                {logQuery.data?.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-col gap-1 rounded-md border border-admin-line bg-admin-surface px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="min-w-0 text-admin-foreground">
                      <span className="font-medium capitalize">{row.channel}</span>{" "}
                      <span className="capitalize text-admin-muted">{row.kind}</span>
                      {row.target ? <span className="text-admin-muted"> · {row.target}</span> : null}
                      {row.detail ? (
                        <span className="block truncate text-xs text-admin-muted">{row.detail}</span>
                      ) : null}
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span
                        className={
                          row.status === "sent"
                            ? "rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400"
                            : "rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-medium text-destructive"
                        }
                      >
                        {row.status}
                      </span>
                      <span className="text-xs text-admin-muted">{when(row.created_at)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </>
      )}
    </RoleGate>
  );
}
