/**
 * Access control test suite.
 * Verifies client-side auth gates (ProtectedRoute). RLS is enforced server-side.
 *
 * For full RLS integration tests with local Supabase:
 *   supabase start
 *   npm run test -- src/__tests__/access-control.test.tsx
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "@/App";

const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();

// Initial route for each test (set in beforeEach)
let initialEntries = ["/"];

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    ),
  };
});

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      onAuthStateChange: () =>
        mockOnAuthStateChange() ?? {
          data: { subscription: { unsubscribe: vi.fn() } },
        },
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn().mockReturnThis(),
    })),
  },
}));

describe("Access control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    initialEntries = ["/"];
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  describe("ProtectedRoute (auth gate)", () => {
    it("redirects unauthenticated users from /dashboard to /login", async () => {
      initialEntries = ["/dashboard"];
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /Welcome back/i })).toBeInTheDocument();
      });
      expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
    });

    it("redirects unauthenticated users from /course/:id to /login", async () => {
      initialEntries = ["/course/cisc200"];
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /Welcome back/i })).toBeInTheDocument();
      });
    });

    it("allows authenticated users to access /dashboard", async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: {
              id: "user-1",
              email: "test@university.edu",
              user_metadata: { name: "Test User" },
            },
            access_token: "token",
            refresh_token: "refresh",
          },
        },
      });

      initialEntries = ["/dashboard"];
      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText(/Your.*Courses/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("PublicRoute (logged-in redirect)", () => {
    it("redirects authenticated users from /login to /dashboard", async () => {
      initialEntries = ["/login"];
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: {
              id: "user-1",
              email: "test@edu",
              user_metadata: { name: "Test" },
            },
            access_token: "t",
            refresh_token: "r",
          },
        },
      });

      render(<App />);

      await waitFor(
        () => {
          expect(screen.getByText(/Your.*Courses/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });
});
