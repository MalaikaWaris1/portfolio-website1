import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Save, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchProjects, type Project } from "@/lib/portfolio";

export function AdminProjects() {
  const qc = useQueryClient();
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-]/g, "_")}`;
    const { error } = await supabase.storage.from("project-images").upload(path, file, { upsert: false });
    if (error) { setUploading(false); toast.error(error.message); return; }
    const { data: signed } = await supabase.storage.from("project-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    setUploading(false);
    if (signed?.signedUrl) {
      setEditing((e) => ({ ...(e ?? {}), image_url: signed.signedUrl }));
      toast.success("Image uploaded");
    }
  };

  const save = async () => {
    if (!editing?.title) return toast.error("Title required");
    const payload = {
      title: editing.title,
      description: editing.description ?? "",
      image_url: editing.image_url ?? null,
      github_url: editing.github_url ?? null,
      demo_url: editing.demo_url ?? null,
      tech_stack: editing.tech_stack ?? [],
      featured: editing.featured ?? true,
      sort_order: editing.sort_order ?? 0,
    };
    const { error } = editing.id
      ? await supabase.from("projects").update(payload).eq("id", editing.id)
      : await supabase.from("projects").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Project saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["projects"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Projects</h2>
          <p className="text-sm text-muted-foreground">Add, edit, and remove projects.</p>
        </div>
        <button
          onClick={() => setEditing({ title: "", description: "", tech_stack: [], featured: true, sort_order: projects.length })}
          className="inline-flex items-center gap-1.5 grad-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-glow"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {editing && (
        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input placeholder="Title" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm" />
            
            {/* Tech Stack Input updated to handle both commas (,) and slashes (/) */}
            <input 
              placeholder="Tech stack (comma or slash separated)" 
              value={(editing.tech_stack ?? []).join(", ")} 
              onChange={(e) => setEditing({ 
                ...editing, 
                tech_stack: e.target.value.split(/[,/]/).map(s => s.trim().replace(/\.$/, '')).filter(Boolean) 
              })} 
              className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm" 
            />
            
            <input placeholder="GitHub URL" value={editing.github_url ?? ""} onChange={(e) => setEditing({ ...editing, github_url: e.target.value })} className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm" />
            <input placeholder="Live demo URL" value={editing.demo_url ?? ""} onChange={(e) => setEditing({ ...editing, demo_url: e.target.value })} className="bg-transparent rounded-lg border border-border px-3 py-2 text-sm" />
          </div>
          <textarea rows={3} placeholder="Description" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full bg-transparent rounded-lg border border-border px-3 py-2 text-sm" />

          <div className="flex items-center gap-3 flex-wrap">
            <label className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-secondary">
              <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            {editing.image_url && (
              <img src={editing.image_url} alt="" className="h-12 w-20 object-cover rounded-lg border border-border" />
            )}
            <input placeholder="Or paste image URL" value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="flex-1 bg-transparent rounded-lg border border-border px-3 py-2 text-sm min-w-[200px]" />
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setEditing(null)} className="px-3 py-2 border border-border rounded-lg text-sm inline-flex items-center gap-1"><X className="h-4 w-4" /> Cancel</button>
            <button onClick={save} className="grad-primary text-primary-foreground rounded-lg text-sm px-4 py-2 inline-flex items-center gap-1"><Save className="h-4 w-4" /> Save</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {projects.map((p) => (
          <div key={p.id} className="glass rounded-2xl p-4 flex gap-3">
            {p.image_url ? (
              <img src={p.image_url} alt="" className="w-20 h-20 rounded-lg object-cover border border-border" />
            ) : <div className="w-20 h-20 rounded-lg grad-primary opacity-40" />}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">{p.description}</div>
              <div className="mt-2 flex gap-2">
                <button onClick={() => setEditing(p)} className="text-xs px-3 py-1 rounded-lg border border-border hover:bg-secondary">Edit</button>
                <button onClick={() => remove(p.id)} className="text-xs p-1.5 rounded-lg border border-border text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {!projects.length && <div className="md:col-span-2 text-sm text-muted-foreground text-center py-8">No projects yet.</div>}
      </div>
    </div>
  );
}