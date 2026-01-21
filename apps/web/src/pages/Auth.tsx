import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const feedbackSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  consultancy: z.string().max(200).optional(),
  contact: z.string().max(100).optional(),
  message: z.string().trim().min(10, { message: 'Message must be at least 10 characters' }).max(1000),
});

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, signIn, signUp, resetPassword, updatePassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  
  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // New password state (for password reset flow)
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetErrors, setResetErrors] = useState<Record<string, string>>({});

  // Feedback form state
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackConsultancy, setFeedbackConsultancy] = useState('');
  const [feedbackContact, setFeedbackContact] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackErrors, setFeedbackErrors] = useState<Record<string, string>>({});
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [pendingLoginUser, setPendingLoginUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'reset') {
      setIsResetMode(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && !loading && !isResetMode && !showFeedbackDialog) {
      navigate('/');
    }
  }, [user, loading, navigate, isResetMode, showFeedbackDialog]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});
    
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setLoginErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const { error, data } = await signIn(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Please confirm your email before logging in');
      } else {
        toast.error(error.message);
      }
    } else if (data?.user) {
      // Check if user has already submitted feedback
      const { data: existingFeedback } = await supabase
        .from('user_feedback')
        .select('id')
        .eq('user_id', data.user.id)
        .limit(1);
      
      if (!existingFeedback || existingFeedback.length === 0) {
        // Show feedback form for first-time login
        setPendingLoginUser({ id: data.user.id, email: data.user.email || loginEmail });
        setShowFeedbackDialog(true);
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});
    
    const result = signupSchema.safeParse({
      fullName: signupName,
      email: signupEmail,
      password: signupPassword,
      confirmPassword: signupConfirmPassword,
    });
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setSignupErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const role = isTeacher ? 'consultancy_owner' : 'student';
    const { error } = await signUp(signupEmail, signupPassword, signupName, role);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email already exists');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Account created successfully!');
      navigate('/');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackErrors({});

    const result = feedbackSchema.safeParse({
      name: feedbackName,
      consultancy: feedbackConsultancy || undefined,
      contact: feedbackContact || undefined,
      message: feedbackMessage,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFeedbackErrors(errors);
      return;
    }

    if (!pendingLoginUser) return;

    setIsSubmittingFeedback(true);
    const { error } = await supabase.from('user_feedback').insert({
      user_id: pendingLoginUser.id,
      email: pendingLoginUser.email,
      name: feedbackName.trim(),
      consultancy: feedbackConsultancy.trim() || null,
      contact: feedbackContact.trim() || null,
      message: feedbackMessage.trim(),
    });
    setIsSubmittingFeedback(false);

    if (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } else {
      toast.success('Thank you for your feedback!');
      setShowFeedbackDialog(false);
      navigate('/');
    }
  };

  const handleSkipFeedback = () => {
    setShowFeedbackDialog(false);
    toast.success('Welcome back!');
    navigate('/');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail || !z.string().email().safeParse(forgotEmail).success) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSendingReset(true);
    const { error } = await resetPassword(forgotEmail);
    setIsSendingReset(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password reset link sent! Check your email.');
      setForgotDialogOpen(false);
      setForgotEmail('');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrors({});

    const result = resetPasswordSchema.safeParse({
      password: newPassword,
      confirmPassword: confirmNewPassword,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setResetErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const { error } = await updatePassword(newPassword);
    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully!');
      setIsResetMode(false);
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Password reset mode
  if (isResetMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
        <Card className="w-full max-w-md shadow-lg border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img src="/logo.jpg" alt="Lexora Logo" className="h-12 w-auto" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Set New Password
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Enter your new password below
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={resetErrors.password ? 'border-destructive' : ''}
                />
                {resetErrors.password && (
                  <p className="text-sm text-destructive">{resetErrors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={resetErrors.confirmPassword ? 'border-destructive' : ''}
                />
                {resetErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{resetErrors.confirmPassword}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <Card className={`w-full max-w-md shadow-lg border-border/50 ${isTeacher ? 'border-red-500 bg-red-50' : ''}`}>
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/mock-tests')}
              className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg p-2"
            >
              <img src="/logo.jpg" alt="Lexora Logo" className="h-12 w-auto" />
            </button>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              IELTS Practice Hub
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Sign in to access your practice tests and track your progress
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className={loginErrors.email ? 'border-destructive' : ''}
                    />
                    {loginErrors.email && (
                      <p className="text-sm text-destructive">{loginErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Dialog open={forgotDialogOpen} onOpenChange={setForgotDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="link" className="px-0 h-auto text-xs">
                            Forgot password?
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reset Password</DialogTitle>
                            <DialogDescription>
                              Enter your email address and we'll send you a link to reset your password.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="forgot-email">Email</Label>
                              <Input
                                id="forgot-email"
                                type="email"
                                placeholder="your@email.com"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                              />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSendingReset}>
                              {isSendingReset ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                'Send Reset Link'
                              )}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={loginErrors.password ? 'border-destructive' : ''}
                    />
                    {loginErrors.password && (
                      <p className="text-sm text-destructive">{loginErrors.password}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-4">
                <div className="flex items-center justify-start space-x-2">
                  <Switch
                    id="teacher-mode"
                    checked={isTeacher}
                    onCheckedChange={setIsTeacher}
                  />
                  <Label htmlFor="teacher-mode">Register as Teacher</Label>
                </div>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className={signupErrors.fullName ? 'border-destructive' : ''}
                    />
                    {signupErrors.fullName && (
                      <p className="text-sm text-destructive">{signupErrors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className={signupErrors.email ? 'border-destructive' : ''}
                    />
                    {signupErrors.email && (
                      <p className="text-sm text-destructive">{signupErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className={signupErrors.password ? 'border-destructive' : ''}
                    />
                    {signupErrors.password && (
                      <p className="text-sm text-destructive">{signupErrors.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className={signupErrors.confirmPassword ? 'border-destructive' : ''}
                    />
                    {signupErrors.confirmPassword && (
                      <p className="text-sm text-destructive">{signupErrors.confirmPassword}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={(open) => !open && handleSkipFeedback()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome! We'd love your feedback</DialogTitle>
            <DialogDescription>
              Help us improve by sharing a bit about yourself. This is optional.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-email">Email</Label>
              <Input
                id="feedback-email"
                type="email"
                value={pendingLoginUser?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-name">Your Name *</Label>
              <Input
                id="feedback-name"
                type="text"
                placeholder="John Doe"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                className={feedbackErrors.name ? 'border-destructive' : ''}
              />
              {feedbackErrors.name && (
                <p className="text-sm text-destructive">{feedbackErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-consultancy">Consultancy (if any)</Label>
              <Input
                id="feedback-consultancy"
                type="text"
                placeholder="Your consultancy name"
                value={feedbackConsultancy}
                onChange={(e) => setFeedbackConsultancy(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-contact">Contact (email or phone)</Label>
              <Input
                id="feedback-contact"
                type="text"
                placeholder="Alternative contact"
                value={feedbackContact}
                onChange={(e) => setFeedbackContact(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-message">Your Feedback *</Label>
              <Textarea
                id="feedback-message"
                placeholder="Tell us about your experience or suggestions..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className={feedbackErrors.message ? 'border-destructive' : ''}
                rows={3}
              />
              {feedbackErrors.message && (
                <p className="text-sm text-destructive">{feedbackErrors.message}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={handleSkipFeedback}>
                Skip
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmittingFeedback}>
                {isSubmittingFeedback ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
