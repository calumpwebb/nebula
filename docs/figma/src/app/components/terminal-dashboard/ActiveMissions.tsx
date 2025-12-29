export function ActiveMissions() {
  const missions = [
    {
      id: "NBLA-239",
      title: "Implement user authentication flow",
      phase: "EXECUTE",
      progress: 45,
      status: "RUNNING",
    },
    {
      id: "NBLA-241",
      title: "Add document versioning system",
      phase: "DESIGN",
      progress: 80,
      status: "REVIEW",
    },
    {
      id: "NBLA-235",
      title: "Refactor git worktree manager",
      phase: "PLAN",
      progress: 100,
      status: "WAITING",
    },
  ];

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "BRAINSTORM":
        return "text-purple-400";
      case "DESIGN":
        return "text-blue-400";
      case "PLAN":
        return "text-cyan-400";
      case "EXECUTE":
        return "text-orange-400";
      default:
        return "text-green-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING":
        return "text-green-400";
      case "REVIEW":
        return "text-yellow-400";
      case "WAITING":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="border-2 border-green-500/30 bg-black h-full">
      {/* Header */}
      <div className="border-b-2 border-green-500/30 px-3 py-2 bg-green-950/20">
        <div className="flex items-center justify-between">
          <span className="text-green-400 text-sm font-bold">
            ┌─ ACTIVE MISSIONS ─┐
          </span>
          <span className="text-green-600 text-xs">[3/12]</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {missions.map((mission, index) => (
          <div
            key={mission.id}
            className="border border-green-700/30 bg-green-950/10 p-2 hover:bg-green-950/20 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 text-xs font-mono font-bold">
                    {mission.id}
                  </span>
                  <span className={`text-xs ${getPhaseColor(mission.phase)}`}>
                    [{mission.phase}]
                  </span>
                  <span className={`text-xs ${getStatusColor(mission.status)}`}>
                    {mission.status}
                  </span>
                </div>
                <div className="text-green-400 text-sm mt-1">
                  {mission.title}
                </div>
              </div>
              <div className="text-green-600 text-xs">
                {mission.progress}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-green-950/30 border border-green-900/30">
              <div
                className="h-full bg-green-500/70"
                style={{ width: `${mission.progress}%` }}
              ></div>
            </div>
          </div>
        ))}

        <div className="text-green-700 text-xs mt-3 text-center">
          → Press [ENTER] to view mission details
        </div>
      </div>
    </div>
  );
}
