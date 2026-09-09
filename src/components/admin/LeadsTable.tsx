import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle, Phone, Mail } from "lucide-react";
import { AdminHeader, AdminCard } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading, StatusPill } from "@/components/admin/AdminBits";
import { SelectInput, TextArea } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const leadStatuses = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;

export const leadTypeLabels: Record<string, string> = {
  "test-drive": "Test drive",
  financing: "Financing",
  "trade-in": "Trade-in",
  contact: "Contact",
  enquiry: "Enquiry",
  reserve: "Reservation",
  import: "Import request",
};

function waLink(phone: string, name: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(`Hello ${name}, this is BESEKI Motors following up on your enquiry.`)}`;
}

export function LeadsTable({
  title,
  description,
  type,
}: {
  title: string;
  description: string;
  type?: string | string[];
}) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const key = ["admin", "leads", type ?? "all", status];

  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      let q = supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(300);
      if (Array.isArray(type)) q = q.in("type", type);
      else if (type) q = q.eq("type", type);
      if (status !== "all") q = q.eq("status", status);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("enquiries").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lead updated");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: Error) => toast.error("Could not update", { description: e.message }),
  });

  return (
    <>
      <AdminHeader
        title={title}
        description={description}
        action={
          <div className="w-44">
            <SelectInput value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
              <option value="all">All statuses</option>
              {leadStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectInput>
          </div>
        }
      />

      {list.isLoading ? <AdminLoading /> : null}
      {list.isError ? <AdminError /> : null}
      {list.data?.length === 0 ? (
        <AdminEmpty title="Nothing here yet" message="New enquiries from the website will show up on this page." />
      ) : null}

      <div className="space-y-3">
        {list.data?.map((lead) => {
          const open = openId === lead.id;
          const details = (lead.details ?? {}) as Record<string, unknown>;
          return (
            <AdminCard key={lead.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold">{lead.name}</h3>
                    <StatusPill status={lead.status} />
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                      {leadTypeLabels[lead.type] ?? lead.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(lead.created_at).toLocaleString("en-KE")}
                    {lead.vehicle_slug ? ` • ${lead.vehicle_slug}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <a href={`tel:${lead.phone}`} aria-label="Call" className="rounded p-2 hover:bg-accent">
                    <Phone className="size-4" />
                  </a>
                  <a
                    href={waLink(lead.phone, lead.name)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="rounded p-2 hover:bg-accent"
                  >
                    <MessageCircle className="size-4" />
                  </a>
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`} aria-label="Email" className="rounded p-2 hover:bg-accent">
                      <Mail className="size-4" />
                    </a>
                  ) : null}
                  <Button variant="outline" size="sm" onClick={() => setOpenId(open ? null : lead.id)}>
                    {open ? "Close" : "Manage"}
                  </Button>
                </div>
              </div>

              {lead.message ? <p className="mt-3 text-sm">{lead.message}</p> : null}

              {open ? (
                <div className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-2">
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Phone:</span> {lead.phone}
                    </p>
                    {lead.email ? (
                      <p>
                        <span className="text-muted-foreground">Email:</span> {lead.email}
                      </p>
                    ) : null}
                    {lead.preferred_at ? (
                      <p>
                        <span className="text-muted-foreground">Preferred time:</span>{" "}
                        {new Date(lead.preferred_at).toLocaleString("en-KE")}
                      </p>
                    ) : null}
                    {Object.entries(details).map(([k, v]) => (
                      <p key={k}>
                        <span className="text-muted-foreground">{k.replace(/_/g, " ")}:</span> {String(v)}
                      </p>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <SelectInput
                      aria-label="Status"
                      value={lead.status}
                      onChange={(e) => update.mutate({ id: lead.id, patch: { status: e.target.value } })}
                    >
                      {leadStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </SelectInput>
                    <TextArea
                      aria-label="Internal notes"
                      defaultValue={lead.notes ?? ""}
                      placeholder="Internal notes (not visible to the customer)"
                      onBlur={(e) => {
                        if (e.target.value !== (lead.notes ?? "")) {
                          update.mutate({ id: lead.id, patch: { notes: e.target.value } });
                        }
                      }}
                    />
                  </div>
                </div>
              ) : null}
            </AdminCard>
          );
        })}
      </div>
    </>
  );
}
