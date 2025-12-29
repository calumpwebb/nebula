import { CheckCircle2, Circle, Loader2, Clock } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";

interface Task {
  id: number;
  title: string;
  status: "complete" | "active" | "pending";
  duration?: string;
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Create AuthProvider component",
    status: "complete",
    duration: "2m 15s",
  },
  {
    id: 2,
    title: "Implement useAuth hook",
    status: "complete",
    duration: "1m 30s",
  },
  {
    id: 3,
    title: "Define authentication types",
    status: "complete",
    duration: "45s",
  },
  {
    id: 4,
    title: "Update LoginForm with auth context",
    status: "active",
  },
  {
    id: 5,
    title: "Create ProtectedRoute wrapper",
    status: "pending",
  },
  {
    id: 6,
    title: "Add token refresh logic",
    status: "pending",
  },
  {
    id: 7,
    title: "Implement logout functionality",
    status: "pending",
  },
  {
    id: 8,
    title: "Add error boundary for auth failures",
    status: "pending",
  },
  {
    id: 9,
    title: "Write unit tests for auth flow",
    status: "pending",
  },
];

export function ExecutionProgress() {
  const completedCount = mockTasks.filter((t) => t.status === "complete").length;
  const totalCount = mockTasks.length;

  return (
    <div className="border-b border-gray-900 bg-black">
      <div className="border-b border-gray-900 px-4 py-3">
        <h2 className="text-gray-300">Execution Plan</h2>
        <p className="text-xs text-gray-600 mt-1">
          {completedCount} of {totalCount} tasks complete
        </p>
      </div>

      <ScrollArea className="h-80">
        <div className="p-4 space-y-2">
          {mockTasks.map((task, index) => (
            <div
              key={task.id}
              className={`
                p-3 rounded-lg border transition-all
                ${
                  task.status === "active"
                    ? "bg-orange-500/5 border-orange-500/30"
                    : task.status === "complete"
                    ? "bg-gray-900/50 border-gray-800"
                    : "bg-black border-gray-900"
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {task.status === "complete" ? (
                    <CheckCircle2 className="size-4 text-green-400" />
                  ) : task.status === "active" ? (
                    <Loader2 className="size-4 text-orange-400 animate-spin" />
                  ) : (
                    <Circle className="size-4 text-gray-700" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-sm leading-snug ${
                        task.status === "complete"
                          ? "text-gray-500 line-through"
                          : task.status === "active"
                          ? "text-gray-200"
                          : "text-gray-600"
                      }`}
                    >
                      {task.title}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-800 text-gray-600 flex-shrink-0"
                    >
                      {task.id}/{totalCount}
                    </Badge>
                  </div>

                  {task.duration && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="size-3 text-gray-600" />
                      <span className="text-xs text-gray-600">
                        {task.duration}
                      </span>
                    </div>
                  )}

                  {task.status === "active" && (
                    <div className="mt-2">
                      <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full w-2/3 animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
