import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostCard from "./PostCard";
import type { DbPost } from "@/hooks/usePosts";

const mockPost: DbPost = {
  id: "post-1",
  course_id: "cisc200",
  user_id: "user-1",
  author_name: "Jane Doe",
  is_anonymous: false,
  content: "This is a test post content for the course.",
  link: null,
  likes: 5,
  dislikes: 0,
  hearts: 2,
  created_at: new Date().toISOString(),
};

describe("PostCard", () => {
  it("renders post content", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} courseId="cisc200" />
      </MemoryRouter>
    );
    expect(screen.getByText(mockPost.content)).toBeInTheDocument();
  });

  it("renders author name when not anonymous", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} courseId="cisc200" />
      </MemoryRouter>
    );
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("renders Anonymous when post is anonymous", () => {
    const anonymousPost = { ...mockPost, is_anonymous: true };
    render(
      <MemoryRouter>
        <PostCard post={anonymousPost} courseId="cisc200" />
      </MemoryRouter>
    );
    expect(screen.getByText("Anonymous")).toBeInTheDocument();
  });

  it("renders likes and hearts count", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} courseId="cisc200" />
      </MemoryRouter>
    );
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("links to post detail page", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} courseId="cisc200" />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: new RegExp(mockPost.content) });
    expect(link).toHaveAttribute("href", "/course/cisc200/post/post-1");
  });

  it("calls onToggleSave when save button clicked", () => {
    const onToggleSave = vi.fn();
    render(
      <MemoryRouter>
        <PostCard post={mockPost} courseId="cisc200" onToggleSave={onToggleSave} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByLabelText("Save post"));
    expect(onToggleSave).toHaveBeenCalledWith("post-1");
  });

  it("shows Unsave post when saved", () => {
    render(
      <MemoryRouter>
        <PostCard post={mockPost} courseId="cisc200" isSaved onToggleSave={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("Unsave post")).toBeInTheDocument();
  });
});
