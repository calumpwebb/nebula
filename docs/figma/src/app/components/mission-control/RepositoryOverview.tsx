import { GitBranch, Activity, TrendingUp, DollarSign, CheckCircle2, XCircle, Clock, Terminal } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { mockWorktrees } from "./mockMissionData";

export function RepositoryOverview() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Activity className="size-4" />
                Total Missions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-100">12</div>
              <p className="text-xs text-green-400 mt-1">↑ 3 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-100">8</div>
              <p className="text-xs text-gray-500 mt-1">66.7% success rate</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <TrendingUp className="size-4" />
                AI Tokens Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-100">2.4M</div>
              <p className="text-xs text-gray-500 mt-1">~$4.80 total</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Clock className="size-4" />
                Avg. Time/Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-100">4.2h</div>
              <p className="text-xs text-orange-400 mt-1">↑ 12% vs last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Worktree Visualization */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200 flex items-center gap-2">
              <GitBranch className="size-5" />
              Git Worktrees
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Isolated environments for AI-driven development
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockWorktrees.map((worktree) => (
                <div
                  key={worktree.name}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/30 border border-gray-700"
                >
                  {/* Branch visualization */}
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`p-2 rounded border ${
                        worktree.status === "active"
                          ? "bg-green-500/10 border-green-500/30"
                          : worktree.status === "merging"
                          ? "bg-yellow-500/10 border-yellow-500/30"
                          : "bg-gray-600/10 border-gray-600/30"
                      }`}
                    >
                      <GitBranch
                        className={`size-4 ${
                          worktree.status === "active"
                            ? "text-green-400"
                            : worktree.status === "merging"
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300 font-mono">
                          {worktree.name}
                        </span>
                        {worktree.status === "active" && (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 font-mono truncate">
                        {worktree.branch}
                      </p>
                    </div>
                  </div>

                  {/* Commits */}
                  <div className="text-right">
                    <div className="text-sm text-gray-400">
                      {worktree.commits} commits
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200 flex items-center gap-2">
              <Activity className="size-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  id: 1,
                  type: "approval",
                  mission: "NBLA-239",
                  message: "Execute phase approved",
                  time: "5m ago",
                  icon: <CheckCircle2 className="size-4 text-green-400" />,
                },
                {
                  id: 2,
                  type: "commit",
                  mission: "NBLA-241",
                  message: "AI committed 3 files to design doc",
                  time: "12m ago",
                  icon: <GitBranch className="size-4 text-blue-400" />,
                },
                {
                  id: 3,
                  type: "review",
                  mission: "NBLA-235",
                  message: "Design review requested changes",
                  time: "1h ago",
                  icon: <XCircle className="size-4 text-orange-400" />,
                },
                {
                  id: 4,
                  type: "create",
                  mission: "NBLA-241",
                  message: "New mission created from brainstorm",
                  time: "2h ago",
                  icon: <Activity className="size-4 text-purple-400" />,
                },
                {
                  id: 5,
                  type: "complete",
                  mission: "NBLA-238",
                  message: "Mission completed and merged to main",
                  time: "3h ago",
                  icon: <CheckCircle2 className="size-4 text-green-400" />,
                },
              ].map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-gray-900 border border-gray-700 mt-0.5">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono">
                        {activity.mission}
                      </span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-600">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-0.5">
                      {activity.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Console (placeholder for real-time logs) */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200 flex items-center gap-2">
              <Terminal className="size-5" />
              Live Console
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Real-time execution logs
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-xs space-y-1 border border-gray-800">
              <div className="text-gray-500">
                [15:23:41] <span className="text-blue-400">INFO</span> NBLA-239: Executing test suite...
              </div>
              <div className="text-gray-500">
                [15:23:42] <span className="text-green-400">SUCCESS</span> NBLA-239: 24/24 tests passed
              </div>
              <div className="text-gray-500">
                [15:23:45] <span className="text-cyan-400">AI</span> NBLA-241: Analyzing design doc feedback...
              </div>
              <div className="text-gray-500">
                [15:23:50] <span className="text-yellow-400">WARN</span> NBLA-235: Waiting for approval gate
              </div>
              <div className="text-gray-500 flex items-center gap-2">
                [15:23:52] <span className="text-blue-400">INFO</span> System: Token usage 89% of daily limit
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
