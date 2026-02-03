-- Allow anyone (including anon sessions) to read course chat messages.
-- This fixes the UI showing "No messages yet" when the app is using mock auth.

GRANT SELECT ON TABLE public.chat_messages TO anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'chat_messages'
      AND policyname = 'Anyone can view chat messages'
  ) THEN
    CREATE POLICY "Anyone can view chat messages"
      ON public.chat_messages
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;
