export function ResourceMonitor() {
  return (
    <div className="border-2 border-green-500/30 bg-black h-full">
      {/* Header */}
      <div className="border-b-2 border-green-500/30 px-3 py-2 bg-green-950/20">
        <span className="text-green-400 text-sm font-bold">
          ┌─ RESOURCE MONITOR ─┐
        </span>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3 text-sm font-mono">
        {/* Token Usage */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-green-600">TOKENS/DAY</span>
            <span className="text-cyan-400">112.5k / 128k</span>
          </div>
          <div className="h-2 bg-green-950/30 border border-green-900/30">
            <div className="h-full bg-cyan-500/70" style={{ width: "88%" }}></div>
          </div>
        </div>

        {/* Rate Limits */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-green-600">RATE LIMIT</span>
            <span className="text-green-400">45 / 60 rpm</span>
          </div>
          <div className="h-2 bg-green-950/30 border border-green-900/30">
            <div className="h-full bg-green-500/70" style={{ width: "75%" }}></div>
          </div>
        </div>

        {/* Cost */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-green-600">COST/MONTH</span>
            <span className="text-purple-400">$4.80 / $10.00</span>
          </div>
          <div className="h-2 bg-green-950/30 border border-green-900/30">
            <div className="h-full bg-purple-500/70" style={{ width: "48%" }}></div>
          </div>
        </div>

        <div className="border-t border-green-900/30 my-2"></div>

        {/* Current Usage */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-green-600">ACTIVE REQUESTS:</span>
            <span className="text-green-400">3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">AVG LATENCY:</span>
            <span className="text-cyan-400">1.2s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-600">ERRORS (24h):</span>
            <span className="text-red-400">2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
