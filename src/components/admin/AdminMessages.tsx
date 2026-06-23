import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Mail, CheckCheck, Reply, Clock } from "lucide-react";
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
    if (!confirm("Are you sure you want to delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Message deleted successfully");
    refresh();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-display text-2xl font-bold">Messages Hub</h2>
        <p className="text-sm text-muted-foreground">Manage and reply to your contact form submissions.</p>
      </div>

      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`bg-card border rounded-2xl overflow-hidden shadow-sm transition-all ${!m.read ? "ring-2 ring-primary/40 border-primary/20" : "border-border"}`}>
            
            <div className="p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-semibold tracking-wider">NEW</span>}
                    <span className="font-semibold text-base">{m.name}</span>
                  </div>
                  <a href={`mailto:${m.email}`} className="text-sm text-muted-foreground inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Mail className="h-3.5 w-3.5" /> {m.email}
                  </a>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {new Date(m.created_at).toLocaleDateString()} at {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                <div className="font-medium text-sm mb-1 text-foreground">Subject: {m.subject}</div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{m.message}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2">
                
                {/* Asaan Reply Button (Direct Email Open Karega) */}
                <a 
                  href={`mailto:${m.email}?subject=Reply: ${m.subject}&body=Hi ${m.name},%0D%0A%0D%0A`}
                  onClick={() => { if(!m.read) markRead(m.id); }} // Reply karte waqt khud hi Read mark kar dega
                  className="text-xs inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Reply className="h-3.5 w-3.5" /> Reply
                </a>
                
                {!m.read && (
                  <button onClick={() => markRead(m.id)} className="text-xs inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors">
                    <CheckCheck className="h-3.5 w-3.5" /> Mark as Read
                  </button>
                )}
                
                <button onClick={() => remove(m.id)} className="text-xs inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors ml-auto">
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {!messages.length && (
           <div className="text-sm flex flex-col items-center justify-center text-muted-foreground py-16 bg-card border border-dashed rounded-2xl">
             <Mail className="h-8 w-8 mb-3 opacity-20" />
             No messages received yet.
           </div>
        )}
      </div>
    </div>
  );
}