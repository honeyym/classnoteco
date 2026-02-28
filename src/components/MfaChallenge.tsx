/**
 * MFA challenge screen — shown when user has MFA enrolled but hasn't verified this session.
 * User must enter the code from their authenticator app to reach aal2.
 */
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";
import ClassNoteLogo from "@/components/ClassNoteLogo";
import { Link } from "react-router-dom";

interface MfaChallengeProps {
  onSuccess: () => void;
}

export function MfaChallenge({ onSuccess }: MfaChallengeProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) throw listError;

      const totpFactor = factors?.totp?.[0];
      if (!totpFactor) {
        throw new Error("No authenticator app configured. Please contact support.");
      }

      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code: code.trim(),
      });
      if (verifyError) throw verifyError;

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-gradient-to-tl from-accent/15 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <ClassNoteLogo size="lg" />
          </Link>
        </div>

        <Card className="shadow-elevated border-0 bg-card/95 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader className="space-y-2 text-center pt-8 pb-2">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display font-bold tracking-tight">
              Two-factor authentication
            </CardTitle>
            <CardDescription className="text-base">
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="mfa-code">Verification code</Label>
                <Input
                  id="mfa-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="h-12 rounded-xl text-center text-lg tracking-[0.4em] font-mono bg-muted/50 border-border/60 focus:border-primary/50"
                  autoFocus
                  autoComplete="one-time-code"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive font-medium">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full h-12 gradient-primary hover:opacity-90 transition-all duration-300 rounded-xl font-semibold"
                disabled={isLoading || code.length < 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
