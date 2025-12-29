import { TerminalHeader } from "./terminal-dashboard/TerminalHeader";
import { TerminalContent } from "./terminal-dashboard/TerminalContent";
import { CommandInput } from "./terminal-dashboard/CommandInput";

export function HomeDashboard() {
  return (
    <div className="h-screen flex flex-col bg-black text-green-400 font-mono">
      <TerminalHeader />
      <TerminalContent />
      <CommandInput />
    </div>
  );
}
