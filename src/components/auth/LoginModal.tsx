import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Modal } from "@/components/teamfit/Modal";
import { useAuth, type LoginReason } from "@/lib/auth";
import { LoginForm, SignupForm } from "./AuthForms";

const copy: Record<LoginReason, string> = {
  post: "Sign in to post your listing. Your draft is kept safe.",
  interest: "Sign in to send your interest request.",
  join: "Sign in to publish your Looking to Join card.",
  notifications: "Sign in to see your notifications.",
  generic: "Create a free account — it takes 30 seconds.",
};

export function LoginModal() {
  const { modal, closeModal } = useAuth();
  const location = useLocation();
  const [tab, setTab] = useState<"signup" | "login">("signup");

  return (
    <Modal
      open={modal.open}
      onOpenChange={(o) => !o && closeModal()}
      title={tab === "signup" ? "Create a free account" : "Welcome back"}
      description={copy[modal.reason]}
    >
      {tab === "signup" ? (
        <SignupForm redirectTo={location.href} onSwitch={() => setTab("login")} />
      ) : (
        <LoginForm redirectTo={location.href} onSwitch={() => setTab("signup")} />
      )}
    </Modal>
  );
}
