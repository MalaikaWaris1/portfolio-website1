import { useState } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink, Folder } from "lucide-react";
import type { Project } from "@/lib/portfolio";

export function Projects({ projects }: { projects: Project[] }) {
  // NAYA CODE: Har project card ke "Read More" state ko track karne ke liye
  const [expandedProjects, setExpandedProjects] = useState<Set<string | number>>(new Set());

  const toggleDescription = (id: string | number) => {
    setExpandedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section id="projects" className="relative py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-primary font-medium">Featured Work</div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">
              Selected <span className="text-gradient">projects</span>.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            A glimpse into what I've been crafting lately — across web, design, and tooling.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => {
            
            // Ye hissa aapki purani lambi strings ko theek karega
            const formattedTechStack = p.tech_stack
              ? p.tech_stack
                  .flatMap(t => t.split(/[,/]/)) // Comma aur Slash dono se alag karega
                  .map(t => t.trim().replace(/\.$/, '')) // Extra spaces aur aakhir ka '.' hatayega
                  .filter(Boolean) // Khali jagahon ko remove karega
              : [];

            // Check if this specific project card is expanded
            const isExpanded = expandedProjects.has(p.id);

            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="group glass-strong rounded-3xl overflow-hidden shadow-elegant flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full grad-hero-bg grid place-items-center">
                      <Folder className="h-12 w-12 text-foreground/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                  
                  {/* --- NAYA CODE: Read More / Show Less Logic --- */}
                  <div className="mt-2">
                    <p className={`text-sm text-muted-foreground transition-all duration-300 ${isExpanded ? "" : "line-clamp-3"}`}>
                      {p.description}
                    </p>
                    {/* Sirf tabhi Read More button dikhayega agar text lamba hai (> 120 characters) */}
                    {p.description && p.description.length > 120 && (
                      <button
                        onClick={() => toggleDescription(p.id)}
                        className="mt-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
                  {/* ---------------------------------------------- */}

                  {formattedTechStack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {formattedTechStack.slice(0, 4).map((t, index) => (
                        <span key={`${p.id}-${t}-${index}`} className="text-[11px] px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-border/60 flex items-center gap-2">
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-secondary transition"
                      >
                        <Github className="h-3.5 w-3.5" /> Code
                      </a>
                    )}
                    {p.demo_url && (
                      <a
                        href={p.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg grad-primary text-primary-foreground hover:opacity-90 transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}