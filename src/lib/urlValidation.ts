/**
 * Blocklist of dangerous URL protocols that can execute script or access local resources.
 * Allows http, https, mailto, tel, and other safe schemes.
 */
const BLOCKED_PROTOCOLS = [
  "javascript:",
  "vbscript:",
  "data:",
  "file:",
  "blob:",
  "srcdoc:",
].map((p) => p.toLowerCase());

export function isValidSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return !BLOCKED_PROTOCOLS.includes(parsed.protocol.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Returns a safe href for rendering, or null if the URL is dangerous.
 * Use when displaying user-provided links (e.g. from the database).
 */
export function getSafeHref(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  return isValidSafeUrl(url) ? url.trim() : null;
}
