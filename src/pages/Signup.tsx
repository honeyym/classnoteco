import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoTransparent from '@/assets/logo-transparent-clean.png';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle flex flex-col items-center justify-center p-3 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] bg-gradient-to-bl from-accent/15 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-[300px] h-[300px] bg-gradient-to-tr from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center mb-5">
          <Link to="/">
            <img src={logoTransparent} alt="ClassNote" className="h-10 w-auto" />
          </Link>
        </div>

        <Card className="shadow-elevated border-0 bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-accent via-primary to-accent" />
          
          <CardHeader className="space-y-1 text-center pt-5 pb-1 px-6">
            <div className="flex justify-center mb-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                Join free
              </div>
            </div>
            <CardTitle className="text-2xl font-display font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-sm">Join your classmates on ClassNote</CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-10 rounded-lg bg-muted/50 border-border/60 focus:border-primary/50 focus:bg-background transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 rounded-lg bg-muted/50 border-border/60 focus:border-primary/50 focus:bg-background transition-all text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-10 rounded-lg bg-muted/50 border-border/60 focus:border-primary/50 focus:bg-background transition-all text-sm"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-10 gradient-primary hover:opacity-90 transition-all duration-300 rounded-lg font-semibold text-sm btn-glow group mt-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-3 px-6 pb-5">
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-5">
          By signing up, you agree to learn collaboratively ✨
        </p>
      </div>
    </div>
  );
}
