-- Add premium status to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;

-- Create premium requests table
CREATE TABLE public.premium_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.premium_requests ENABLE ROW LEVEL SECURITY;

-- Students can view and create their own requests
CREATE POLICY "Users can view their own requests"
ON public.premium_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests"
ON public.premium_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Super admin can view all requests
CREATE POLICY "Super admin can view all requests"
ON public.premium_requests FOR SELECT
USING (has_role(auth.uid(), 'super_admin'));

-- Super admin can update requests (approve/reject)
CREATE POLICY "Super admin can update requests"
ON public.premium_requests FOR UPDATE
USING (has_role(auth.uid(), 'super_admin'));