ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS is_default_saved boolean NOT NULL DEFAULT false;

CREATE TABLE public.saved_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  is_saved boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, post_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_posts TO authenticated;
GRANT ALL ON public.saved_posts TO service_role;

ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved posts"
ON public.saved_posts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can save posts"
ON public.saved_posts FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = saved_posts.post_id
      AND public.is_enrolled(auth.uid(), p.course_id)
  )
);

CREATE POLICY "Users can update their saved posts"
ON public.saved_posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.posts p
    WHERE p.id = saved_posts.post_id
      AND public.is_enrolled(auth.uid(), p.course_id)
  )
);

CREATE POLICY "Users can delete their saved posts"
ON public.saved_posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_saved_posts_user_id ON public.saved_posts(user_id);
CREATE INDEX idx_saved_posts_post_id ON public.saved_posts(post_id);

CREATE OR REPLACE FUNCTION public.update_saved_posts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_saved_posts_updated_at
BEFORE UPDATE ON public.saved_posts
FOR EACH ROW EXECUTE FUNCTION public.update_saved_posts_updated_at();