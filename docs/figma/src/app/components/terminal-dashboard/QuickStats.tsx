export function QuickStats() {
  return (
    <div className="border-2 border-green-500/30 bg-black h-full">
      {/* Header */}
      <div className="border-b-2 border-green-500/30 px-3 py-2 bg-green-950/20">
        <span className="text-green-400 text-sm font-bold">
          ┌─ STATISTICS ─┐
        </span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 text-sm font-mono">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-green-500 bg-green-500/20 flex items-center justify-center text-xs text-green-400">
              12
            </div>
            <span className="text-green-600">TOTAL MISSIONS</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-orange-500 bg-orange-500/20 flex items-center justify-center text-xs text-orange-400">
              3
            </div>
            <span className="text-green-600">ACTIVE</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-green-500 bg-green-500/20 flex items-center justify-center text-xs text-green-400">
              8
            </div>
            <span className="text-green-600">COMPLETE</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-red-500 bg-red-500/20 flex items-center justify-center text-xs text-red-400">
              1
            </div>
            <span className="text-green-600">FAILED</span>
          </div>
        </div>

        <div className="border-t border-green-900/30 my-2"></div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-green-600">SUCCESS:</span>
            <span className="text-green-400">66.7%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">AVG TIME:</span>
            <span className="text-cyan-400">4.2h</span>
          </div>
        </div>

        <div className="border-t border-green-900/30 my-2"></div>

        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-green-600">BACKLOG:</span>
            <span className="text-blue-400">4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">PINS:</span>
            <span className="text-purple-400">3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
