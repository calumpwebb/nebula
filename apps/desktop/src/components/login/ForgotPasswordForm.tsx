import { useState } from "react";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Simulate sending reset email
    setTimeout(() => {
      if (!email) {
        setError("Email address is required.");
        setLoading(false);
        return;
      }

      setSuccess("Password reset link sent! Check your email.");
      setLoading(false);

      // Auto return to login after 3 seconds
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="border-2 border-green-500/30 bg-black">
        {/* Header */}
        <div className="border-b-2 border-green-500/30 px-6 py-4 bg-green-950/20">
          <pre className="text-green-400 text-xs leading-tight text-center">
{`
 ███╗   ██╗███████╗██████╗ ██╗   ██╗██╗      █████╗
 ████╗  ██║██╔════╝██╔══██╗██║   ██║██║     ██╔══██╗
 ██╔██╗ ██║█████╗  ██████╔╝██║   ██║██║     ███████║
 ██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║██║     ██╔══██║
 ██║ ╚████║███████╗██████╔╝╚██████╔╝███████╗██║  ██║
 ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝
`}
          </pre>
          <div className="text-center mt-2 space-y-1">
            <div className="text-green-400 text-sm">AI-Assisted Development Platform</div>
            <div className="text-green-600 text-xs">Mission Control Interface • v0.1.0-alpha</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* System Status */}
          <div className="border-2 border-green-700/30 bg-green-950/10 p-3">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                <span className="text-green-400">RECOVERY SERVER:</span>
                <span className="text-green-300">ONLINE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">●</span>
                <span className="text-green-400">SECURE CONNECTION:</span>
                <span className="text-green-300">ESTABLISHED</span>
              </div>
            </div>
          </div>

          {/* Reset Prompt */}
          <div className="space-y-1 text-sm mt-6">
            <div className="text-green-400">
              ┌─ PASSWORD RECOVERY ─┐
            </div>
            <div className="text-green-600 pl-4 text-xs">
              Enter your email to receive a password reset link.
            </div>
          </div>

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600">$</span>
                <span className="text-green-400">EMAIL:</span>
              </div>
              <div className="border-2 border-green-700/50 bg-green-950/10 p-2 focus-within:border-green-500/70 transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter email..."
                  className="w-full bg-transparent border-none outline-none text-green-400 placeholder:text-green-800 text-sm"
                  autoFocus
                  disabled={loading || !!success}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="border-2 border-red-500/50 bg-red-950/20 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-red-500">✕</span>
                  <span className="text-red-400">{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="border-2 border-green-500/50 bg-green-950/20 p-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-green-400">{success}</span>
                </div>
                <div className="text-green-600 text-xs mt-2 pl-6">
                  Redirecting to login...
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full border-2 border-green-500/50 bg-green-950/30 hover:bg-green-900/30 hover:border-green-400/70 disabled:opacity-50 disabled:cursor-not-allowed p-3 transition-all"
              >
                <div className="flex items-center justify-center gap-2 text-sm">
                  {loading ? (
                    <>
                      <span className="text-green-400 animate-pulse">
                        ⟳ SENDING RESET LINK...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-green-400">→ SEND RESET LINK</span>
                      <span className="text-green-600">[ENTER]</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="border-t-2 border-green-900/30 mt-6 pt-4">
            <div className="text-xs">
              <button
                onClick={onBackToLogin}
                className="text-green-600 hover:text-green-400 transition-colors"
              >
                ← Back to login
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-green-500/30 px-6 py-3 bg-green-950/10">
          <div className="flex items-center justify-between text-xs">
            <div className="text-green-700">
              Secure Session • 256-bit Encryption
            </div>
            <div className="text-green-700">
              {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
