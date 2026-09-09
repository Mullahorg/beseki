DROP POLICY IF EXISTS "Media files are readable" ON storage.objects;
CREATE POLICY "Media files are readable" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Staff upload media files" ON storage.objects;
CREATE POLICY "Staff upload media files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.can_manage_content(auth.uid()));

DROP POLICY IF EXISTS "Staff update media files" ON storage.objects;
CREATE POLICY "Staff update media files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.can_manage_content(auth.uid()))
  WITH CHECK (bucket_id = 'media' AND public.can_manage_content(auth.uid()));

DROP POLICY IF EXISTS "Staff delete media files" ON storage.objects;
CREATE POLICY "Staff delete media files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.can_manage_content(auth.uid()));