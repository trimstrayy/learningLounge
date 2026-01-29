-- ============================================
-- SUPERADMIN SETUP SCRIPT
-- ============================================
-- Run this in Supabase SQL Editor to grant superadmin access
-- to a specific user account.
--
-- Go to: https://supabase.com/dashboard/project/rlkdfbrpjlfygonecuth/sql/new
-- Paste and run this script after replacing the email.
-- ============================================

-- Replace the email below with the email of the account
-- you want to make a superadmin

DO $$
DECLARE
  admin_email TEXT := 'lexoraielts@gmail.com';  -- Lexora superadmin account
  admin_user_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email;

  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Make sure the account exists.', admin_email;
  END IF;

  -- Add super_admin role (ignore if already exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'super_admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Successfully granted super_admin role to user: %', admin_email;
END $$;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify the role was assigned:

SELECT 
  p.email,
  p.full_name,
  ur.role,
  ur.created_at as role_assigned_at
FROM user_roles ur
JOIN profiles p ON p.user_id = ur.user_id
WHERE ur.role = 'super_admin';
