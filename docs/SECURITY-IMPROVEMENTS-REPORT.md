# Security Improvements Report

A consolidated report of security-related changes implemented in the classnoteco project, drawn from commit history and implementation audit.

---

## 1. Authentication & Access Control

### 1.1 Cloudflare Turnstile

- **Login, Signup, Forgot Password** use Cloudflare Turnstile for bot protection.
- Tokens validated server-side via `authWithTurnstile.ts` before auth actions.
- Reduces credential stuffing and automated signup abuse.

### 1.2 Multi-Factor Authentication (MFA)

- MFA enrollment and management in **AccountSettings**.
- **MfaGate** enforces MFA when enabled; **MfaChallenge** collects TOTP codes.
- Supabase Auth MFA (TOTP) integrated.

### 1.3 Access Control

- **ProtectedRoute** redirects unauthenticated users from `/dashboard`, `/course/*`, etc. to `/login`.
- Access control tests in `src/__tests__/access-control.test.tsx`.

---

## 2. Input Validation & Injection Prevention

### 2.1 Zod Schema Validation

| Form / Feature | Schema | Location | Validates |
|---------------|--------|----------|-----------|
| **CreatePost** | `createPostSchemaSafe` | `src/schemas/post.ts` | content (1–5000 chars), link (URL + safe protocol), isAnonymous |
| **Signup** | `signupSchema` | `src/schemas/signup.ts` | name (1–100 chars), email (format + domain allowlist), password (min 8 chars) |
| **Chat send** | `sendChatMessageSchema` | `src/schemas/chat.ts` | content (1–5000 chars) |
| **Enrollment** | `courseIdSchema` | `src/schemas/enrollment.ts` | courseId (format + allowlist of known courses) |

Schemas enforce length limits, format checks, and where applicable, allowlists before data reaches Supabase.

### 2.2 URL Security

| Change | Location | Purpose |
|--------|----------|---------|
| **CreatePost link validation** | `src/schemas/post.ts` | Replaced permissive `new URL()` check with `isValidSafeUrl()`; blocks `javascript:`, `data:`, `vbscript:`, `file:`, `blob:`, `srcdoc:` |
| **PostDetail link rendering** | `src/pages/PostDetail.tsx` | `getSafeHref(post.link)` before use as `href`; dangerous protocols → anchor not rendered |
| **ResourceList links** | `src/components/ResourceList.tsx` | `getSafeHref(resource.url)` for shared resource URLs |

### 2.3 Signup Email Allowlist

- Replaced generic `.edu` check with strict domain allowlist:
  - `d.umn.edu`
  - `umn.edu`
  - `stthomas.edu`
  - `go.minnstate.edu`
- Domain matching is case-insensitive.

---

## 3. Container & Docker Security

### 3.1 Image Build & Registry

| Change | Details |
|--------|---------|
| **Remove `:latest` tag** | Images pushed only with versioned tags (`${{ github.ref_name }}`); no mutable `:latest` |
| **docker-compose** | Local image tag changed from `classnoteco-app:latest` to `classnoteco-app:dev` |
| **Cosign keyless signing** | Images signed by digest after push; uses GitHub OIDC (Sigstore); enables supply-chain verification |
| **Digest-based signing** | Signing uses `@${{ steps.build.outputs.digest }}` instead of tag to avoid race conditions |

### 3.2 Go Version

- Upgraded from Go 1.22 to **1.24.13** in `Dockerfile` and `go.mod` to address CVEs.

### 3.3 Build Secrets

- Supabase credentials passed via BuildKit `--secret` mounts; not stored in image layers or visible in `docker history`.

### 3.4 Runtime Hardening (docker-compose)

- `security_opt: no-new-privileges:true`
- `read_only: true` with `tmpfs: [/tmp]`
- `cap_drop: [ALL]`

---

## 4. CI/CD & Secret Scanning

### 4.1 Container Scanning

| Tool | Purpose |
|------|---------|
| **Trivy** | Vulnerability scan (CRITICAL, HIGH); SARIF upload to GitHub Security tab |
| **Dockle** | Container image lint for CIS alignment |

### 4.2 Secret Scanning

- **Pre-commit:** `scripts/secret-scan.sh` runs gitleaks to block commits with secrets.
- **CI:** Gitleaks and TruffleHog jobs in `.github/workflows/ci.yml`.
- Optional ggshield integration in secret-scan script (skips when auth not configured).

### 4.3 Security Linting & Scanning

- **ESLint:** `eslint-plugin-security` in `eslint.config.js` (with some rules turned off for noise).
- **Semgrep:** `.semgrep.yml` rules for hardcoded secrets, `eval()`, `innerHTML`; CI job runs `p/security-audit`.
- **npm audit:** CI job runs `npm audit --audit-level=high`; `lint:security` script combines lint + audit.

### 4.4 SBOM

- CI generates CycloneDX SBOM (`npm sbom`) and uploads as artifact.

### 4.5 Dockle Findings Addressed

| Finding | Resolution |
|---------|------------|
| **DKL-DI-0006** (avoid `latest` tag) | Removed `:latest`; use versioned tags only |
| **CIS-DI-0005** (content trust) | Cosign signing added; CIS-DI-0005 ignored (we use cosign, not DCT/Notary) |

---

## 5. Sensitive Data & Configuration

### 5.1 Secrets Removed from Repo

- `.env` containing Supabase configuration removed from repository (commit c823fd8).
- `.env.example` and `.gitignore` updated to exclude `.env` files.

### 5.2 Cookie Security

- Sidebar cookie settings updated with `SameSite` attribute for CSRF mitigation (commit c502074).

### 5.3 Code Obfuscation

- Obfuscation configuration file added for code protection (commit 9415c26).

---

## 6. Observability & Error Tracking

### 6.1 Sentry

- Sentry integrated for error monitoring and performance tracking.
- Helps detect and investigate production issues.

---

## 7. Existing Protections (Reference)

### 7.1 Server-Side

- Supabase parameterized queries; no raw SQL from user input.
- DB triggers for length and format (e.g. `course_id` regex).
- FK constraint on `enrollments.course_id` → `courses.id`.

### 7.2 Client-Side

- React default escaping for text content.
- URL validation via `urlValidation.ts` (blocklist of unsafe protocols).

---

## 8. Summary Checklist

| Area | Status |
|------|--------|
| **Authentication** | |
| Cloudflare Turnstile (login, signup, forgot password) | ✅ |
| MFA enrollment and challenge | ✅ |
| ProtectedRoute access control | ✅ |
| **Input Validation** | |
| Zod schemas for CreatePost, Signup, Chat send | ✅ |
| Zod for enrollment courseId (allowlist) | ✅ |
| Email domain allowlist for signup | ✅ |
| CreatePost link: `isValidSafeUrl` | ✅ |
| PostDetail, ResourceList: `getSafeHref` | ✅ |
| **Containers** | |
| No `:latest` tag | ✅ |
| Cosign image signing | ✅ |
| Go 1.24.13 (CVE fixes) | ✅ |
| Trivy + Dockle in CI | ✅ |
| BuildKit secrets (no secrets in layers) | ✅ |
| docker-compose runtime hardening | ✅ |
| **CI/CD & Scanning** | |
| Gitleaks (pre-commit + CI) | ✅ |
| TruffleHog (CI) | ✅ |
| Secret scanning script (gitleaks + ggshield) | ✅ |
| eslint-plugin-security | ✅ |
| Semgrep (CI) | ✅ |
| npm audit (CI) | ✅ |
| SBOM generation (CI) | ✅ |
| **Sensitive Data** | |
| .env removed from repo | ✅ |
| Sidebar cookie SameSite | ✅ |

---

*Report generated from project security documentation, implementation audit, and commit history.*
