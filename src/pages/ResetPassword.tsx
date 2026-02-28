import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ClassNoteLogo from '@/components/ClassNoteLogo';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is a valid recovery link
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setIsValidLink(true);
    }

    // Also listen for auth events for the recovery flow
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidLink(true);
      }
    });

    setChecking(false);

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setIsSuccess(true);
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft text-primary font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-gradient-to-tl from-accent/15 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center mb-8">
          <Link to="/">
            <ClassNoteLogo size="lg" />
          </Link>
        </div>

        <Card className="shadow-elevated border-0 bg-card/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

          {isSuccess ? (
            <CardHeader className="space-y-4 text-center py-12">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display font-bold">Password updated!</CardTitle>
              <CardDescription className="text-base">
                Redirecting you to sign in...
              </CardDescription>
            </CardHeader>
          ) : !isValidLink ? (
            <CardHeader className="space-y-4 text-center py-12">
              <CardTitle className="text-2xl font-display font-bold">Invalid or expired link</CardTitle>
              <CardDescription className="text-base">
                This password reset link is invalid or has expired.{' '}
                <Link to="/forgot-password" className="text-primary hover:text-primary/80 font-semibold">
                  Request a new one
                </Link>
              </CardDescription>
            </CardHeader>
          ) : (
            <>
              <CardHeader className="space-y-2 text-center pt-8 pb-2">
                <CardTitle className="text-3xl font-display font-bold tracking-tight">Set new password</CardTitle>
                <CardDescription className="text-base">Enter your new password below</CardDescription>
              </CardHeader>

              <CardContent className="px-8 pt-6 pb-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-12 rounded-xl bg-muted/50 border-border/60 focus:border-primary/50 focus:bg-background transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-12 rounded-xl bg-muted/50 border-border/60 focus:border-primary/50 focus:bg-background transition-all"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 gradient-primary hover:opacity-90 transition-all duration-300 rounded-xl font-semibold text-base btn-glow mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update password'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
