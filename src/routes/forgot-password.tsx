import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — TeamFit" },
      { name: "description", content: "Get a link to reset your TeamFit password." },
      { property: "og:title", content: "Reset your password — TeamFit" },
      { property: "og:description", content: "Get a link to reset your TeamFit password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else setSent(true);
  }

  return (
    <AuthShell title="Forgot your password?" subtitle="We'll email you a link to set a new one.">
      {sent ? (
        <p className="text-sm">If an account exists for <b>{email}</b>, a reset link is on its way.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fp-email">Email</Label>
            <Input id="fp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>Send reset link</Button>
        </form>
      )}
      <Link to="/login" className="mt-4 block text-center text-sm text-primary hover:underline">Back to log in</Link>
    </AuthShell>
  );
}
