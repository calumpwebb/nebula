import { useEffect, useRef, useState } from "react";
import { Terminal, Download, Trash2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "success" | "error" | "warn" | "ai";
  message: string;
}

const initialLogs: LogEntry[] = [
  {
    id: 1,
    timestamp: "15:23:10",
    level: "info",
    message: "Starting execution phase for NBLA-239",
  },
  {
    id: 2,
    timestamp: "15:23:11",
    level: "ai",
    message: "Analyzing execution plan (9 tasks)",
  },
  {
    id: 3,
    timestamp: "15:23:12",
    level: "info",
    message: "Creating file: src/auth/AuthProvider.tsx",
  },
  {
    id: 4,
    timestamp: "15:23:45",
    level: "success",
    message: "✓ Task 1/9 complete: Create AuthProvider component",
  },
  {
    id: 5,
    timestamp: "15:24:01",
    level: "info",
    message: "Creating file: src/auth/useAuth.ts",
  },
  {
    id: 6,
    timestamp: "15:24:23",
    level: "success",
    message: "✓ Task 2/9 complete: Implement useAuth hook",
  },
  {
    id: 7,
    timestamp: "15:24:30",
    level: "info",
    message: "Creating file: src/auth/types.ts",
  },
  {
    id: 8,
    timestamp: "15:25:01",
    level: "success",
    message: "✓ Task 3/9 complete: Define authentication types",
  },
  {
    id: 9,
    timestamp: "15:25:08",
    level: "ai",
    message: "Modifying existing file: src/components/LoginForm.tsx",
  },
  {
    id: 10,
    timestamp: "15:25:09",
    level: "info",
    message: "Reading file contents...",
  },
  {
    id: 11,
    timestamp: "15:25:12",
    level: "ai",
    message: "Analyzing current implementation",
  },
  {
    id: 12,
    timestamp: "15:25:18",
    level: "info",
    message: "Applying changes: +45 lines, -12 lines",
  },
];

export function LiveLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Simulate live logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newMessages = [
        "Validating TypeScript types...",
        "Running ESLint checks...",
        "Formatting code with Prettier...",
        "Checking import statements...",
        "Verifying context usage...",
      ];

      const randomMessage = newMessages[Math.floor(Math.random() * newMessages.length)];

      setLogs((prev) => [
        ...prev,
        {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          level: "info",
          message: randomMessage,
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const getLevelColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      case "ai":
        return "text-purple-400";
      default:
        return "text-blue-400";
    }
  };

  const getLevelLabel = (level: LogEntry["level"]) => {
    switch (level) {
      case "ai":
        return "AI";
      default:
        return level.toUpperCase();
    }
  };

  return (
    <div className="flex-1 flex flex-col border-t border-gray-900 bg-black">
      <div className="border-b border-gray-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 text-gray-500" />
          <h2 className="text-gray-300">Live Logs</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`h-7 text-xs ${
              autoScroll
                ? "text-green-400 hover:text-green-300"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            Auto-scroll {autoScroll ? "ON" : "OFF"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-600 hover:text-gray-400"
          >
            <Download className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLogs([])}
            className="h-7 w-7 p-0 text-gray-600 hover:text-gray-400"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-black">
        <ScrollArea className="h-full">
          <div ref={scrollRef} className="p-4 font-mono text-xs space-y-1">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2 text-gray-500">
                <span className="text-gray-700 flex-shrink-0">
                  [{log.timestamp}]
                </span>
                <span
                  className={`${getLevelColor(log.level)} flex-shrink-0 w-16`}
                >
                  {getLevelLabel(log.level)}
                </span>
                <span className="text-gray-400">{log.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
