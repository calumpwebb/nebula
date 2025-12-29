import { Brain, FileText, ListTodo, Zap, CheckCircle2, Pin, GitBranch, Clock } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { mockMissions } from "./mockMissionData";
import type { Mission, MissionPhase, MissionStatus } from "./missionTypes";

export function ActiveMissions() {
  const getPhaseIcon = (phase: MissionPhase) => {
    switch (phase) {
      case "brainstorm":
        return <Brain className="size-4" />;
      case "design":
        return <FileText className="size-4" />;
      case "plan":
        return <ListTodo className="size-4" />;
      case "execute":
        return <Zap className="size-4" />;
      case "complete":
        return <CheckCircle2 className="size-4" />;
    }
  };

  const getPhaseColor = (phase: MissionPhase) => {
    switch (phase) {
      case "brainstorm":
        return "bg-purple-500/10 border-purple-500/30 text-purple-400";
      case "design":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400";
      case "plan":
        return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400";
      case "execute":
        return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "complete":
        return "bg-green-500/10 border-green-500/30 text-green-400";
    }
  };

  const getStatusBadge = (status: MissionStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
            Active
          </Badge>
        );
      case "pending_approval":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 text-xs">
            Pending Approval
          </Badge>
        );
      case "in_review":
        return (
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs">
            In Review
          </Badge>
        );
      case "blocked":
        return (
          <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">
            Blocked
          </Badge>
        );
      case "complete":
        return (
          <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/30 text-xs">
            Complete
          </Badge>
        );
    }
  };

  const getOverallProgress = (mission: Mission) => {
    return (
      (mission.progress.brainstorm +
        mission.progress.design +
        mission.progress.plan +
        mission.progress.execute) /
      4
    );
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMins}m ago`;
  };

  return (
    <>
      <div className="border-b border-gray-800 px-4 py-3">
        <h2 className="text-gray-200">Active Missions</h2>
        <p className="text-xs text-gray-500 mt-1">
          {mockMissions.length} in progress
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {mockMissions.map((mission) => (
            <button
              key={mission.id}
              className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600 transition-all text-left group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded border ${getPhaseColor(mission.phase)}`}>
                    {getPhaseIcon(mission.phase)}
                  </div>
                  <span className="text-xs text-gray-500">{mission.id}</span>
                </div>
                {getStatusBadge(mission.status)}
              </div>

              {/* Title */}
              <h3 className="text-sm text-gray-200 mb-3 group-hover:text-purple-300 transition-colors">
                {mission.title}
              </h3>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Overall Progress</span>
                  <span className="text-xs text-gray-400">
                    {Math.round(getOverallProgress(mission))}%
                  </span>
                </div>
                <Progress
                  value={getOverallProgress(mission)}
                  className="h-1.5 bg-gray-900"
                />
              </div>

              {/* Phase indicators */}
              <div className="flex gap-1 mb-3">
                <div
                  className={`flex-1 h-1 rounded ${
                    mission.progress.brainstorm === 100
                      ? "bg-purple-500"
                      : "bg-gray-700"
                  }`}
                  title={`Brainstorm: ${mission.progress.brainstorm}%`}
                ></div>
                <div
                  className={`flex-1 h-1 rounded ${
                    mission.progress.design === 100
                      ? "bg-blue-500"
                      : mission.progress.design > 0
                      ? "bg-blue-500/50"
                      : "bg-gray-700"
                  }`}
                  title={`Design: ${mission.progress.design}%`}
                ></div>
                <div
                  className={`flex-1 h-1 rounded ${
                    mission.progress.plan === 100
                      ? "bg-cyan-500"
                      : mission.progress.plan > 0
                      ? "bg-cyan-500/50"
                      : "bg-gray-700"
                  }`}
                  title={`Plan: ${mission.progress.plan}%`}
                ></div>
                <div
                  className={`flex-1 h-1 rounded ${
                    mission.progress.execute === 100
                      ? "bg-orange-500"
                      : mission.progress.execute > 0
                      ? "bg-orange-500/50"
                      : "bg-gray-700"
                  }`}
                  title={`Execute: ${mission.progress.execute}%`}
                ></div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <GitBranch className="size-3" />
                    <span className="truncate max-w-[120px]">
                      {mission.worktree}
                    </span>
                  </div>
                  {mission.pinCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Pin className="size-3" />
                      <span>{mission.pinCount}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{formatTimeAgo(mission.updatedAt)}</span>
                </div>
              </div>

              {/* Approvals */}
              {mission.approvals.required > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-xs text-gray-500">
                    Approvals: {mission.approvals.completed}/{mission.approvals.required}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
