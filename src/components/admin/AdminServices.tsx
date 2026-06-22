import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchServices, type Service } from "@/lib/portfolio";

export function AdminServices() {
  const qc = useQueryClient();
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const [editing, setEditing] = useState<Partial<Service> | null>(null);

  const save = async () => {
    if (!editing?.title) return toast.error("Title required");
    const payload = {
      title: editing.title,
      description: editing.description ?? "",
      icon: editing.icon ?? "Sparkles",
      sort_order: editing.sort_order ?? 0,
    };
    const { error } = editing.id
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Service saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Services</h2>
          <p className="text-sm text-muted-foreground">What you offer.</p>
        </div>
        <button
          onClick={() => setEditing({ title: "", description: "", icon: "Sparkles", sort_order: services.length })}
          className="inline-flex items-center gap-1.5 grad-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-glow"
        >
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {editing && (
        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Title" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm" />
            <input placeholder="Icon (Lucide name)" value={editing.icon ?? ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <textarea rows={3} placeholder="Description" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full bg-transparent rounded-lg border border-border px-3 py-2 text-sm" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="px-3 py-2 border border-border rounded-lg text-sm inline-flex items-center gap-1"><X className="h-4 w-4" /> Cancel</button>
            <button onClick={save} className="grad-primary text-primary-foreground rounded-lg text-sm px-4 py-2 inline-flex items-center gap-1"><Save className="h-4 w-4" /> Save</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {services.map((s) => (
          <div key={s.id} className="glass rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">{s.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(s)} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary">Edit</button>
              <button onClick={() => remove(s.id)} className="text-xs p-2 rounded-lg border border-border text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
        {!services.length && <div className="text-sm text-muted-foreground text-center py-8">No services yet.</div>}
      </div>
    </div>
  );
}
