import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ClassNoteLogo from '@/components/ClassNoteLogo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send reset email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center mb-8">
          <Link to="/">
            <ClassNoteLogo size="lg" />
          </Link>
        </div>

        <Card className="shadow-elevated border-0 bg-card/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

          {sent ? (
            <>
              <CardHeader className="space-y-2 text-center pt-8 pb-2">
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-display font-bold">Check your email</CardTitle>
                <CardDescription className="text-base">
                  We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col gap-4 px-8 pb-8 pt-4">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </Button>
                </Link>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="space-y-2 text-center pt-8 pb-2">
                <CardTitle className="text-3xl font-display font-bold tracking-tight">Forgot password?</CardTitle>
                <CardDescription className="text-base">Enter your email and we'll send you a reset link</CardDescription>
              </CardHeader>

              <CardContent className="px-8 pt-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
                        Sending...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 px-8 pb-8">
                <Link to="/login" className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to sign in
                </Link>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
