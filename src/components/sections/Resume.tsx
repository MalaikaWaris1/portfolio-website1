import { motion } from "framer-motion";
import { FileText, Download, Eye } from "lucide-react";
import type { Resume as ResumeType } from "@/lib/portfolio";

export function Resume({ resume }: { resume: ResumeType | null }) {
  return (
    <section id="resume" className="relative py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-8 sm:p-12 shadow-elegant relative overflow-hidden"
        >
          <div className="absolute inset-0 grad-hero-bg opacity-40 pointer-events-none" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary font-medium">Resume</div>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl font-bold">
                My latest <span className="text-gradient">CV</span>, on demand.
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl">
                Want the full story? Download my up-to-date résumé to see experience, education and
                a deeper dive into projects.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              {resume?.file_url ? (
                <>
                  <a
                    href={resume.file_url}
                    download={resume.file_name ?? "Malaika-Waris-Resume.pdf"}
                    className="inline-flex items-center justify-center gap-2 grad-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium shadow-glow hover:opacity-90 transition"
                  >
                    <Download className="h-4 w-4" /> Download Resume
                  </a>
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 glass px-6 py-3 rounded-2xl font-medium hover:shadow-elegant transition"
                  >
                    <Eye className="h-4 w-4" /> Preview
                  </a>
                </>
              ) : (
                <div className="inline-flex items-center gap-2 glass px-6 py-3 rounded-2xl text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" /> Resume coming soon
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
