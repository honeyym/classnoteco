/**
 * MFA gate — checks AAL after login. If user has MFA enrolled but hasn't verified (aal1, next aal2),
 * shows MfaChallenge before rendering children. Otherwise renders children.
 */
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MfaChallenge } from "./MfaChallenge";

interface MfaGateProps {
  children: React.ReactNode;
}

export function MfaGate({ children }: MfaGateProps) {
  const { user } = useAuth();
  const [needsMfa, setNeedsMfa] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setNeedsMfa(false);
      return;
    }
    let cancelled = false;
    async function checkAal() {
      try {
        const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (error || cancelled) {
          if (!cancelled) setNeedsMfa(false);
          return;
        }
        // Show MFA challenge when user has aal2 available but hasn't verified this session
        const shouldChallenge =
          data?.nextLevel === "aal2" && data?.currentLevel !== data?.nextLevel;
        if (!cancelled) setNeedsMfa(shouldChallenge);
      } catch {
        if (!cancelled) setNeedsMfa(false);
      }
    }
    checkAal();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const handleMfaSuccess = () => {
    setNeedsMfa(false);
  };

  // Still determining AAL
  if (needsMfa === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse-soft text-primary font-medium">Loading...</div>
      </div>
    );
  }

  if (needsMfa) {
    return <MfaChallenge onSuccess={handleMfaSuccess} />;
  }

  return <>{children}</>;
}
