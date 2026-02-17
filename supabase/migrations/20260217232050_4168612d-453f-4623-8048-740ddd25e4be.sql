
CREATE OR REPLACE FUNCTION public.toggle_message_like(p_message_id uuid, p_increment boolean)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_likes integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('like_' || p_message_id::text));

  IF p_increment THEN
    UPDATE chat_messages SET likes = likes + 1 WHERE id = p_message_id RETURNING likes INTO new_likes;
  ELSE
    UPDATE chat_messages SET likes = GREATEST(0, likes - 1) WHERE id = p_message_id RETURNING likes INTO new_likes;
  END IF;

  RETURN COALESCE(new_likes, 0);
END;
$$;
