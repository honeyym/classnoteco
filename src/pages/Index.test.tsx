import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Index from "./Index";

function renderIndex() {
  return render(
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Index />
    </BrowserRouter>
  );
}

describe("Index", () => {
  it("renders hero heading", () => {
    renderIndex();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Discuss, learn, and succeed/);
  });

  it("renders sign up and log in links", () => {
    renderIndex();
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/signup");
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
  });

  it("renders Get started CTA", () => {
    renderIndex();
    expect(screen.getByRole("link", { name: /get started free/i })).toHaveAttribute("href", "/signup");
  });

  it("renders feature cards", () => {
    renderIndex();
    expect(screen.getByText(/Course Discussions/)).toBeInTheDocument();
    expect(screen.getByText(/Stay Anonymous/)).toBeInTheDocument();
    expect(screen.getByText(/Real-time Chat/)).toBeInTheDocument();
  });
});
