import { render, screen } from "@testing-library/react";
import { fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { AppShell } from "@/components/teamfit/AppShell";

const auth = vi.hoisted(() => ({ user: null as null | { email: string; user_metadata: { display_name: string } }, loading: false, signOut: vi.fn(), requireAuth: vi.fn() }));
vi.mock("@/lib/auth", () => ({ useAuth: () => auth }));
vi.mock("@tanstack/react-router", () => ({ Link: ({ to, children, activeProps: _active, ...props }: { to: string; children: ReactNode; activeProps?: unknown }) => <a href={to} {...props}>{children}</a> }));

describe("session-aware shell", () => {
  beforeEach(() => { auth.user = null; vi.clearAllMocks(); });
  it("offers login and signup when signed out", () => {
    render(<AppShell><p>Page</p></AppShell>);
    expect(screen.getByRole("link", { name: "Log In" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Sign Up" })).toHaveAttribute("href", "/signup");
    expect(screen.queryByRole("button", { name: "Account menu" })).not.toBeInTheDocument();
  });
  it("offers account actions and sign-out when signed in", async () => {
    auth.user = { email: "student@example.test", user_metadata: { display_name: "Student" } };
    render(<AppShell><p>Page</p></AppShell>);
    expect(screen.queryByRole("link", { name: "Log In" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Notifications" })).toHaveAttribute("href", "/notifications");
    fireEvent.pointerDown(screen.getByRole("button", { name: "Account menu" }), { button: 0, ctrlKey: false, pointerType: "mouse" });
    // Keyboard opening also works in environments without PointerEvent.
    if (!screen.queryByRole("menuitem", { name: "Log Out" })) fireEvent.keyDown(screen.getByRole("button", { name: "Account menu" }), { key: "Enter" });
    await waitFor(() => expect(screen.getByRole("menuitem", { name: "Dashboard" })).toHaveAttribute("href", "/dashboard"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Log Out" }));
    expect(auth.signOut).toHaveBeenCalledOnce();
  });
});