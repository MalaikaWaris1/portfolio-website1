import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Resume } from "@/components/sections/Resume";
import { Contact } from "@/components/sections/Contact";
import {
  fetchAbout,
  fetchProjects,
  fetchResume,
  fetchServices,
  fetchSkills,
} from "@/lib/portfolio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Malaika Waris — Web Developer & CS Student" },
      { name: "description", content: "Premium portfolio of Malaika Waris. Projects, skills, services, resume, and contact." },
    ],
  }),
  component: Index,
});

function Index() {
  const about = useQuery({ queryKey: ["about"], queryFn: fetchAbout });
  const skills = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const projects = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const services = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const resume = useQuery({ queryKey: ["resume"], queryFn: fetchResume });

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Navbar />
      <main>
        <Hero about={about.data ?? null} resume={resume.data ?? null} />
        <About about={about.data ?? null} />
        <Skills skills={skills.data ?? []} />
        <Projects projects={projects.data ?? []} />
        <Services services={services.data ?? []} />
        <Resume resume={resume.data ?? null} />
        <Contact about={about.data ?? null} />
      </main>
      <Footer about={about.data ?? null} />
    </div>
  );
}
