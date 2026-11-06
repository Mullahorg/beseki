import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle, Phone, Mail } from "lucide-react";
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
  appointment: "appointment",
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
      const { error } = await (supabase.from("enquiries") as any).update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lead updated");
      qc.invalidateQueries({ queryKey: ["admin"] });
    },
    onError: (e: Error) => toast.error("Could not update", { description: e.message }),
  });

  return (
    <div className="w-full text-gray-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold mb-1 text-white">{title}</h1>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className="w-full sm:w-44">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
            className="w-full bg-[#131313] border border-[#2a2a2a] rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#4a4a4a]"
          >
            <option value="all">All statuses</option>
            {leadStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading / Error / Empty States */}
      {list.isLoading ? <div className="text-sm text-gray-400">Loading...</div> : null}
      {list.isError ? <div className="text-sm text-red-400">Error loading leads</div> : null}
      {list.data?.length === 0 ? (
        <div className="text-center py-10 border border-[#2a2a2a] rounded-lg bg-[#131313]">
          <h3 className="text-lg font-medium text-white mb-2">Nothing here yet</h3>
          <p className="text-sm text-gray-400">New enquiries from the website will show up on this page.</p>
        </div>
      ) : null}

      {/* Leads List */}
      <div className="space-y-4">
        {list.data?.map((lead) => {
          const open = openId === lead.id;
          const details = (lead.details ?? {}) as Record<string, unknown>;
          
          // --- NEW FORMATTING LOGIC ---
          // Removes all full stops from the email
          const displayEmail = lead.email ? lead.email.replace(/\./g, "") : "";
          // Ensures the phone number has a country code prefix (+)
          const displayPhone = lead.phone 
            ? (lead.phone.startsWith('+') ? lead.phone : `+${lead.phone}`) 
            : "";

          return (
            <div key={lead.id} className="bg-[#131313] border border-[#2a2a2a] rounded-lg overflow-hidden">
              {/* Card Header */}
              <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-3 mb-1.5">
                    <h2 className="text-lg font-bold tracking-tight text-white truncate">
                      {lead.name || lead.id}
                    </h2>
                    <span className="text-xs font-medium px-2 py-0.5 bg-[#222] text-gray-300 rounded whitespace-nowrap">
                      {lead.status}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 bg-[#222] text-gray-300 rounded whitespace-nowrap">
                      {leadTypeLabels[lead.type] ?? lead.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-1">
                    {new Date(lead.created_at).toLocaleString("en-KE")}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {lead.vehicle_slug || displayEmail || displayPhone || lead.id}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${lead.phone}`}
                    aria-label="Call"
                    className="p-2 text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded border border-[#2a2a2a] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={waLink(lead.phone, lead.name)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="p-2 text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded border border-[#2a2a2a] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  {lead.email ? (
                    <a
                      href={`mailto:${lead.email}`}
                      aria-label="Email"
                      className="p-2 text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded border border-[#2a2a2a] transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  ) : null}
                  <button
                    onClick={() => setOpenId(open ? null : lead.id)}
                    className="px-4 py-2 ml-2 text-sm font-medium text-white bg-[#1a1a1a] border border-[#3a3a3a] rounded hover:bg-[#2a2a2a] transition-colors"
                  >
                    {open ? "Close" : "Manage"}
                  </button>
                </div>
              </div>

              {lead.message ? <p className="px-5 pb-4 text-sm text-gray-300">{lead.message}</p> : null}

              {/* Card Body (Expanded) */}
              {open ? (
                <div className="border-t border-[#2a2a2a] p-5 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Details */}
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-4">
                        <span className="text-gray-500 w-32 shrink-0">Phone:</span>
                        <span className="text-gray-300">{displayPhone}</span>
                      </div>
                      {lead.email && (
                        <div className="flex gap-4">
                          <span className="text-gray-500 w-32 shrink-0">Email:</span>
                          {/* break-all ensures the email is shown in full without truncating if it's very long */}
                          <span className="text-gray-300 break-all">{displayEmail}</span>
                        </div>
                      )}
                      {lead.preferred_at && (
                        <div className="flex gap-4">
                          <span className="text-gray-500 w-32 shrink-0">Preferred time:</span>
                          <span className="text-gray-300">
                            {new Date(lead.preferred_at).toLocaleString("en-KE")}
                          </span>
                        </div>
                      )}
                      {Object.entries(details).map(([k, v]) => (
                        <div key={k} className="flex gap-4">
                          <span className="text-gray-500 w-32 shrink-0 capitalize">
                            {k.replace(/_/g, " ")}:
                          </span>
                          <span className="text-gray-300">{String(v)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Right Column - Inputs */}
                    <div className="space-y-3">
                      <select
                        aria-label="Status"
                        value={lead.status}
                        onChange={(e) => update.mutate({ id: lead.id, patch: { status: e.target.value } })}
                        className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#4a4a4a] transition-colors"
                      >
                        {leadStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <textarea
                        aria-label="Internal notes"
                        defaultValue={lead.notes ?? ""}
                        placeholder="Internal notes (not visible to the customer)"
                        className="w-full h-[120px] bg-[#0a0a0a] border border-[#2a2a2a] rounded-md px-3 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#4a4a4a] transition-colors resize-none"
                        onBlur={(e) => {
                          if (e.target.value !== (lead.notes ?? "")) {
                            update.mutate({ id: lead.id, patch: { notes: e.target.value } });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
