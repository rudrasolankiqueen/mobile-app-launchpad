import { describe, expect, it } from "vitest";
import { hasEvidence, safeUrl, validateFinderCard } from "@/lib/finder-card";

describe("evidence checkmark", () => {
  it("bare skill gets no checkmark", () => {
    expect(hasEvidence({ evidence: "", evidenceUrl: "" })).toBe(false);
  });
  it("evidence text earns the checkmark", () => {
    expect(hasEvidence({ evidence: "Won HackMIT", evidenceUrl: "" })).toBe(true);
  });
  it("a valid link earns the checkmark", () => {
    expect(hasEvidence({ evidence: "", evidenceUrl: "github.com/me/app" })).toBe(true);
  });
  it("unsafe links are rejected", () => {
    expect(safeUrl("javascript:alert(1)")).toBeNull();
    expect(hasEvidence({ evidence: "", evidenceUrl: "javascript:alert(1)" })).toBe(false);
  });
});

describe("finder card validation", () => {
  it("requires a name and at least one skill", () => {
    expect(validateFinderCard({ displayName: "", college: "", personalNote: "", skills: [] })).toBe("Add your display name");
    expect(validateFinderCard({ displayName: "A", college: "", personalNote: "", skills: [] })).toBe("Add at least one skill");
  });
});
