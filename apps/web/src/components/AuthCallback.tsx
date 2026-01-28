import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * This component listens for Supabase auth events and handles
 * email verification redirects, showing appropriate messages.
 */
export function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    // Check if there are auth tokens in the URL hash (email verification, magic link, etc.)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');

    // Prevent duplicate handling
    if (hasHandledRef.current) return;

    // Handle error from Supabase
    if (error) {
      hasHandledRef.current = true;
      toast.error(errorDescription || 'Authentication failed');
      // Clean up the URL
      window.history.replaceState({}, '', location.pathname);
      return;
    }

    // Handle recovery type - redirect to reset password page BEFORE Supabase processes hash
    if (accessToken && type === 'recovery') {
      hasHandledRef.current = true;
      // If not on reset-password page, redirect there WITH the hash
      if (!location.pathname.includes('/auth/reset-password')) {
        // Navigate to reset password page, keeping the hash for processing
        navigate('/auth/reset-password' + window.location.hash, { replace: true });
        return;
      }
      // If already on reset-password page, let that component handle everything
      return;
    }

    // Handle successful auth callback (email verification, magic link, etc.)
    if (accessToken && type) {
      hasHandledRef.current = true;
      
      // The supabase client with detectSessionInUrl: true will automatically handle the session
      // We just need to show the appropriate message and redirect
      
      if (type === 'signup' || type === 'email' || type === 'magiclink') {
        // Show success message
        toast.success('Email verified successfully! Welcome to LoungeLearning!', {
          duration: 5000,
        });
        
        // Clean up the URL hash
        window.history.replaceState({}, '', location.pathname);
        
        // If not on home page, redirect there
        if (location.pathname !== '/') {
          navigate('/', { replace: true });
        }
      }
    }
  }, [location, navigate]);

  // Listen for auth state changes - specifically for PASSWORD_RECOVERY event
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Handle PASSWORD_RECOVERY event - redirect to reset password page
      if (event === 'PASSWORD_RECOVERY' && session) {
        if (!location.pathname.includes('/auth/reset-password')) {
          navigate('/auth/reset-password', { replace: true });
        }
      }
      
      if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
        // Check if this is from email verification (user just confirmed)
        const isNewConfirmation = session.user.email_confirmed_at && 
          new Date(session.user.email_confirmed_at).getTime() > Date.now() - 60000; // Within last minute
        
        if (isNewConfirmation && !hasHandledRef.current) {
          // Don't show duplicate toasts
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [location, navigate]);

  return null;
}
