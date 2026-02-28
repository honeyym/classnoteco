import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatePost from "./CreatePost";

describe("CreatePost", () => {
  const mockOnPost = vi.fn();

  beforeEach(() => {
    mockOnPost.mockReset();
  });

  it("renders form elements", () => {
    render(<CreatePost courseId="cisc200" onPost={mockOnPost} />);
    expect(screen.getByPlaceholderText(/What's on your mind/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Attach a link/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Post/i })).toBeInTheDocument();
  });

  it("disables submit when content is empty", () => {
    render(<CreatePost courseId="cisc200" onPost={mockOnPost} />);
    expect(screen.getByRole("button", { name: /Post/i })).toBeDisabled();
  });

  it("enables submit when content is entered", () => {
    render(<CreatePost courseId="cisc200" onPost={mockOnPost} />);
    fireEvent.change(screen.getByPlaceholderText(/What's on your mind/), {
      target: { value: "Hello class!" },
    });
    expect(screen.getByRole("button", { name: /Post/i })).not.toBeDisabled();
  });

  it("calls onPost with content and anonymous flag on submit", async () => {
    mockOnPost.mockResolvedValue({ error: null });
    render(<CreatePost courseId="cisc200" onPost={mockOnPost} />);

    fireEvent.change(screen.getByPlaceholderText(/What's on your mind/), {
      target: { value: "Test post" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() => {
      expect(mockOnPost).toHaveBeenCalledWith("Test post", false, undefined);
    });
  });

  it("calls onPost with link when provided", async () => {
    mockOnPost.mockResolvedValue({ error: null });
    render(<CreatePost courseId="cisc200" onPost={mockOnPost} />);

    fireEvent.change(screen.getByPlaceholderText(/What's on your mind/), {
      target: { value: "Check this out" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Attach a link/), {
      target: { value: "https://example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    await waitFor(() => {
      expect(mockOnPost).toHaveBeenCalledWith("Check this out", false, "https://example.com");
    });
  });

  it("shows toast when link is invalid", () => {
    render(<CreatePost courseId="cisc200" onPost={mockOnPost} />);

    fireEvent.change(screen.getByPlaceholderText(/What's on your mind/), {
      target: { value: "Post with bad link" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Attach a link/), {
      target: { value: "not-a-valid-url" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Post/i }));

    expect(mockOnPost).not.toHaveBeenCalled();
  });
});
