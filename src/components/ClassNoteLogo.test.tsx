import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ClassNoteLogo from "./ClassNoteLogo";

describe("ClassNoteLogo", () => {
  it("renders with aria-label for accessibility", () => {
    const { container } = render(<ClassNoteLogo />);
    expect(container.querySelector("[aria-label='ClassNote']")).toBeInTheDocument();
  });

  it("displays ClassNote text", () => {
    render(<ClassNoteLogo />);
    expect(screen.getByText(/Class/)).toBeInTheDocument();
    expect(screen.getByText(/Note/)).toBeInTheDocument();
  });

  it("renders horizontal layout by default", () => {
    const { container } = render(<ClassNoteLogo />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex-row");
  });

  it("renders stacked layout when specified", () => {
    const { container } = render(<ClassNoteLogo layout="stacked" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex-col");
  });

  it("applies custom className", () => {
    const { container } = render(<ClassNoteLogo className="custom-class" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("renders image with alt for screen readers", () => {
    const { container } = render(<ClassNoteLogo />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("alt", "");
  });
});
