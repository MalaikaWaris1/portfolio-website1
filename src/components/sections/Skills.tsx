import { motion } from "framer-motion";
import { icons, Code2, type LucideIcon } from "lucide-react";
import type { Skill } from "@/lib/portfolio";

function Icon({ name, className }: { name: string | null; className?: string }) {
  const Cmp: LucideIcon = (name && (icons as Record<string, LucideIcon>)[name]) || Code2;
  return <Cmp className={className} />;
}

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section id="skills" className="relative py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary font-medium">Skills</div>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">
            Tools I use to bring ideas to life.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A curated technology stack chosen for architecting robust backends and intuitive user interfaces.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group glass rounded-2xl p-5 hover:shadow-glow transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="grid place-items-center w-11 h-11 rounded-xl grad-primary text-primary-foreground shadow-glow">
                  <Icon name={s.icon} className="h-5 w-5" />
                </div>
                <div className="text-xs text-muted-foreground">{s.category}</div>
              </div>
              <div className="mt-4 font-display text-lg font-semibold">{s.name}</div>
              <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.05 }}
                  className="h-full grad-primary"
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{s.proficiency}%</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
