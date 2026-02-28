CREATE POLICY "Users can update their own replies"
ON public.post_replies
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);