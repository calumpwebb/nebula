import { useState } from "react";
import { TerminalLogin } from "./login/TerminalLogin";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-4">
      <TerminalLogin onLogin={onLogin} />
    </div>
  );
}
