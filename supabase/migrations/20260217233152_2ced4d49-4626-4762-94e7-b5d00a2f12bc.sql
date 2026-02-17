
-- Posts table
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id text NOT NULL,
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  is_anonymous boolean NOT NULL DEFAULT false,
  content text NOT NULL,
  link text,
  likes integer NOT NULL DEFAULT 0,
  dislikes integer NOT NULL DEFAULT 0,
  hearts integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view posts"
ON public.posts FOR SELECT
USING (is_enrolled(auth.uid(), course_id));

CREATE POLICY "Enrolled users can create posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = user_id AND is_enrolled(auth.uid(), course_id));

CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
USING (auth.uid() = user_id);

-- Post replies table
CREATE TABLE public.post_replies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  author_name text NOT NULL,
  is_anonymous boolean NOT NULL DEFAULT false,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.post_replies ENABLE ROW LEVEL SECURITY;

-- Replies inherit access from the parent post's course
CREATE POLICY "Enrolled users can view replies"
ON public.post_replies FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.posts p
  WHERE p.id = post_replies.post_id
  AND is_enrolled(auth.uid(), p.course_id)
));

CREATE POLICY "Enrolled users can create replies"
ON public.post_replies FOR INSERT
WITH CHECK (auth.uid() = user_id AND EXISTS (
  SELECT 1 FROM public.posts p
  WHERE p.id = post_replies.post_id
  AND is_enrolled(auth.uid(), p.course_id)
));

CREATE POLICY "Users can delete their own replies"
ON public.post_replies FOR DELETE
USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_posts_course_id ON public.posts(course_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_post_replies_post_id ON public.post_replies(post_id);

-- Enable realtime for posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_replies;

-- Validation trigger for posts
CREATE OR REPLACE FUNCTION public.validate_post()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF char_length(NEW.content) = 0 OR char_length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Post content must be between 1 and 5000 characters';
  END IF;
  IF char_length(NEW.author_name) = 0 OR char_length(NEW.author_name) > 100 THEN
    RAISE EXCEPTION 'Author name must be between 1 and 100 characters';
  END IF;
  IF NEW.course_id !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid course ID format';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_post_trigger
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.validate_post();

-- Validation trigger for replies
CREATE OR REPLACE FUNCTION public.validate_post_reply()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF char_length(NEW.content) = 0 OR char_length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Reply content must be between 1 and 5000 characters';
  END IF;
  IF char_length(NEW.author_name) = 0 OR char_length(NEW.author_name) > 100 THEN
    RAISE EXCEPTION 'Author name must be between 1 and 100 characters';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_post_reply_trigger
BEFORE INSERT OR UPDATE ON public.post_replies
FOR EACH ROW EXECUTE FUNCTION public.validate_post_reply();
