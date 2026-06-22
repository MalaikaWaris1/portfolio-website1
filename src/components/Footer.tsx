import { Github, Linkedin, Twitter, Heart } from "lucide-react";
import type { AboutContent } from "@/lib/portfolio";

export function Footer({ about }: { about: AboutContent | null }) {
  return (
    <footer className="relative mt-20 border-t border-border/60">
      <div className="container mx-auto px-4 sm:px-6 py-10 grid gap-6 md:grid-cols-3 items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid place-items-center w-9 h-9 rounded-xl grad-primary text-primary-foreground font-bold">
              M
            </span>
            <span className="font-display text-lg font-semibold">Malaika Waris</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Web Developer & CS student crafting elegant digital experiences.
          </p>
        </div>

        <div className="flex md:justify-center gap-3">
          {about?.github_url && (
            <a href={about.github_url} target="_blank" rel="noreferrer" className="glass p-2.5 rounded-xl hover:shadow-glow transition">
              <Github className="h-4 w-4" />
            </a>
          )}
          {about?.linkedin_url && (
            <a href={about.linkedin_url} target="_blank" rel="noreferrer" className="glass p-2.5 rounded-xl hover:shadow-glow transition">
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {about?.twitter_url && (
            <a href={about.twitter_url} target="_blank" rel="noreferrer" className="glass p-2.5 rounded-xl hover:shadow-glow transition">
              <Twitter className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="md:text-right text-sm text-muted-foreground flex md:justify-end items-center gap-1.5">
          © {new Date().getFullYear()} CodeWithMalai· All Rights Reserved.
          
        </div>
      </div>
    </footer>
  );
}
