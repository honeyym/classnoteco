// Deno runtime types for Supabase Edge Functions
// https://supabase.com/docs/guides/functions
interface DenoEnv {
  get(key: string): string | undefined;
}

interface DenoServe {
  (handler: (req: Request) => Response | Promise<Response>): void;
}

declare global {
  const Deno: {
    env: DenoEnv;
    serve: DenoServe;
  };
}
export {};
