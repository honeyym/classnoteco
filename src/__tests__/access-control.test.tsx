/**
 * Access control test suite.
 * Verifies client-side auth gates (ProtectedRoute) and data access patterns.
 * RLS is enforced server-side; these tests document expected behavior.
 *
 * For full RLS integration tests with local Supabase:
 *   supabase start
 *   npm run test -- src/__tests__/access-control.test.tsx
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { renderHook, waitFor as waitForHook } from "@testing-library/react";
import App from "@/App";
import { useEnrollments } from "@/hooks/useEnrollments";
import type { ReactNode } from "react";

const mockGetSession = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockEq = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: () => mockGetSession(),
      onAuthStateChange: () =>
        mockOnAuthStateChange() ?? {
          data: { subscription: { unsubscribe: vi.fn() } },
        },
    },
    from: vi.fn((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: mockEq.mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        insert: vi.fn().mockResolvedValue({ error: null }),
        update: vi.fn().mockReturnThis(),
      };
      mockEq.mockReturnThis();
      return chain;
    }),
  },
}));

// AuthProvider needs useAuth - we're using real AuthContext with mocked supabase
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
}

describe("Access control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  describe("ProtectedRoute (auth gate)", () => {
    it("redirects unauthenticated users from /dashboard to /login", async () => {
      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /Welcome back/i })).toBeInTheDocument();
      });
      expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
    });

    it("redirects unauthenticated users from /course/:id to /login", async () => {
      render(
        <MemoryRouter initialEntries={["/course/cisc200"]}>
          <App />
        </MemoryRouter>
      );

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

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      );

      await waitFor(
        () => {
          expect(screen.getByText(/Your.*Courses/i)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("useEnrollments (enrollment data access)", () => {
    it("filters enrollments by user_id (RLS-equivalent client pattern)", async () => {
      mockGetSession.mockResolvedValue({
        data: {
          session: {
            user: {
              id: "user-123",
              email: "test@edu",
              user_metadata: { name: "Test" },
            },
            access_token: "t",
            refresh_token: "r",
          },
        },
      });

      const { result } = renderHook(() => useEnrollments(), {
        wrapper: ({ children }) => (
          <MemoryRouter>
            <App />
          </MemoryRouter>
        ) as React.FunctionComponent<{ children: ReactNode }>,
      });

      // Hook needs AuthProvider - wrap with App which has it
      // useEnrollments is used inside Course/Dashboard. Render App at /dashboard to trigger.
      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockEq).toHaveBeenCalled();
      });

      // useEnrollments fetches with .eq('user_id', user.id)
      const enrollmentsCall = mockEq.mock.calls.find(
        (call: unknown[]) => call[0] === "user_id"
      );
      expect(enrollmentsCall).toBeDefined();
    });
  });
});
