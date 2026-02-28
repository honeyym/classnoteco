/**
 * Invisible Cloudflare Turnstile widget - runs in the background.
 * Obtain a free site key at https://dash.cloudflare.com/?to=/:account/turnstile
 */
import { Turnstile } from "@marsidev/react-turnstile";

interface TurnstileInvisibleProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

export function TurnstileInvisible({
  siteKey,
  onVerify,
  onError,
  onExpire,
}: TurnstileInvisibleProps) {
  return (
    <div className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden>
      <Turnstile
        siteKey={siteKey}
        options={{
          size: "invisible",
          execution: "render",
          appearance: "execute",
        }}
        onSuccess={onVerify}
        onError={onError}
        onExpire={onExpire}
      />
    </div>
  );
}
