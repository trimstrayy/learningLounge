import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface TeacherRequest {
  id: string;
  user_id: string;
  reason: string | null;
  qualifications: string | null;
  experience: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  user_email?: string;
  user_name?: string;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string;
  rating: number;
  user_id: string | null;
  is_reviewed: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTeachers: number;
  totalPremiumUsers: number;
  pendingTeacherRequests: number;
  pendingPremiumRequests: number;
  totalFeedback: number;
  unreviewedFeedback: number;
  averageRating: number;
}

// Fetch admin dashboard stats
export function useAdminStats() {
  const { role } = useAuth();

  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      // Total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Total teachers (consultancy_owners)
      const { count: totalTeachers } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'consultancy_owner');

      // Premium users
      const { count: totalPremiumUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_premium', true);

      // Pending teacher requests
      const { count: pendingTeacherRequests } = await supabase
        .from('teacher_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Pending premium requests
      const { count: pendingPremiumRequests } = await supabase
        .from('premium_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Total feedback
      const { count: totalFeedback } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true });

      // Unreviewed feedback
      const { count: unreviewedFeedback } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })
        .eq('is_reviewed', false);

      // Average rating
      const { data: ratings } = await supabase
        .from('feedback')
        .select('rating');
      
      const averageRating = ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
        : 0;

      return {
        totalUsers: totalUsers ?? 0,
        totalTeachers: totalTeachers ?? 0,
        totalPremiumUsers: totalPremiumUsers ?? 0,
        pendingTeacherRequests: pendingTeacherRequests ?? 0,
        pendingPremiumRequests: pendingPremiumRequests ?? 0,
        totalFeedback: totalFeedback ?? 0,
        unreviewedFeedback: unreviewedFeedback ?? 0,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    },
    enabled: role === 'super_admin',
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

// Fetch all teacher requests
export function useAllTeacherRequests() {
  const { role } = useAuth();

  return useQuery({
    queryKey: ['all-teacher-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles for display
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) ?? []);

      return data.map(request => ({
        ...request,
        user_email: profileMap.get(request.user_id)?.email,
        user_name: profileMap.get(request.user_id)?.full_name,
      })) as TeacherRequest[];
    },
    enabled: role === 'super_admin',
  });
}

// Review teacher request
export function useReviewTeacherRequest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      requestId, 
      userId, 
      approved, 
      adminNotes 
    }: { 
      requestId: string; 
      userId: string; 
      approved: boolean;
      adminNotes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Update request status
      const { error: requestError } = await supabase
        .from('teacher_requests')
        .update({
          status: approved ? 'approved' : 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes || null,
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // If approved, add consultancy_owner role
      if (approved) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'consultancy_owner' });

        // Ignore if role already exists
        if (roleError && !roleError.message.includes('duplicate')) {
          throw roleError;
        }
      }

      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['all-teacher-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: variables.approved ? 'Request Approved' : 'Request Rejected',
        description: variables.approved 
          ? 'User has been granted teacher privileges.' 
          : 'The teacher request has been rejected.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Fetch all feedback
export function useAllFeedback() {
  const { role } = useAuth();

  return useQuery({
    queryKey: ['all-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FeedbackItem[];
    },
    enabled: role === 'super_admin',
  });
}

// Mark feedback as reviewed
export function useReviewFeedback() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      feedbackId, 
      adminNotes 
    }: { 
      feedbackId: string; 
      adminNotes?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('feedback')
        .update({
          is_reviewed: true,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes || null,
        })
        .eq('id', feedbackId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-feedback'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: 'Feedback Reviewed',
        description: 'Feedback has been marked as reviewed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Delete feedback
export function useDeleteFeedback() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feedbackId: string) => {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-feedback'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: 'Feedback Deleted',
        description: 'Feedback has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Submit teacher request (for users)
export function useSubmitTeacherRequest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      reason, 
      qualifications, 
      experience 
    }: { 
      reason: string; 
      qualifications: string; 
      experience: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('teacher_requests')
        .insert({
          user_id: user.id,
          reason,
          qualifications,
          experience,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-teacher-requests'] });
      toast({
        title: 'Request Submitted',
        description: 'Your teacher application has been submitted for review.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

// Get user's own teacher requests
export function useMyTeacherRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['my-teacher-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('teacher_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TeacherRequest[];
    },
    enabled: !!user,
  });
}
