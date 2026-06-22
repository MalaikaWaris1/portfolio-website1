import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Upload, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchResume } from "@/lib/portfolio";

export function AdminResume() {
  const qc = useQueryClient();
  const { data: resume } = useQuery({ queryKey: ["resume"], queryFn: fetchResume });
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    if (file.type !== "application/pdf") return toast.error("PDF only");
    setUploading(true);
    const path = `resume-${Date.now()}.pdf`;
    const { error: upErr } = await supabase.storage.from("resumes").upload(path, file);
    if (upErr) { setUploading(false); return toast.error(upErr.message); }
    const { data: signed } = await supabase.storage.from("resumes").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    if (!signed?.signedUrl) { setUploading(false); return toast.error("Couldn't get URL"); }
    const { error: insErr } = await supabase.from("resume").insert({ file_url: signed.signedUrl, file_name: file.name });
    setUploading(false);
    if (insErr) return toast.error(insErr.message);
    toast.success("Resume uploaded");
    qc.invalidateQueries({ queryKey: ["resume"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Resume</h2>
        <p className="text-sm text-muted-foreground">Upload your latest CV as a PDF.</p>
      </div>

      {resume && (
        <div className="glass rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-xl grad-primary text-primary-foreground"><FileText className="h-4 w-4" /></div>
            <div>
              <div className="font-medium text-sm">{resume.file_name ?? "Current resume"}</div>
              <div className="text-xs text-muted-foreground">Uploaded {new Date(resume.uploaded_at).toLocaleString()}</div>
            </div>
          </div>
          <a href={resume.file_url} target="_blank" rel="noreferrer" className="text-sm inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border hover:bg-secondary">
            <ExternalLink className="h-3.5 w-3.5" /> Open
          </a>
        </div>
      )}

      <label className="block">
        <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:bg-secondary/30 transition">
          <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
          <div className="mt-2 text-sm">{uploading ? "Uploading…" : "Click to upload a new PDF"}</div>
          <div className="text-xs text-muted-foreground mt-1">Replaces the current resume on the public site</div>
        </div>
        <input type="file" accept="application/pdf" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
    </div>
  );
}
