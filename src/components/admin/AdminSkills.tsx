import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchSkills, type Skill } from "@/lib/portfolio";

export function AdminSkills() {
  const qc = useQueryClient();
  const { data: skills = [] } = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);

  const save = async () => {
    if (!editing?.name) return toast.error("Name required");
    const payload = {
      name: editing.name,
      icon: editing.icon ?? "Code2",
      category: editing.category ?? "",
      proficiency: editing.proficiency ?? 80,
      sort_order: editing.sort_order ?? 0,
    };
    const { error } = editing.id
      ? await supabase.from("skills").update(payload).eq("id", editing.id)
      : await supabase.from("skills").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Skill saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["skills"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["skills"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Skills</h2>
          <p className="text-sm text-muted-foreground">Manage the skills shown on your portfolio.</p>
        </div>
        <button
          onClick={() => setEditing({ name: "", icon: "Code2", category: "", proficiency: 80, sort_order: skills.length })}
          className="inline-flex items-center gap-1.5 grad-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-glow"
        >
          <Plus className="h-4 w-4" /> Add Skill
        </button>
      </div>

      {editing && (
        <div className="glass rounded-2xl p-4 grid sm:grid-cols-5 gap-3">
          <input
            placeholder="Name"
            value={editing.name ?? ""}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Icon (Lucide)"
            value={editing.icon ?? ""}
            onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
            className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Category"
            value={editing.category ?? ""}
            onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Proficiency %"
            value={editing.proficiency ?? 80}
            onChange={(e) => setEditing({ ...editing, proficiency: Number(e.target.value) })}
            className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button onClick={save} className="flex-1 grad-primary text-primary-foreground rounded-lg text-sm inline-flex items-center justify-center gap-1"><Save className="h-3.5 w-3.5" /> Save</button>
            <button onClick={() => setEditing(null)} className="px-3 border border-border rounded-lg"><X className="h-4 w-4" /></button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {skills.map((s) => (
          <div key={s.id} className="glass rounded-xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs px-2 py-1 rounded bg-secondary">{s.category || "—"}</span>
              <div className="font-medium truncate">{s.name}</div>
              <div className="text-xs text-muted-foreground">{s.icon}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-xs text-muted-foreground">{s.proficiency}%</div>
              <button onClick={() => setEditing(s)} className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary">Edit</button>
              <button onClick={() => remove(s.id)} className="text-xs p-2 rounded-lg border border-border hover:bg-destructive/10 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
        {!skills.length && <div className="text-sm text-muted-foreground text-center py-8">No skills yet.</div>}
      </div>
    </div>
  );
}
