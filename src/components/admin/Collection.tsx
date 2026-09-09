import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, TextInput, TextArea, SelectInput } from "@/components/forms/FormKit";
import { AdminCard, AdminHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading, Saving, StatusPill } from "@/components/admin/AdminBits";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { supabase } from "@/integrations/supabase/client";

export type FieldType = "text" | "textarea" | "number" | "select" | "status" | "media" | "list" | "date";

export interface FieldSpec {
  name: string;
  label: string;
  type?: FieldType;
  options?: string[];
  hint?: string;
  required?: boolean;
  placeholder?: string;
}

export interface CollectionSpec {
  table: string;
  title: string;
  description: string;
  singular: string;
  orderBy?: { column: string; ascending?: boolean };
  columns: { name: string; label: string }[];
  fields: FieldSpec[];
  defaults?: Record<string, unknown>;
  /** Rows with this flag set cannot be deleted. */
  protectedFlag?: string;
}

type Row = Record<string, any>;

const emptyFor = (spec: CollectionSpec): Row => {
  const base: Row = { ...(spec.defaults ?? {}) };
  for (const f of spec.fields) {
    if (base[f.name] !== undefined) continue;
    base[f.name] = f.type === "number" ? 0 : f.type === "list" ? [] : "";
  }
  return base;
};

export function CollectionAdmin({ spec }: { spec: CollectionSpec }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const key = ["admin", spec.table];

  const list = useQuery({
    queryKey: key,
    queryFn: async () => {
      const order = spec.orderBy ?? { column: "created_at", ascending: false };
      const { data, error } = await supabase
        .from(spec.table)
        .select("*")
        .order(order.column, { ascending: order.ascending ?? true })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (row: Row) => {
      const payload: Row = {};
      for (const f of spec.fields) payload[f.name] = row[f.name];
      Object.assign(payload, spec.defaults ? {} : {});
      if (row["id"]) {
        const { error } = await supabase.from(spec.table).update(payload).eq("id", row["id"]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(spec.table).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: key });
    },
    onError: (e: Error) => toast.error("Could not save", { description: e.message }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(spec.table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: key });
    },
    onError: (e: Error) => toast.error("Could not delete", { description: e.message }),
  });

  return (
    <>
      <AdminHeader
        title={spec.title}
        description={spec.description}
        action={
          <Button onClick={() => setEditing(emptyFor(spec))}>
            <Plus className="size-4" aria-hidden="true" /> New {spec.singular}
          </Button>
        }
      />

      {editing ? (
        <AdminCard className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold">
              {editing["id"] ? `Edit ${spec.singular}` : `New ${spec.singular}`}
            </h2>
            <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="rounded p-1.5 hover:bg-accent">
              <X className="size-4" />
            </button>
          </div>
          <form
            className="grid gap-5 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate(editing);
            }}
          >
            {spec.fields.map((f) => (
              <FieldControl
                key={f.name}
                spec={f}
                value={editing[f.name]}
                onChange={(v) => setEditing((cur) => ({ ...(cur ?? {}), [f.name]: v }))}
              />
            ))}
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit" disabled={save.isPending}>
                <Saving show={save.isPending} /> Save {spec.singular}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </AdminCard>
      ) : null}

      {list.isLoading ? <AdminLoading /> : null}
      {list.isError ? <AdminError /> : null}
      {list.data?.length === 0 ? (
        <AdminEmpty
          title={`No ${spec.title.toLowerCase()} yet`}
          message={`Add your first ${spec.singular} and it will appear on the website straight away.`}
          action={<Button onClick={() => setEditing(emptyFor(spec))}>New {spec.singular}</Button>}
        />
      ) : null}

      {list.data && list.data.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[600px] text-sm">
            <thead className="border-b bg-muted/50 text-left">
              <tr>
                {spec.columns.map((c) => (
                  <th key={c.name} className="px-4 py-3 font-semibold">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((row) => (
                <tr key={row["id"]} className="border-b last:border-0">
                  {spec.columns.map((c) => (
                    <td key={c.name} className="max-w-[280px] truncate px-4 py-3">
                      {c.name === "status" ? (
                        <StatusPill status={String(row[c.name] ?? "")} />
                      ) : Array.isArray(row[c.name]) ? (
                        row[c.name].length
                      ) : (
                        String(row[c.name] ?? "—")
                      )}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing(row)}
                      className="rounded p-2 hover:bg-accent"
                      aria-label="Edit"
                    >
                      <Pencil className="size-4" />
                    </button>
                    {spec.protectedFlag && row[spec.protectedFlag] ? null : (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Delete this item? This cannot be undone.")) remove.mutate(row["id"]);
                        }}
                        className="rounded p-2 text-destructive hover:bg-destructive/10"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  );
}

export function FieldControl({
  spec,
  value,
  onChange,
}: {
  spec: FieldSpec;
  value: any;
  onChange: (v: any) => void;
}) {
  const id = `f-${spec.name}`;
  const wide = spec.type === "textarea" || spec.type === "list" || spec.type === "media";

  return (
    <Field
      label={spec.label}
      htmlFor={id}
      required={spec.required}
      hint={spec.hint}
      className={wide ? "md:col-span-2" : undefined}
    >
      {spec.type === "textarea" ? (
        <TextArea id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={spec.placeholder} />
      ) : spec.type === "select" || spec.type === "status" ? (
        <SelectInput id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          {(spec.options ?? ["draft", "published", "archived"]).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </SelectInput>
      ) : spec.type === "number" ? (
        <TextInput
          id={id}
          inputMode="numeric"
          value={String(value ?? 0)}
          onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9-]/g, "")) || 0)}
        />
      ) : spec.type === "date" ? (
        <TextInput id={id} type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} />
      ) : spec.type === "list" ? (
        <TextArea
          id={id}
          value={Array.isArray(value) ? value.join("\n") : (value ?? "")}
          placeholder="One per line"
          onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        />
      ) : spec.type === "media" ? (
        <MediaPicker value={value ?? null} onChange={onChange} />
      ) : (
        <TextInput id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={spec.placeholder} />
      )}
    </Field>
  );
}
