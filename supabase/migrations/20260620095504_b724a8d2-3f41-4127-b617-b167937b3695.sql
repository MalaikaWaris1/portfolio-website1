
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
-- still need authenticated to be able to execute it inside RLS policies (it runs as definer)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Storage policies for project-images and resumes
CREATE POLICY "public read project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "admin write project images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update project images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete project images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "public read resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "admin write resumes" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resumes' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update resumes" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resumes' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete resumes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resumes' AND public.has_role(auth.uid(),'admin'));
