
CREATE OR REPLACE FUNCTION public.validate_edu_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email !~* '\.edu$' THEN
    RAISE EXCEPTION 'Only .edu email addresses are allowed';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER check_edu_email_on_signup
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.validate_edu_email();
