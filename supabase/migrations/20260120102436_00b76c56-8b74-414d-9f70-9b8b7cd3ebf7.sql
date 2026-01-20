-- Create demo_comments table for post comments
CREATE TABLE public.demo_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.demo_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.demo_users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create demo_commitments table for seed commitments
CREATE TABLE public.demo_commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.demo_users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  years INTEGER NOT NULL DEFAULT 1,
  committed_at TIMESTAMPTZ DEFAULT NOW(),
  unlocks_at TIMESTAMPTZ,
  status TEXT DEFAULT 'active'
);

-- Enable RLS on both tables
ALTER TABLE public.demo_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_commitments ENABLE ROW LEVEL SECURITY;

-- RLS policies for demo_comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.demo_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert comments" 
ON public.demo_comments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own comments" 
ON public.demo_comments 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can delete their own comments" 
ON public.demo_comments 
FOR DELETE 
USING (true);

-- RLS policies for demo_commitments
CREATE POLICY "Commitments are viewable by everyone" 
ON public.demo_commitments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert commitments" 
ON public.demo_commitments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update commitments" 
ON public.demo_commitments 
FOR UPDATE 
USING (true);

-- Create indexes for performance
CREATE INDEX idx_demo_comments_post_id ON public.demo_comments(post_id);
CREATE INDEX idx_demo_comments_author_id ON public.demo_comments(author_id);
CREATE INDEX idx_demo_commitments_user_id ON public.demo_commitments(user_id);