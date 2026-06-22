import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Send, Mail, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { AboutContent } from "@/lib/portfolio";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Invalid email").max(200),
  subject: z.string().trim().min(2, "Subject required").max(120),
  message: z.string().trim().min(10, "Tell me a bit more (10+ chars)").max(2000),
});

type Form = z.infer<typeof schema>;

export function Contact({ about }: { about: AboutContent | null }) {
  const [form, setForm] = useState<Form>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof Form, string>> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as keyof Form] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(result.data);
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send message. Try again.");
      return;
    }
    setSuccess(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    toast.success("Message sent! I'll get back to you soon.");
  };

  return (
    <section id="contact" className="relative py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-widest text-primary font-medium">Contact</div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">
              Let's build something <span className="text-gradient">together</span>.
            </h2>
            <p className="mt-4 text-muted-foreground max-w-md">
              Have a project, idea, or opportunity in mind? Drop me a message and I'll get back to you within 24 hours.
            </p>

            <div className="mt-8 space-y-3">
              {about?.email && (
                <div className="glass rounded-2xl p-4 flex items-center gap-3">
                  <div className="grid place-items-center w-10 h-10 rounded-xl grad-primary text-primary-foreground"><Mail className="h-4 w-4" /></div>
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="font-medium text-sm">{about.email}</div>
                  </div>
                </div>
              )}
              {about?.phone && (
                <div className="glass rounded-2xl p-4 flex items-center gap-3">
                  <div className="grid place-items-center w-10 h-10 rounded-xl grad-primary text-primary-foreground"><Phone className="h-4 w-4" /></div>
                  <div>
                    <div className="text-xs text-muted-foreground">Phone</div>
                    <div className="font-medium text-sm">{about.phone}</div>
                  </div>
                </div>
              )}
              {about?.location && (
                <div className="glass rounded-2xl p-4 flex items-center gap-3">
                  <div className="grid place-items-center w-10 h-10 rounded-xl grad-primary text-primary-foreground"><MapPin className="h-4 w-4" /></div>
                  <div>
                    <div className="text-xs text-muted-foreground">Location</div>
                    <div className="font-medium text-sm">{about.location}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={onSubmit}
            className="glass-strong rounded-3xl p-6 sm:p-8 shadow-elegant space-y-4"
          >
            {success && (
              <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-xl p-3">
                <CheckCircle2 className="h-4 w-4" /> Thanks! Your message has been received.
              </div>
            )}

            <Field label="Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={update("name")}
                className="w-full bg-transparent rounded-xl border border-border px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                placeholder="Your name"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                className="w-full bg-transparent rounded-xl border border-border px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Subject" error={errors.subject}>
              <input
                type="text"
                value={form.subject}
                onChange={update("subject")}
                className="w-full bg-transparent rounded-xl border border-border px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition"
                placeholder="What's this about?"
              />
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea
                rows={5}
                value={form.message}
                onChange={update("message")}
                className="w-full bg-transparent rounded-xl border border-border px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition resize-none"
                placeholder="Tell me about your project..."
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 grad-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium shadow-glow hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting ? "Sending…" : (<>Send Message <Send className="h-4 w-4" /></>)}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
