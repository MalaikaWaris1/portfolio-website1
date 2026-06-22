import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchAbout, type AboutContent } from "@/lib/portfolio";

const empty: Partial<AboutContent> = {
  bio: "", email: "", phone: "", location: "",
  github_url: "", linkedin_url: "", twitter_url: "",
  profile_image: "", years_experience: 0, projects_completed: 0, happy_clients: 0,
};

export function AdminAbout() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["about"], queryFn: fetchAbout });
  const [form, setForm] = useState<Partial<AboutContent>>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (data) setForm(data); }, [data]);

  const set = <K extends keyof AboutContent>(k: K, v: AboutContent[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = { ...form };
    const { error } = data
      ? await supabase.from("about_content").update(payload).eq("id", data.id)
      : await supabase.from("about_content").insert(payload as never);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("About section updated");
    qc.invalidateQueries({ queryKey: ["about"] });
  };

  if (isLoading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">About Section</h2>
        <p className="text-sm text-muted-foreground">Edit the content shown on the public About section.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Email" value={form.email ?? ""} onChange={(v) => set("email", v)} />
        <Field label="Phone" value={form.phone ?? ""} onChange={(v) => set("phone", v)} />
        <Field label="Location" value={form.location ?? ""} onChange={(v) => set("location", v)} />
        <Field label="Profile Image URL" value={form.profile_image ?? ""} onChange={(v) => set("profile_image", v)} />
        <Field label="GitHub URL" value={form.github_url ?? ""} onChange={(v) => set("github_url", v)} />
        <Field label="LinkedIn URL" value={form.linkedin_url ?? ""} onChange={(v) => set("linkedin_url", v)} />
        <Field label="Twitter URL" value={form.twitter_url ?? ""} onChange={(v) => set("twitter_url", v)} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <NumberField label="Years Experience" value={form.years_experience ?? 0} onChange={(v) => set("years_experience", v)} />
        <NumberField label="Projects Completed" value={form.projects_completed ?? 0} onChange={(v) => set("projects_completed", v)} />
        <NumberField label="Happy Clients" value={form.happy_clients ?? 0} onChange={(v) => set("happy_clients", v)} />
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Bio</span>
        <textarea
          rows={6}
          value={form.bio ?? ""}
          onChange={(e) => set("bio", e.target.value)}
          className="mt-1.5 w-full bg-transparent rounded-xl border border-border px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </label>

      <button
        onClick={save}
        disabled={saving}
        className="inline-flex items-center gap-2 grad-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium shadow-glow disabled:opacity-60"
      >
        <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full bg-transparent rounded-xl border border-border px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1.5 w-full bg-transparent rounded-xl border border-border px-4 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}
