import { motion } from "framer-motion";
import { icons, Sparkles, type LucideIcon } from "lucide-react";
import type { Service } from "@/lib/portfolio";

function Icon({ name, className }: { name: string | null; className?: string }) {
  const Cmp: LucideIcon = (name && (icons as Record<string, LucideIcon>)[name]) || Sparkles;
  return <Cmp className={className} />;
}

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="relative py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-primary font-medium">Services</div>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">
            What I can <span className="text-gradient">do for you</span>.
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group glass rounded-3xl p-6 sm:p-8 hover:shadow-glow transition relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full grad-primary opacity-10 group-hover:opacity-20 transition" />
              <div className="grid place-items-center w-12 h-12 rounded-2xl grad-primary text-primary-foreground shadow-glow">
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
