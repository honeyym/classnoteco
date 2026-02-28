import { describe, it, expect } from "vitest";
import {
  courses,
  getCourse,
  getCoursePosts,
  getPost,
  getPostReplies,
  getCourseResources,
  formatTimeAgo,
} from "./mockData";

describe("mockData", () => {
  describe("getCourse", () => {
    it("returns course for valid id", () => {
      const course = getCourse("cisc200");
      expect(course).toBeDefined();
      expect(course?.id).toBe("cisc200");
      expect(course?.code).toBe("CISC 200");
      expect(course?.name).toContain("Computer");
    });

    it("returns undefined for invalid id", () => {
      expect(getCourse("invalid")).toBeUndefined();
    });
  });

  describe("getCoursePosts", () => {
    it("returns posts for course", () => {
      const posts = getCoursePosts("cisc200");
      expect(Array.isArray(posts)).toBe(true);
      expect(posts.every((p) => p.courseId === "cisc200")).toBe(true);
    });

    it("returns empty array for unknown course", () => {
      expect(getCoursePosts("unknown")).toEqual([]);
    });
  });

  describe("getPost", () => {
    it("returns post for valid id", () => {
      const post = getPost("cisc-post1");
      expect(post).toBeDefined();
      expect(post?.id).toBe("cisc-post1");
      expect(post?.content).toBeDefined();
    });

    it("returns undefined for invalid id", () => {
      expect(getPost("invalid")).toBeUndefined();
    });
  });

  describe("getPostReplies", () => {
    it("returns replies for post", () => {
      const replies = getPostReplies("cisc-post1");
      expect(Array.isArray(replies)).toBe(true);
      expect(replies.every((r) => r.postId === "cisc-post1")).toBe(true);
    });
  });

  describe("getCourseResources", () => {
    it("returns resources for course", () => {
      const resources = getCourseResources("cisc200");
      expect(Array.isArray(resources)).toBe(true);
      expect(resources.every((r) => r.courseId === "cisc200")).toBe(true);
    });
  });

  describe("formatTimeAgo", () => {
    it("formats recent date", () => {
      const now = new Date();
      const result = formatTimeAgo(now);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("formats past date", () => {
      const past = new Date(Date.now() - 86400000); // 1 day ago
      const result = formatTimeAgo(past);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe("courses", () => {
    it("has expected course ids", () => {
      const ids = courses.map((c) => c.id);
      expect(ids).toContain("cisc200");
      expect(ids).toContain("psych101");
      expect(courses.length).toBeGreaterThan(0);
    });

    it("each course has required fields", () => {
      courses.forEach((course) => {
        expect(course.id).toBeDefined();
        expect(course.code).toBeDefined();
        expect(course.name).toBeDefined();
        expect(course.semester).toBeDefined();
        expect(typeof course.newMessages).toBe("number");
        expect(course.color).toBeDefined();
      });
    });
  });
});
