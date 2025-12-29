export function QuickActions() {
  const commands = [
    { key: "M", action: "View Missions", shortcut: "ctrl+m" },
    { key: "N", action: "New Mission", shortcut: "ctrl+n" },
    { key: "T", action: "Create Ticket", shortcut: "ctrl+t" },
    { key: "B", action: "Brainstorm", shortcut: "ctrl+b" },
    { key: "R", action: "Review Docs", shortcut: "ctrl+r" },
    { key: "W", action: "Worktrees", shortcut: "ctrl+w" },
    { key: "H", action: "Help", shortcut: "ctrl+h" },
    { key: "Q", action: "Quit", shortcut: "ctrl+q" },
  ];

  return (
    <div className="border-2 border-green-500/30 bg-black h-full">
      {/* Header */}
      <div className="border-b-2 border-green-500/30 px-3 py-2 bg-green-950/20">
        <span className="text-green-400 text-sm font-bold">
          ┌─ QUICK ACTIONS ─┐
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {commands.map((cmd, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs font-mono hover:bg-green-950/20 p-1 transition-colors cursor-pointer"
            >
              <span className="w-5 h-5 border-2 border-green-500 bg-green-950/30 flex items-center justify-center text-green-400 font-bold">
                {cmd.key}
              </span>
              <span className="text-green-400 flex-1">{cmd.action}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-green-900/30 mt-3 pt-3 space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-green-700">→</span>
            <span className="text-green-600">
              Type command or use keyboard shortcuts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-700">→</span>
            <span className="text-green-600">
              'help' for full command list
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-700">→</span>
            <span className="text-green-600">
              'clear' to reset terminal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
