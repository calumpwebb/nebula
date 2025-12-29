export function SystemStatus() {
  return (
    <div className="border-2 border-green-500/30 bg-black h-full">
      {/* Header */}
      <div className="border-b-2 border-green-500/30 px-3 py-2 bg-green-950/20">
        <div className="flex items-center justify-between">
          <span className="text-green-400 text-sm font-bold">
            ┌─ SYSTEM STATUS ─┐
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 text-sm font-mono">
        <div className="flex justify-between">
          <span className="text-green-600">STATUS:</span>
          <span className="text-green-400 flex items-center gap-1">
            <span className="text-green-500">●</span> OPERATIONAL
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-green-600">REPOSITORY:</span>
          <span className="text-green-400">nebula-platform</span>
        </div>

        <div className="flex justify-between">
          <span className="text-green-600">BRANCH:</span>
          <span className="text-cyan-400">main</span>
        </div>

        <div className="flex justify-between">
          <span className="text-green-600">COMMIT:</span>
          <span className="text-purple-400">a7f39c2</span>
        </div>

        <div className="border-t border-green-900/30 my-2"></div>

        <div className="flex justify-between">
          <span className="text-green-600">AI AGENTS:</span>
          <span className="text-green-400">2 active</span>
        </div>

        <div className="flex justify-between">
          <span className="text-green-600">WORKTREES:</span>
          <span className="text-blue-400">4 total</span>
        </div>

        <div className="flex justify-between">
          <span className="text-green-600">LAST SYNC:</span>
          <span className="text-green-400">2m ago</span>
        </div>

        <div className="border-t border-green-900/30 my-2"></div>

        <div className="flex justify-between items-center">
          <span className="text-yellow-600">TOKEN USAGE:</span>
          <span className="text-yellow-400">89%</span>
        </div>
        <div className="h-2 bg-green-950/30 border border-green-900/30">
          <div className="h-full bg-yellow-500/70" style={{ width: "89%" }}></div>
        </div>
      </div>
    </div>
  );
}
