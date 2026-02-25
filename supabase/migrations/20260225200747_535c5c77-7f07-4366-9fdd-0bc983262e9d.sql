
CREATE OR REPLACE FUNCTION public.toggle_message_like(p_message_id uuid, p_increment boolean)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_likes integer;
  v_course_id text;
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT course_id INTO v_course_id
  FROM chat_messages
  WHERE id = p_message_id;

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Message not found';
  END IF;

  IF NOT is_enrolled(v_user_id, v_course_id) THEN
    RAISE EXCEPTION 'Not enrolled in course';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('like_' || p_message_id::text));

  IF p_increment THEN
    UPDATE chat_messages SET likes = likes + 1 WHERE id = p_message_id RETURNING likes INTO new_likes;
  ELSE
    UPDATE chat_messages SET likes = GREATEST(0, likes - 1) WHERE id = p_message_id RETURNING likes INTO new_likes;
  END IF;

  RETURN COALESCE(new_likes, 0);
END;
$$;
