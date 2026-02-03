-- Create chat messages table for course-wide real-time messaging
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view messages in courses they have access to
-- For now, all authenticated users can view all course messages
CREATE POLICY "Authenticated users can view chat messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert their own messages
CREATE POLICY "Authenticated users can send chat messages"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete their own chat messages"
ON public.chat_messages
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create index for faster course-based queries
CREATE INDEX idx_chat_messages_course_id ON public.chat_messages(course_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;