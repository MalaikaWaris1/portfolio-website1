import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { ContactMessage } from "@/lib/portfolio";

async function fetchMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ContactMessage[];
}

export function AdminMessages() {
  const qc = useQueryClient();
  const { data: messages = [] } = useQuery({ queryKey: ["messages"], queryFn: fetchMessages });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["messages"] });
    qc.invalidateQueries({ queryKey: ["unread-messages"] });
  };

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ read: true }).eq("id", id);
    refresh();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Messages</h2>
        <p className="text-sm text-muted-foreground">Contact form submissions.</p>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`glass rounded-2xl p-4 ${!m.read ? "ring-1 ring-primary/40" : ""}`}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                {!m.read && <span className="text-[10px] px-1.5 py-0.5 rounded-full grad-primary text-primary-foreground">NEW</span>}
                <span className="font-medium">{m.name}</span>
                <a href={`mailto:${m.email}`} className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
                  <Mail className="h-3 w-3" />{m.email}
                </a>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-2 font-medium text-sm">{m.subject}</div>
            <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
            <div className="mt-3 flex gap-2">
              {!m.read && (
                <button onClick={() => markRead(m.id)} className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-secondary">
                  <CheckCheck className="h-3.5 w-3.5" /> Mark read
                </button>
              )}
              <button onClick={() => remove(m.id)} className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {!messages.length && <div className="text-sm text-muted-foreground text-center py-8">No messages yet.</div>}
      </div>
    </div>
  );
}
