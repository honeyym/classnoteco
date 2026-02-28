-- Course validation: create courses table and enforce FK on enrollments
-- Prevents enrollment in arbitrary course_id; only valid courses from catalog allowed

-- Create courses catalog table (source of truth for enrollable courses)
CREATE TABLE public.courses (
  id TEXT NOT NULL PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on courses (read-only for authenticated; no insert/update from client)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
ON public.courses FOR SELECT
TO authenticated
USING (true);

-- Insert known courses (matches src/data/mockData.ts)
INSERT INTO public.courses (id, code, name) VALUES
  ('cisc200', 'CISC 200', 'Intro-Computer Tech & Bus Appl'),
  ('busn100', 'BUSN 100', 'BUSN for the Common Good'),
  ('mgmt200', 'MGMT 200', 'Working Skillfully in Orgs'),
  ('psych101', 'PSYCH 101', 'Intro to Psychology'),
  ('econ251', 'ECON 251', 'Intro to Economics'),
  ('phil100', 'PHIL 100', 'Intro to Philosophy');

-- Remove any enrollments referencing non-existent courses (defensive cleanup)
DELETE FROM public.enrollments
WHERE course_id NOT IN (SELECT id FROM public.courses);

-- Add FK: enrollment only allowed for courses that exist in catalog
ALTER TABLE public.enrollments
  ADD CONSTRAINT enrollments_course_id_fkey
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;
