import { Ticket, TrendingUp, AlertCircle, Pin, DollarSign, Zap } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { mockTickets } from "./mockMissionData";
import type { Ticket as TicketType } from "./missionTypes";

export function BacklogPanel() {
  const getPriorityColor = (priority: TicketType["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
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
        <h2 className="text-gray-200">Backlog & Observability</h2>
        <p className="text-xs text-gray-500 mt-1">
          {mockTickets.length} tickets waiting
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Quick Stats */}
          <div className="space-y-2">
            <Card className="bg-gray-900/50 border-gray-800 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-green-400" />
                  <span className="text-xs text-gray-400">Token Cost</span>
                </div>
                <span className="text-sm text-gray-200">$4.80</span>
              </div>
              <Progress value={48} className="h-1.5 bg-gray-900" />
              <p className="text-xs text-gray-500 mt-1">48% of monthly budget</p>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-orange-400" />
                  <span className="text-xs text-gray-400">Daily Requests</span>
                </div>
                <span className="text-sm text-gray-200">142</span>
              </div>
              <Progress value={71} className="h-1.5 bg-gray-900" />
              <p className="text-xs text-gray-500 mt-1">71% of rate limit</p>
            </Card>
          </div>

          {/* Pin Summary */}
          <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Pin className="size-4 text-purple-400" />
              <span className="text-sm text-purple-300">Unresolved Pins</span>
              <Badge className="ml-auto bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
                3
              </Badge>
            </div>
            <p className="text-xs text-gray-400">
              2 questions, 1 idea awaiting decisions
            </p>
          </div>

          {/* Backlog Tickets */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ticket className="size-4 text-gray-400" />
              <h3 className="text-sm text-gray-400">Backlog</h3>
            </div>

            <div className="space-y-2">
              {mockTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs text-gray-500 font-mono">
                      {ticket.id}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getPriorityColor(ticket.priority)}`}
                    >
                      {ticket.priority}
                    </Badge>
                  </div>

                  <h4 className="text-sm text-gray-300 mb-2 leading-snug">
                    {ticket.title}
                  </h4>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {ticket.labels.map((label) => (
                        <Badge
                          key={label}
                          variant="outline"
                          className="text-xs border-gray-700 text-gray-500"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-2">
                      {formatTimeAgo(ticket.createdAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="size-4 text-orange-400" />
              <h3 className="text-sm text-gray-400">Alerts</h3>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 text-yellow-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-yellow-300 mb-1">
                      Approval Waiting
                    </p>
                    <p className="text-xs text-gray-400">
                      NBLA-235 has been waiting for approval for 3 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <TrendingUp className="size-4 text-blue-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-300 mb-1">
                      Performance Notice
                    </p>
                    <p className="text-xs text-gray-400">
                      Average mission time increased by 12% this week
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Score */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-400">
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Build Status</span>
                  <span className="text-xs text-green-400">Passing</span>
                </div>
                <Progress value={100} className="h-1.5 bg-gray-900" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Test Coverage</span>
                  <span className="text-xs text-blue-400">87%</span>
                </div>
                <Progress value={87} className="h-1.5 bg-gray-900" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Code Quality</span>
                  <span className="text-xs text-yellow-400">B+</span>
                </div>
                <Progress value={75} className="h-1.5 bg-gray-900" />
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </>
  );
}
