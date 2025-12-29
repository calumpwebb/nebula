import { Minus, Square, X } from "lucide-react";

export function TerminalHeader() {
  const currentTime = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="border-b border-green-900/30 bg-black px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-red-500"></div>
          <div className="size-3 rounded-full bg-yellow-500"></div>
          <div className="size-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-green-400 text-sm">
          nebula@mission-control:~$
        </span>
      </div>
      <div className="text-green-600 text-xs">
        {currentTime}
      </div>
    </div>
  );
}
