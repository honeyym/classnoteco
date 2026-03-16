
-- Create study_groups table
CREATE TABLE public.study_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id text NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  creator_id uuid NOT NULL,
  max_members integer NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create study_group_members table
CREATE TABLE public.study_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, user_id)
);

-- Enable RLS
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;

-- study_groups policies
CREATE POLICY "Enrolled users can view study groups"
  ON public.study_groups FOR SELECT
  TO authenticated
  USING (is_enrolled(auth.uid(), course_id));

CREATE POLICY "Enrolled users can create study groups"
  ON public.study_groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id AND is_enrolled(auth.uid(), course_id));

CREATE POLICY "Creators can delete their study groups"
  ON public.study_groups FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can update their study groups"
  ON public.study_groups FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

-- study_group_members policies
CREATE POLICY "Enrolled users can view group members"
  ON public.study_group_members FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.study_groups sg
    WHERE sg.id = group_id AND is_enrolled(auth.uid(), sg.course_id)
  ));

CREATE POLICY "Enrolled users can join groups"
  ON public.study_group_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.study_groups sg
    WHERE sg.id = group_id AND is_enrolled(auth.uid(), sg.course_id)
  ));

CREATE POLICY "Users can leave groups"
  ON public.study_group_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
