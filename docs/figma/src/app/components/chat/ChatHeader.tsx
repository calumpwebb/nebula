import { Sparkles, Code2, Activity } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ChatHeaderProps {
  verboseMode: boolean;
  onToggleVerbose: () => void;
}

export function ChatHeader({ verboseMode, onToggleVerbose }: ChatHeaderProps) {
  return (
    <div className="border-b border-gray-800 bg-[#0d0d14] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <Sparkles className="size-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-gray-100">Brainstorm Session</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              New conversation • Started 8 minutes ago
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700">
            <Activity className="size-4 text-green-400" />
            <span className="text-xs text-gray-400">3.2k / 128k tokens</span>
          </div>

          <Button
            onClick={onToggleVerbose}
            variant={verboseMode ? "default" : "outline"}
            size="sm"
            className={
              verboseMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "border-gray-700 text-gray-300 hover:bg-gray-800"
            }
          >
            <Code2 className="size-4 mr-2" />
            Verbose Mode
          </Button>

          {verboseMode && (
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              Debug Active
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
