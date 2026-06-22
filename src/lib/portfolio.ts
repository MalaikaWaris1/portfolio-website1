import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  tech_stack: string[];
  featured: boolean;
  sort_order: number;
};

export type Skill = {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
  proficiency: number;
  sort_order: number;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  sort_order: number;
};

export type AboutContent = {
  id: string;
  bio: string;
  profile_image: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  years_experience: number | null;
  projects_completed: number | null;
  happy_clients: number | null;
};

export type Resume = {
  id: string;
  file_url: string;
  file_name: string | null;
  uploaded_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Skill[];
}

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Service[];
}

export async function fetchAbout(): Promise<AboutContent | null> {
  const { data, error } = await supabase
    .from("about_content")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as AboutContent | null;
}

export async function fetchResume(): Promise<Resume | null> {
  const { data, error } = await supabase
    .from("resume")
    .select("*")
    .order("uploaded_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as Resume | null;
}
