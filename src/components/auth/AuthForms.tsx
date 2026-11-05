import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function redirectUrl(path: string) {
  return `${window.location.origin}${path}`;
}

function CheckEmail({ email, what }: { email: string; what: string }) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <MailCheck className="mb-3 size-10 text-accent" />
      <p className="font-semibold">Check your inbox</p>
      <p className="mt-1 text-sm text-muted-foreground">
        We sent {what} to <span className="font-medium text-foreground">{email}</span>.
      </p>
    </div>
  );
}

export function LoginForm({
  redirectTo,
  onSwitch,
}: {
  redirectTo: string;
  onSwitch?: () => void;
}) {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "password") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
      else toast.success("Welcome back!");
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectUrl(redirectTo), shouldCreateUser: true },
      });
      if (error) toast.error(error.message);
      else setSent(true);
    }
    setBusy(false);
  }

  if (sent) return <CheckEmail email={email} what="a magic sign-in link" />;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="login-email">College email</Label>
        <Input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
      </div>
      {mode === "password" && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Please wait…" : mode === "password" ? "Log in" : "Email me a magic link"}
      </Button>
      <button
        type="button"
        onClick={() => setMode(mode === "password" ? "magic" : "password")}
        className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        {mode === "password" ? "Use a magic link instead" : "Use a password instead"}
      </button>
      {onSwitch && (
        <p className="text-center text-sm text-muted-foreground">
          New to TeamFit?{" "}
          <button type="button" onClick={onSwitch} className="font-medium text-primary hover:underline">
            Create a free account
          </button>
        </p>
      )}
    </form>
  );
}

export function SignupForm({
  redirectTo,
  onSwitch,
}: {
  redirectTo: string;
  onSwitch?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (password !== confirm) return toast.error("Passwords don't match");
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl(redirectTo) },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (!data.session) setSent(true);
    else toast.success("Account created!");
  }

  if (sent) return <CheckEmail email={email} what="a confirmation link" />;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="su-email">College email</Label>
        <Input id="su-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="su-pass">Password</Label>
        <Input id="su-pass" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="su-confirm">Confirm password</Label>
        <Input id="su-confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      <p className="rounded-lg bg-accent-soft px-3 py-2 text-xs text-foreground">
        Your email stays private. It's only shared with a teammate after you both accept a request.
      </p>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Creating account…" : "Create account"}
      </Button>
      {onSwitch && (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button type="button" onClick={onSwitch} className="font-medium text-primary hover:underline">
            Log in
          </button>
        </p>
      )}
    </form>
  );
}
