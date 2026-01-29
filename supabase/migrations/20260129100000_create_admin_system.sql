-- Create teacher requests table for users who want to become consultancy_owners
CREATE TABLE IF NOT EXISTS public.teacher_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT,
  qualifications TEXT,
  experience TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_teacher_requests_user_id ON public.teacher_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_requests_status ON public.teacher_requests(status);
CREATE INDEX IF NOT EXISTS idx_teacher_requests_created_at ON public.teacher_requests(created_at DESC);

-- Enable RLS
ALTER TABLE public.teacher_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own teacher requests"
  ON public.teacher_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own requests
CREATE POLICY "Users can submit teacher requests"
  ON public.teacher_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Super admin can view all teacher requests
CREATE POLICY "Super admin can view all teacher requests"
  ON public.teacher_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Super admin can update teacher requests
CREATE POLICY "Super admin can update teacher requests"
  ON public.teacher_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Update feedback table to allow super_admin to view all feedback
CREATE POLICY "Super admin can view all feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Super admin can delete feedback
CREATE POLICY "Super admin can delete feedback"
  ON public.feedback FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Super admin can update feedback (for marking as reviewed, etc.)
CREATE POLICY "Super admin can update feedback"
  ON public.feedback FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Add reviewed fields to feedback table
ALTER TABLE public.feedback 
  ADD COLUMN IF NOT EXISTS is_reviewed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create trigger for updated_at on teacher_requests
CREATE TRIGGER set_teacher_requests_updated_at
  BEFORE UPDATE ON public.teacher_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comment
COMMENT ON TABLE public.teacher_requests IS 'Stores requests from users who want to become teachers/consultancy owners';
