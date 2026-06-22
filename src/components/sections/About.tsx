import { motion } from "framer-motion";
import { MapPin, Mail, Phone } from "lucide-react";
import type { AboutContent } from "@/lib/portfolio";

export function About({ about }: { about: AboutContent | null }) {
  const stats = [
    { label: "Years Experience", value: about?.years_experience ?? 2 },
    { label: "Projects Completed", value: about?.projects_completed ?? 12 },
    { label: "Happy Clients", value: about?.happy_clients ?? 8 },
  ];

  return (
    <section id="about" className="relative py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-strong shadow-elegant">
              <div className="absolute inset-0 grad-primary opacity-30" />
              {about?.profile_image ? (
                <img src={about.profile_image} alt="Malaika Waris" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center">
                  <span className="font-display text-[10rem] font-bold text-gradient">M</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 glass-strong rounded-2xl p-4 shadow-glow hidden sm:block">
              <div className="text-xs text-muted-foreground">Based in</div>
              <div className="font-medium flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{about?.location ?? "Pakistan"}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="text-xs uppercase tracking-widest text-primary font-medium">About Me</div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">
              Engineering elegant solutions across the  <span className="text-gradient">entire stack</span>.
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              {about?.bio ?? "Loading..."}
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="glass rounded-2xl p-5">
                  <div className="font-display text-3xl font-bold text-gradient">{s.value}+</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {about?.email && (
                <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{about.email}</span>
              )}
              {about?.phone && (
                <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" />{about.phone}</span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
