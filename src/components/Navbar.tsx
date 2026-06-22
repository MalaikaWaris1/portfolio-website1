import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#resume", label: "Resume" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  
  // 1. Naya state active link ko track karne ke liye (default '#home' set kiya hai)
  const [activeLink, setActiveLink] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    
    // Page load hone par URL mein jo hash hai usko active set karna
    if (window.location.hash) {
      setActiveLink(window.location.hash);
    }
    
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-300 ${
            scrolled ? "glass-strong shadow-elegant" : "glass"
          }`}
        >
          {/* Logo par click karne se wapas '#home' active ho jayega */}
          <a 
            href="#home" 
            onClick={() => setActiveLink("#home")}
            className="flex items-center gap-2"
          >
            <span className="grid place-items-center w-9 h-9 rounded-xl grad-primary text-primary-foreground font-bold shadow-glow">
              M
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Malaika</span>
          </a>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  // 2. Click karne par state update karna
                  onClick={() => setActiveLink(l.href)}
                  // 3. 'relative' class lazmi hai absolute line ke liye
                  className={`relative px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    activeLink === l.href 
                      ? "text-primary font-medium" // Active link ka text color
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {l.label}
                  
                  {/* 4. Ye hai wo ANIMATED LINE */}
                  <span 
                    className={`absolute bottom-0 left-1/2 h-[2px] bg-primary -translate-x-1/2 transition-all duration-300 rounded-full ${
                      activeLink === l.href ? "w-[70%]" : "w-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center rounded-xl grad-primary text-primary-foreground text-sm font-medium px-4 py-2 shadow-glow hover:opacity-90 transition"
            >
              Admin
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-3 space-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                // Mobile menu mein click hone par menu close ho aur link active ho jaye
                onClick={() => {
                  setOpen(false);
                  setActiveLink(l.href);
                }}
                className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                  activeLink === l.href
                    ? "bg-primary/10 text-primary font-medium" // Mobile active style
                    : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-lg text-sm grad-primary text-primary-foreground text-center"
            >
              Admin Dashboard
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}