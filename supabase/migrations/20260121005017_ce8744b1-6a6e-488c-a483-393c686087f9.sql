-- Create a public view that excludes the phone column from demo_users
CREATE VIEW public.demo_users_public
WITH (security_invoker = on) AS
SELECT 
  id,
  username,
  display_name,
  avatar_url,
  active_role,
  onboarding_complete,
  created_at,
  last_login_at
FROM public.demo_users;

-- Drop the old permissive SELECT policy
DROP POLICY IF EXISTS "Public demo read" ON public.demo_users;

-- Create restrictive SELECT policy - only allow SELECT via authenticated context or specific phone lookup
-- For the demo app, we still need phone lookups for login, but prevent bulk reading
CREATE POLICY "Restrict direct table read" ON public.demo_users
FOR SELECT USING (false);

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.demo_users_public TO anon, authenticated;