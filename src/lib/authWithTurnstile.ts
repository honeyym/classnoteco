/**
 * Auth operations that go through Turnstile-protected Edge Function.
 * Used when VITE_TURNSTILE_SITE_KEY is set.
 */
import { supabase } from "@/integrations/supabase/client";

export async function signInWithTurnstile(
  email: string,
  password: string,
  token: string
): Promise<void> {
  const { data, error } = await supabase.functions.invoke("auth-with-turnstile", {
    body: { action: "signin", token, email, password },
  });

  if (error) throw error;

  const err = (data as { error?: string })?.error;
  if (err) throw new Error(err);

  const sessionData = data as {
    access_token?: string;
    refresh_token?: string;
    user?: unknown;
  };
  if (sessionData?.access_token && sessionData?.refresh_token) {
    await supabase.auth.setSession({
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
    });
  }
}

export async function signUpWithTurnstile(
  email: string,
  password: string,
  name: string,
  token: string
): Promise<void> {
  const { data, error } = await supabase.functions.invoke("auth-with-turnstile", {
    body: { action: "signup", token, email, password, name },
  });

  if (error) throw error;

  const err = (data as { error?: string })?.error;
  if (err) throw new Error(err);
}

export async function resetPasswordWithTurnstile(
  email: string,
  token: string
): Promise<void> {
  const redirectTo = `${window.location.origin}/reset-password`;

  const { data, error } = await supabase.functions.invoke("auth-with-turnstile", {
    body: { action: "recover", token, email, redirectTo },
  });

  if (error) throw error;

  const err = (data as { error?: string })?.error;
  if (err) throw new Error(err);
}
