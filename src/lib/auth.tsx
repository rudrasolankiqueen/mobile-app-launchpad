import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type LoginReason = "post" | "interest" | "join" | "notifications" | "generic";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  /** Opens the shared login modal; onSuccess runs after the user signs in. */
  requireAuth: (reason: LoginReason, onSuccess?: () => void) => boolean;
  modal: { open: boolean; reason: LoginReason };
  closeModal: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Only allow same-origin relative paths as redirect targets. */
export function safeRedirect(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; reason: LoginReason }>({
    open: false,
    reason: "generic",
  });
  const [pending, setPending] = useState<(() => void) | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setLoading(false);
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    supabase.auth.getSession().then(({ data: d }) => {
      setSession(d.session);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  useEffect(() => {
    if (session && modal.open) {
      setModal((m) => ({ ...m, open: false }));
      pending?.();
      setPending(null);
    }
  }, [session, modal.open, pending]);

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    loading,
    modal,
    closeModal: () => {
      setModal((m) => ({ ...m, open: false }));
      setPending(null);
    },
    requireAuth: (reason, onSuccess) => {
      if (session) return true;
      setPending(() => onSuccess ?? null);
      setModal({ open: true, reason });
      return false;
    },
    signOut: async () => {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      router.navigate({ to: "/login", replace: true });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
