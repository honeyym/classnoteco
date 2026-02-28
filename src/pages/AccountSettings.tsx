/**
 * Account settings — MFA enrollment and management.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, ShieldOff, Loader2, Copy, Check } from "lucide-react";
import ClassNoteLogo from "@/components/ClassNoteLogo";
import { useToast } from "@/hooks/use-toast";

type MfaStatus = "loading" | "enabled" | "disabled" | "enrolling";

export default function AccountSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [mfaStatus, setMfaStatus] = useState<MfaStatus>("loading");
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function checkMfa() {
      const { data, error: listError } = await supabase.auth.mfa.listFactors();
      if (listError) {
        setMfaStatus("disabled");
        return;
      }
      setMfaStatus((data?.totp?.length ?? 0) > 0 ? "enabled" : "disabled");
    }
    checkMfa();
  }, []);

  const startEnrollment = async () => {
    setError("");
    try {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      });
      if (enrollError) throw enrollError;
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setMfaStatus("enrolling");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start enrollment");
    }
  };

  const completeEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const { error: challengeError, data: challenge } = await supabase.auth.mfa.challenge({
        factorId,
      });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: verifyCode.trim(),
      });
      if (verifyError) throw verifyError;

      setMfaStatus("enabled");
      setFactorId("");
      setQrCode("");
      setSecret("");
      setVerifyCode("");
      toast({
        title: "MFA enabled",
        description: "Your account is now protected with two-factor authentication.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEnrollment = () => {
    setMfaStatus("disabled");
    setFactorId("");
    setQrCode("");
    setSecret("");
    setVerifyCode("");
    setError("");
  };

  const unenrollMfa = async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    const totp = data?.totp?.[0];
    if (!totp) return;
    setError("");
    try {
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: totp.id });
      if (unenrollError) throw unenrollError;
      setMfaStatus("disabled");
      toast({
        title: "MFA disabled",
        description: "Two-factor authentication has been removed from your account.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable MFA");
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/8 via-accent/4 to-transparent rounded-full blur-3xl pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border/50 bg-card shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <ClassNoteLogo size="sm" />
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-3xl font-display font-bold mb-2">Account settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account security for {user?.email}
        </p>

        <Card className="rounded-2xl border-border/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Two-factor authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security with an authenticator app (Google Authenticator, Authy, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mfaStatus === "loading" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking MFA status...</span>
              </div>
            )}

            {mfaStatus === "enabled" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-medium">MFA is enabled</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your account is protected. You'll be asked for a verification code when signing in.
                </p>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={unenrollMfa}
                >
                  <ShieldOff className="w-4 h-4 mr-2" />
                  Disable MFA
                </Button>
              </div>
            )}

            {mfaStatus === "disabled" && !qrCode && (
              <Button onClick={startEnrollment} className="gradient-primary">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Enable two-factor authentication
              </Button>
            )}

            {mfaStatus === "enrolling" && qrCode && (
              <form onSubmit={completeEnrollment} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Scan this QR code with your authenticator app, or enter the secret manually:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="p-4 rounded-xl bg-white inline-block">
                    {qrCode.startsWith("data:") ? (
                      <img src={qrCode} alt="Scan with authenticator app" className="w-48 h-48" />
                    ) : (
                      <div
                        className="w-48 h-48 [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: qrCode }}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Secret key (if you can't scan)</Label>
                    <div className="flex gap-2">
                      <code className="flex-1 px-3 py-2 rounded-lg bg-muted text-sm font-mono break-all">
                        {secret}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={copySecret}
                        className="shrink-0"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verify-code">Enter the 6-digit code from your app</Label>
                  <Input
                    id="verify-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    placeholder="000000"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                    className="w-32 font-mono tracking-widest"
                    autoComplete="one-time-code"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting || verifyCode.length < 6}>
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Enable MFA
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEnrollment}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
