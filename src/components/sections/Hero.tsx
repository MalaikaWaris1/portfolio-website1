import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Mail, Sparkles, Github, Linkedin } from "lucide-react";
import type { AboutContent, Resume } from "@/lib/portfolio";

// Typewriter Component
const Typewriter = ({
  words,
  delay = 0,
  loop = false,
  className = "",
  cursorColor = "bg-primary"
}: {
  words: string[];
  delay?: number;
  loop?: boolean;
  className?: string;
  cursorColor?: string;
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsWaiting(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isWaiting) return;
    const word = words[currentWordIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(word.substring(0, displayedText.length + 1));
        if (displayedText.length === word.length && loop) {
          setTimeout(() => setIsDeleting(true), 2500); 
        }
      } else {
        setDisplayedText(word.substring(0, displayedText.length - 1));
        if (displayedText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 60 : 120); 

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, words, currentWordIndex, isWaiting, loop]);

  return (
    <span className="inline-flex items-center min-h-[1.2em]">
      <span className={`${className} whitespace-nowrap`}>{displayedText}</span>
      {!isWaiting && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          className={`inline-block w-[3px] md:w-[5px] h-[0.9em] ml-1 md:ml-2 ${cursorColor}`}
        />
      )}
    </span>
  );
};

// --- UPDATED COMPONENT: Balanced Background Elements ---
const BackgroundEffects = () => {
  // Array updated to distribute elements evenly across Left, Center, and Right
  const elements = [
    // --- LARGE GLOWING ORBS (Aurora Effect) ---
    // Left Side
    { type: 'orb', color: 'bg-purple-500/30', size: 'w-64 h-64', top: '5%', left: '5%', duration: 12, delay: 0 },
    { type: 'orb', color: 'bg-indigo-500/20', size: 'w-80 h-80', top: '60%', left: '10%', duration: 20, delay: 0.5 },
    
    // Center Area
    { type: 'orb', color: 'bg-blue-500/25', size: 'w-72 h-72', top: '25%', left: '45%', duration: 15, delay: 1 },
    { type: 'orb', color: 'bg-violet-500/20', size: 'w-56 h-56', top: '75%', left: '40%', duration: 18, delay: 2 },
    
    // Right Side
    { type: 'orb', color: 'bg-pink-500/25', size: 'w-64 h-64', top: '15%', left: '75%', duration: 14, delay: 1.5 },
    { type: 'orb', color: 'bg-purple-400/20', size: 'w-72 h-72', top: '65%', left: '85%', duration: 16, delay: 0.8 },
    { type: 'orb', color: 'bg-blue-400/20', size: 'w-48 h-48', top: '40%', left: '80%', duration: 19, delay: 2.5 },

    // --- FLOATING CIRCLES (Glassy look) ---
    // Left
    { type: 'circle', color: 'border-purple-300/30', size: 'w-24 h-24', top: '20%', left: '10%', duration: 10, delay: 0 },
    { type: 'circle', color: 'border-pink-300/20', size: 'w-16 h-16', top: '80%', left: '15%', duration: 8, delay: 1 },
    // Center
    { type: 'circle', color: 'border-blue-300/25', size: 'w-32 h-32', top: '10%', left: '50%', duration: 12, delay: 0.5 },
    { type: 'circle', color: 'border-indigo-300/20', size: 'w-20 h-20', top: '85%', left: '45%', duration: 11, delay: 2 },
    // Right
    { type: 'circle', color: 'border-purple-300/30', size: 'w-28 h-28', top: '30%', left: '85%', duration: 14, delay: 1.5 },
    { type: 'circle', color: 'border-pink-300/25', size: 'w-16 h-16', top: '70%', left: '90%', duration: 9, delay: 0.8 },
    { type: 'circle', color: 'border-blue-300/20', size: 'w-24 h-24', top: '50%', left: '75%', duration: 13, delay: 2.2 },

    // --- SPARKLES / STARS ---
    // Left
    { type: 'sparkle', top: '15%', left: '8%', duration: 4, delay: 0 },
    { type: 'sparkle', top: '45%', left: '12%', duration: 5.5, delay: 1.2 },
    { type: 'sparkle', top: '85%', left: '5%', duration: 6, delay: 0.5 },
    // Center
    { type: 'sparkle', top: '5%', left: '40%', duration: 4.5, delay: 0.8 },
    { type: 'sparkle', top: '90%', left: '55%', duration: 5, delay: 1.5 },
    { type: 'sparkle', top: '35%', left: '35%', duration: 6.5, delay: 2 },
    // Right (Increased density here for balance)
    { type: 'sparkle', top: '10%', left: '70%', duration: 4.2, delay: 0.3 },
    { type: 'sparkle', top: '25%', left: '92%', duration: 5.8, delay: 1.1 },
    { type: 'sparkle', top: '55%', left: '85%', duration: 4.8, delay: 0.6 },
    { type: 'sparkle', top: '75%', left: '78%', duration: 5.2, delay: 1.8 },
    { type: 'sparkle', top: '88%', left: '95%', duration: 6.2, delay: 0.9 },
    { type: 'sparkle', top: '40%', left: '65%', duration: 4.7, delay: 1.4 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {elements.map((el, i) => {
        if (el.type === 'orb') {
          return (
            <motion.div
              key={`orb-${i}`}
              animate={{
                x: [0, 40, -30, 0],
                y: [0, -40, 30, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{ duration: el.duration, delay: el.delay, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute rounded-full blur-[80px] ${el.color} ${el.size}`}
              style={{ top: el.top, left: el.left }}
            />
          );
        }
        if (el.type === 'circle') {
          return (
            <motion.div
              key={`circle-${i}`}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: el.duration, delay: el.delay, repeat: Infinity, ease: "linear" }}
              className={`absolute rounded-full border-[2px] ${el.color} ${el.size}`}
              style={{ top: el.top, left: el.left }}
            />
          );
        }
        if (el.type === 'sparkle') {
          return (
            <motion.div
              key={`sparkle-${i}`}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 90, 180],
              }}
              transition={{ duration: el.duration, delay: el.delay, repeat: Infinity, ease: "easeInOut" }}
              className="absolute text-primary/40 hidden md:block"
              style={{ top: el.top, left: el.left }}
            >
              <Sparkles size={20 + (i % 3) * 10} />
            </motion.div>
          );
        }
        return null;
      })}
    </div>
  );
};

export function Hero({ about, resume }: { about: AboutContent | null; resume: Resume | null }) {
  const springTransition = { type: "spring", stiffness: 100, damping: 20 } as const;

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      
      {/* 1. Base Gradient Background */}
      <div className="absolute inset-0 grad-hero-bg opacity-40 pointer-events-none -z-20" />
      <div className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--foreground)_8%,transparent)_1px,transparent_0)] [background-size:32px_32px] opacity-[0.2] pointer-events-none -z-20" />

      {/* --- BACKGROUND EFFECTS COMPONENT --- */}
      <BackgroundEffects />

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl">
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs sm:text-sm text-muted-foreground"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </motion.div>
            Available for freelance & Jobs
          </motion.div>

          {/* Main Heading */}
          <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight flex flex-col gap-1 sm:gap-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="flex flex-wrap items-center"
            >
              <span className="mr-3 sm:mr-4">Hi, I'm</span>
              <span className="text-gradient pb-1">Malaika Waris</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.3 }}
              className="flex items-center"
            >
              <Typewriter 
                words={[
                  "a Web Developer.", 
                  "a Computer Science Student.", 
                  "an AI Enthusiast."
                ]} 
                delay={1000} 
                loop={true} 
                className="text-foreground/90 pb-1" 
                cursorColor="bg-foreground/70" 
              />
            </motion.div>
          </h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.4 }} 
            className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground"
          >
            Web Developer & Computer Science student crafting modern, performant, and delightful
            digital experiences with React, CSS, and a love for clean design.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#projects"
              className="group inline-flex items-center gap-2 grad-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium shadow-glow hover:shadow-elegant transition-all"
            >
              View Projects
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={resume?.file_url ?? "#resume"}
              target={resume?.file_url ? "_blank" : undefined}
              rel="noreferrer"
              download={resume?.file_name ?? undefined}
              className="inline-flex items-center gap-2 glass-strong px-6 py-3 rounded-2xl font-medium hover:shadow-elegant transition-all"
            >
              <Download className="h-4 w-4" /> Download Resume
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium border border-border hover:bg-secondary transition-all"
            >
              <Mail className="h-4 w-4" /> Contact Me
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 flex items-center gap-4 text-muted-foreground"
          >
            {about?.github_url && (
              <a href={about.github_url} target="_blank" rel="noreferrer" className="hover:text-foreground hover:-translate-y-1 transition-all"><Github className="h-5 w-5" /></a>
            )}
            {about?.linkedin_url && (
              <a href={about.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-foreground hover:-translate-y-1 transition-all"><Linkedin className="h-5 w-5" /></a>
            )}
            <div className="h-px w-16 bg-border" />
            <span className="text-xs uppercase tracking-widest animate-pulse">Scroll to explore</span>
          </motion.div>
        </div>

        {/* Floating Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ ...springTransition, delay: 0.6 }}
          className="hidden lg:block absolute right-8 top-32 w-72"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="glass-strong rounded-3xl p-6 shadow-elegant transition-all cursor-default relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              
              <div className="text-xs text-muted-foreground relative z-10">Currently building</div>
              <div className="mt-2 font-display text-2xl font-semibold relative z-10">React + JS</div>
              <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden relative z-10">
                <div className="h-full grad-primary w-[78%]" />
              </div>
              <div className="mt-3 text-xs text-muted-foreground relative z-10">Component library · 78%</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="glass rounded-2xl p-4 mt-4 flex items-center gap-3 transition-all cursor-default shadow-sm"
            >
              <div className="grid place-items-center w-10 h-10 rounded-xl grad-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Open to collab</div>
                <div className="text-xs text-muted-foreground">Let's build something nice</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}