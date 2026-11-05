import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/AuthForms";
import { safeRedirect, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } =>
    typeof s["redirect"] === "string" ? { redirect: s["redirect"] } : {},
  head: () => ({
    meta: [
      { title: "Log in — TeamFit" },
      { name: "description", content: "Log in to TeamFit to post listings and connect with teammates." },
      { property: "og:title", content: "Log in — TeamFit" },
      { property: "og:description", content: "Log in to TeamFit to post listings and connect with teammates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const target = safeRedirect(redirect);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate({ to: target, replace: true });
  }, [user, target, navigate]);

  return (
    <AuthShell title="Welcome back" subtitle="Log in with your password or a magic link.">
      <LoginForm redirectTo={target} />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" search={redirect ? { redirect } : {}} className="font-medium text-primary hover:underline">
          Create a free account
        </Link>
      </p>
    </AuthShell>
  );
}
