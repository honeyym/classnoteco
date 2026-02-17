
-- Add validation triggers for chat_messages fields
CREATE OR REPLACE FUNCTION public.validate_chat_message()
RETURNS TRIGGER AS $$
BEGIN
  IF char_length(NEW.content) = 0 OR char_length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Message content must be between 1 and 5000 characters';
  END IF;
  IF char_length(NEW.author_name) = 0 OR char_length(NEW.author_name) > 100 THEN
    RAISE EXCEPTION 'Author name must be between 1 and 100 characters';
  END IF;
  IF NEW.course_id !~ '^[a-zA-Z0-9_-]+$' THEN
    RAISE EXCEPTION 'Invalid course ID format';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER validate_chat_message_trigger
BEFORE INSERT OR UPDATE ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.validate_chat_message();
