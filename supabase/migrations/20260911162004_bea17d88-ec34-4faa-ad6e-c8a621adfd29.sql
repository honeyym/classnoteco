CREATE OR REPLACE FUNCTION public.auto_enroll_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.enrollments (user_id, course_id)
  SELECT NEW.id, c
  FROM (VALUES ('acct311'), ('busn100'), ('phil100'), ('acct314')) AS t(c);
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_enroll_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.auto_enroll_new_user();

INSERT INTO public.enrollments (user_id, course_id)
SELECT u.id, c
FROM auth.users u
CROSS JOIN (VALUES ('acct311'), ('busn100'), ('phil100'), ('acct314')) AS t(c)
ON CONFLICT DO NOTHING;