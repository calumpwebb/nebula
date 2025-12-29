import { Zap, Square, Pause, GitBranch, Activity, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

export function ExecutionHeader() {
  return (
    <div className="border-b border-gray-900 bg-black">
      {/* Mission info bar */}
      <div className="border-b border-gray-900 px-6 py-3 bg-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-300 hover:bg-gray-900"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back to Mission
            </Button>
            <div className="h-4 w-px bg-gray-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-mono">NBLA-239</span>
              <span className="text-sm text-gray-400">
                Implement user authentication flow
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <GitBranch className="size-3" />
            <span className="font-mono">nbla-239-auth</span>
          </div>
        </div>
      </div>

      {/* Main execution controls */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <Zap className="size-6 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl text-gray-100">Execute Phase</h1>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                  AI Active
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Implementing task 4/9 • Running for 8m 23s
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-900 border border-gray-800">
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-purple-400" />
                <div className="text-sm">
                  <span className="text-gray-500">Tokens:</span>{" "}
                  <span className="text-gray-300">24.3k</span>
                  <span className="text-gray-600"> / 128k</span>
                </div>
              </div>
              <div className="h-4 w-px bg-gray-800"></div>
              <div className="text-sm">
                <span className="text-gray-500">Cost:</span>{" "}
                <span className="text-green-400">$0.48</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            >
              <Pause className="size-4 mr-2" />
              Pause
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Square className="size-4 mr-2" />
              Stop
            </Button>
          </div>
        </div>

        {/* Overall progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Overall Progress</span>
            <span className="text-sm text-gray-400">45%</span>
          </div>
          <Progress value={45} className="h-2 bg-gray-900" />
        </div>
      </div>
    </div>
  );
}
