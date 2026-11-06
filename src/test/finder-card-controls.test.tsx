import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { FinderCardForm, type SaveMode } from "@/components/finder-card/FinderCardForm";
import { type FinderCardValue } from "@/lib/finder-card";

vi.mock("@/lib/finder-card", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/finder-card")>(),
  fetchSkillNames: async () => ["React", "Python"],
}));
afterEach(cleanup);

function Form() {
  const [value, setValue] = useState<FinderCardValue>({ displayName: "Priya", college: "", personalNote: "", skills: [] });
  const [mode, setMode] = useState<SaveMode>("once");
  return <FinderCardForm value={value} onChange={setValue} saveMode={mode} onSaveModeChange={setMode} />;
}
function mount() {
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><Form /></QueryClientProvider>);
}

describe("Finder Card controls", () => {
  it("accepts predefined and custom skills without duplicates", async () => {
    mount();
    const input = screen.getByRole("combobox");
    fireEvent.focus(input);
    fireEvent.click(await screen.findByRole("option", { name: "React" }));
    fireEvent.change(input, { target: { value: "Robotics" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByRole("button", { name: "Remove React" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Robotics" })).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "robotics" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getAllByRole("button", { name: /Remove Robotics/i })).toHaveLength(1);
  });
  it("switches between reusable and use-once modes", () => {
    mount();
    expect(screen.getByRole("radio", { name: /Use Once/ })).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: /Save Profile/ }));
    expect(screen.getByRole("radio", { name: /Save Profile/ })).toBeChecked();
    expect(screen.getByRole("radio", { name: /Use Once/ })).not.toBeChecked();
  });
  it("keeps a personal note when details are collapsed", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Add more details" }));
    fireEvent.change(screen.getByLabelText("Personal note"), { target: { value: "Prefer async" } });
    fireEvent.click(screen.getByRole("button", { name: "Hide details" }));
    fireEvent.click(screen.getByRole("button", { name: "Add more details" }));
    expect(screen.getByLabelText("Personal note")).toHaveValue("Prefer async");
  });
});