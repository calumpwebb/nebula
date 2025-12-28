import { useState, useEffect } from "react";
import { LoginForm } from "./LoginForm";
import { CreateAccountForm } from "./CreateAccountForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { BootSequence } from "./BootSequence";

interface TerminalLoginProps {
  onLogin: () => void;
}

type LoginView = "boot" | "login" | "create" | "forgot";

export function TerminalLogin({ onLogin }: TerminalLoginProps) {
  const [view, setView] = useState<LoginView>("boot");

  useEffect(() => {
    const timer = setTimeout(() => {
      setView("login");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (view === "boot") {
    return <BootSequence />;
  }

  if (view === "create") {
    return (
      <CreateAccountForm
        onCreateSuccess={onLogin}
        onBackToLogin={() => setView("login")}
      />
    );
  }

  if (view === "forgot") {
    return (
      <ForgotPasswordForm
        onBackToLogin={() => setView("login")}
      />
    );
  }

  return (
    <LoginForm
      onLogin={onLogin}
      onCreateAccount={() => setView("create")}
      onForgotPassword={() => setView("forgot")}
    />
  );
}
