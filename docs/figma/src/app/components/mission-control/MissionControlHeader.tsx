import { Sparkles, Plus, Search, Settings, GitBranch, Activity } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

export function MissionControlHeader() {
  return (
    <div className="border-b border-gray-800 bg-[#0d0d14]">
      {/* Top status bar */}
      <div className="border-b border-gray-800 px-6 py-2 bg-[#08080c]">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-400 animate-pulse"></div>
              <span>All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="size-3" />
              <span>main @ a7f39c2</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="size-3" />
              <span>2 AI agents active</span>
            </div>
          </div>
          <div className="text-gray-600">
            Last sync: 2 minutes ago
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <Sparkles className="size-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl text-gray-100">nebula-platform</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Mission Control • 3 active missions • 4 in backlog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
              <Input
                placeholder="Search missions, tickets..."
                className="pl-9 w-64 bg-gray-900 border-gray-700 text-gray-200"
              />
            </div>

            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="size-4 mr-2" />
              New Mission
            </Button>

            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <Plus className="size-4 mr-2" />
              New Ticket
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
            >
              <Settings className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
