import { useState } from "react";
import { Terminal } from "lucide-react";

export function CommandInput() {
  const [command, setCommand] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle command execution
    console.log("Executing command:", command);
    setCommand("");
  };

  return (
    <div className="border-t border-green-900/30 bg-black px-4 py-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-green-400">
          <Terminal className="size-4" />
          <span className="text-sm">nebula@mission-control:~$</span>
        </div>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command... (try 'help', 'mission list', or 'status')"
          className="flex-1 bg-transparent border-none outline-none text-green-400 placeholder:text-green-800 text-sm font-mono"
          autoFocus
        />
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-700 text-xs">READY</span>
        </div>
      </form>
    </div>
  );
}
