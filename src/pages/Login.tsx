import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import logoTransparent from '@/assets/logo-transparent.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-gradient-to-tl from-accent/15 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link to="/">
            <img src={logoTransparent} alt="ClassNote" className="h-12 w-auto" />
          </Link>
        </div>

        <Card className="shadow-elevated border-0 bg-card/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          
          <CardHeader className="space-y-2 text-center pt-8 pb-2">
            <CardTitle className="text-3xl font-display font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-base">Enter your credentials to access your courses</CardDescription>
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
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl bg-muted/50 border-border/60 focus:border-primary/50 focus:bg-background transition-all"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 gradient-primary hover:opacity-90 transition-all duration-300 rounded-xl font-semibold text-base btn-glow group mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 px-8 pb-8">
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Where students connect and learn together
        </p>
      </div>
    </div>
  );
}
