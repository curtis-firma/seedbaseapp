-- Demo Users Table (NOT using auth.users)
CREATE TABLE public.demo_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  active_role TEXT CHECK (active_role IN ('activator','trustee','envoy')) DEFAULT 'activator',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Demo Wallets - One or more per user
CREATE TABLE public.demo_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.demo_users(id) ON DELETE CASCADE,
  wallet_type TEXT CHECK (wallet_type IN ('personal','distributions','provision','mission')) DEFAULT 'personal',
  display_id TEXT UNIQUE NOT NULL,
  balance NUMERIC NOT NULL DEFAULT 25,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo Keys - One per user based on role
CREATE TABLE public.demo_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.demo_users(id) ON DELETE CASCADE,
  key_type TEXT CHECK (key_type IN ('SeedKey','BaseKey','MissionKey')) NOT NULL,
  display_id TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('active','inactive')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo Transfers - USDC transfers between users
CREATE TABLE public.demo_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES public.demo_users(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES public.demo_users(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  purpose TEXT,
  status TEXT CHECK (status IN ('pending','accepted','declined')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- Demo Posts - User generated content for feed
CREATE TABLE public.demo_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES public.demo_users(id) ON DELETE SET NULL,
  seedbase_tag TEXT,
  mission_tag TEXT,
  post_type TEXT CHECK (post_type IN ('update','testimony','thank_you','announcement','transparency','vote')) DEFAULT 'update',
  body TEXT NOT NULL,
  image_url TEXT,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo Conversations for OneAccord messaging
CREATE TABLE public.demo_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.demo_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation Participants
CREATE TABLE public.demo_conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.demo_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.demo_users(id) ON DELETE CASCADE,
  UNIQUE(conversation_id, user_id)
);

-- Demo Messages
CREATE TABLE public.demo_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.demo_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.demo_users(id) ON DELETE SET NULL,
  body TEXT,
  transfer_id UUID REFERENCES public.demo_transfers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.demo_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_messages ENABLE ROW LEVEL SECURITY;

-- Public read/write policies for demo (no auth required)
CREATE POLICY "Public demo read" ON public.demo_users FOR SELECT USING (true);
CREATE POLICY "Public demo insert" ON public.demo_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Public demo update" ON public.demo_users FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public demo read" ON public.demo_wallets FOR SELECT USING (true);
CREATE POLICY "Public demo insert" ON public.demo_wallets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public demo update" ON public.demo_wallets FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public demo read" ON public.demo_keys FOR SELECT USING (true);
CREATE POLICY "Public demo insert" ON public.demo_keys FOR INSERT WITH CHECK (true);
CREATE POLICY "Public demo update" ON public.demo_keys FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public demo read" ON public.demo_transfers FOR SELECT USING (true);
CREATE POLICY "Public demo insert" ON public.demo_transfers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public demo update" ON public.demo_transfers FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public demo read" ON public.demo_posts FOR SELECT USING (true);
CREATE POLICY "Public demo insert" ON public.demo_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public demo update" ON public.demo_posts FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public demo read" ON public.demo_conversations FOR SELECT USING (true);
CREATE POLICY "Public demo insert" ON public.demo_conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Public demo read" ON public.demo_conversation_participants FOR SELECT USING (true);
CREATE POLICY "Public demo insert" ON public.demo_conversation_participants FOR INSERT WITH CHECK (true);

CREATE POLICY "Public demo read" ON public.demo_messages FOR SELECT USING (true);
CREATE POLICY "Public demo insert" ON public.demo_messages FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_demo_wallets_user_id ON public.demo_wallets(user_id);
CREATE INDEX idx_demo_keys_user_id ON public.demo_keys(user_id);
CREATE INDEX idx_demo_transfers_from_user ON public.demo_transfers(from_user_id);
CREATE INDEX idx_demo_transfers_to_user ON public.demo_transfers(to_user_id);
CREATE INDEX idx_demo_transfers_status ON public.demo_transfers(status);
CREATE INDEX idx_demo_posts_author ON public.demo_posts(author_id);
CREATE INDEX idx_demo_posts_created ON public.demo_posts(created_at DESC);
CREATE INDEX idx_demo_messages_conversation ON public.demo_messages(conversation_id);
CREATE INDEX idx_demo_conversation_participants_user ON public.demo_conversation_participants(user_id);

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars bucket
CREATE POLICY "Public avatar read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Public avatar insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Public avatar update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Public avatar delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');