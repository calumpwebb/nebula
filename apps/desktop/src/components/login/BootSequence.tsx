import { useEffect, useState } from "react";

export function BootSequence() {
  const [lines, setLines] = useState<string[]>([]);

  const bootMessages = [
    "NEBULA v0.1.0-alpha - Mission Control Interface",
    "Copyright (c) 2024 Nebula Development Platform",
    "",
    "[OK] Initializing system kernel...",
    "[OK] Loading AI agent modules...",
    "[OK] Mounting git worktree filesystem...",
    "[OK] Starting network services...",
    "[OK] Connecting to mission control...",
    "[OK] Initializing authentication system...",
    "",
    "System ready. Awaiting authentication...",
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      const message = bootMessages[index];
      if (message !== undefined) {
        setLines((prev) => [...prev, message]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl">
      <div className="border-2 border-green-500/30 bg-black p-6">
        <div className="space-y-1 text-sm">
          {lines.map((line, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              {line && line.startsWith("[OK]") ? (
                <>
                  <span className="text-green-500">[OK]</span>
                  <span className="text-green-400">
                    {line.substring(5)}
                  </span>
                </>
              ) : line === "" ? (
                <span>&nbsp;</span>
              ) : (
                <span className="text-green-400">{line}</span>
              )}
            </div>
          ))}
          {lines.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-green-400">█</span>
              <span className="animate-pulse">_</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
