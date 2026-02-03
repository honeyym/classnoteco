-- Add likes column and parent_id for replies to chat_messages
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS likes integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE;

-- Create index for faster reply lookups
CREATE INDEX IF NOT EXISTS idx_chat_messages_parent_id ON public.chat_messages(parent_id);
