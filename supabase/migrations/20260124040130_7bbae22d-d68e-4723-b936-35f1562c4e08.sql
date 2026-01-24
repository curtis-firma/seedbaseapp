-- Create reactions table for message reactions
CREATE TABLE public.demo_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transfer_id UUID NOT NULL REFERENCES public.demo_transfers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.demo_users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Ensure one reaction per emoji per user per message
  UNIQUE(transfer_id, user_id, emoji)
);

-- Enable Row Level Security
ALTER TABLE public.demo_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Reactions are viewable by everyone"
ON public.demo_reactions FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert reactions"
ON public.demo_reactions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can delete their own reactions"
ON public.demo_reactions FOR DELETE
USING (true);

-- Enable realtime for reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.demo_reactions;

-- Create index for faster lookups
CREATE INDEX idx_demo_reactions_transfer_id ON public.demo_reactions(transfer_id);