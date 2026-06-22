import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, ArrowLeft, FolderKanban, Wrench, Briefcase, FileText, MessageSquare, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AdminAbout } from "@/components/admin/AdminAbout";
import { AdminSkills } from "@/components/admin/AdminSkills";
import { AdminProjects } from "@/components/admin/AdminProjects";
import { AdminServices } from "@/components/admin/AdminServices";
import { AdminResume } from "@/components/admin/AdminResume";
import { AdminMessages } from "@/components/admin/AdminMessages";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Dashboard — Malaika Waris" }] }),
  component: AdminPage,
});

type Tab = "about" | "skills" | "projects" | "services" | "resume" | "messages";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageSquare },
];

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("about");
  const qc = useQueryClient();

  const unread = useQuery({
    queryKey: ["unread-messages"],
    enabled: isAdmin,
    queryFn: async () => {
      const { count } = await supabase
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false);
      return count ?? 0;
    },
  });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="max-w-md text-center glass-strong rounded-3xl p-8">
          <h1 className="font-display text-2xl font-bold">Not an admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account ({user.email}) doesn't have admin permissions.
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <Link to="/" className="px-4 py-2 rounded-xl border border-border text-sm">Home</Link>
            <button onClick={signOut} className="px-4 py-2 rounded-xl grad-primary text-primary-foreground text-sm">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass-strong border-b border-border/60">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <div className="h-5 w-px bg-border" />
            <h1 className="font-display text-lg font-semibold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground">{user.email}</span>
            <button
              onClick={async () => { await signOut(); qc.clear(); navigate({ to: "/auth" }); }}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-secondary"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition ${
                  active ? "grad-primary text-primary-foreground shadow-glow" : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2"><Icon className="h-4 w-4" /> {t.label}</span>
                {t.id === "messages" && (unread.data ?? 0) > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? "bg-primary-foreground/20" : "bg-primary text-primary-foreground"}`}>
                    {unread.data}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        <section className="glass-strong rounded-3xl p-6">
          {tab === "about" && <AdminAbout />}
          {tab === "skills" && <AdminSkills />}
          {tab === "projects" && <AdminProjects />}
          {tab === "services" && <AdminServices />}
          {tab === "resume" && <AdminResume />}
          {tab === "messages" && <AdminMessages />}
        </section>
      </div>
    </div>
  );
}
