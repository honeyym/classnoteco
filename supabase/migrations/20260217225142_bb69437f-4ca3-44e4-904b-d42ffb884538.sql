
DROP POLICY IF EXISTS "Authenticated users can view chat messages" ON public.chat_messages;

CREATE POLICY "Authenticated users can view chat messages"
ON public.chat_messages FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);
