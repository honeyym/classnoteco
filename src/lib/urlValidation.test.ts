import { describe, it, expect } from "vitest";
import { isValidSafeUrl, getSafeHref } from "./urlValidation";

describe("isValidSafeUrl", () => {
  it("allows https URLs", () => {
    expect(isValidSafeUrl("https://example.com")).toBe(true);
    expect(isValidSafeUrl("https://example.com/path?q=1")).toBe(true);
  });

  it("allows http URLs", () => {
    expect(isValidSafeUrl("http://example.com")).toBe(true);
  });

  it("allows mailto and tel", () => {
    expect(isValidSafeUrl("mailto:user@example.com")).toBe(true);
    expect(isValidSafeUrl("tel:+1234567890")).toBe(true);
  });

  it("rejects javascript: URLs", () => {
    expect(isValidSafeUrl("javascript:alert(1)")).toBe(false);
  });

  it("rejects data: URLs", () => {
    expect(isValidSafeUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
  });

  it("rejects vbscript: URLs", () => {
    expect(isValidSafeUrl("vbscript:msgbox(1)")).toBe(false);
  });

  it("rejects file: URLs", () => {
    expect(isValidSafeUrl("file:///etc/passwd")).toBe(false);
  });

  it("rejects blob: URLs", () => {
    expect(isValidSafeUrl("blob:https://example.com/uuid")).toBe(false);
  });

  it("trims whitespace before validating", () => {
    expect(isValidSafeUrl("  https://example.com  ")).toBe(true);
  });

  it("returns false for invalid URLs", () => {
    expect(isValidSafeUrl("not-a-url")).toBe(false);
    expect(isValidSafeUrl("")).toBe(false);
  });
});

describe("getSafeHref", () => {
  it("returns URL for safe links", () => {
    expect(getSafeHref("https://example.com")).toBe("https://example.com");
    expect(getSafeHref("http://example.com")).toBe("http://example.com");
  });

  it("returns null for dangerous protocols", () => {
    expect(getSafeHref("javascript:alert(1)")).toBe(null);
    expect(getSafeHref("data:text/html,<x>")).toBe(null);
  });

  it("returns null for null/undefined/empty", () => {
    expect(getSafeHref(null)).toBe(null);
    expect(getSafeHref(undefined)).toBe(null);
    expect(getSafeHref("")).toBe(null);
  });

  it("returns null for non-strings", () => {
    expect(getSafeHref(123 as unknown as string)).toBe(null);
  });
});
