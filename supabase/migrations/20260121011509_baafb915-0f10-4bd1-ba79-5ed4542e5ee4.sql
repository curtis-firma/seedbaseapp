-- Fix login by restoring SELECT access to demo_users table
-- The previous security fix broke login and session persistence

-- Drop the restrictive policy that blocks all reads
DROP POLICY IF EXISTS "Restrict direct table read" ON public.demo_users;

-- Restore the original public read policy for demo functionality
CREATE POLICY "Public demo read" 
  ON public.demo_users 
  FOR SELECT 
  USING (true);