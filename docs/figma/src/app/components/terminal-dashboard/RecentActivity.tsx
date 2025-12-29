export function RecentActivity() {
  const activities = [
    {
      time: "15:28",
      type: "APPROVAL",
      mission: "NBLA-239",
      message: "Execute phase approved",
    },
    {
      time: "15:25",
      type: "COMMIT",
      mission: "NBLA-241",
      message: "3 files committed",
    },
    {
      time: "14:47",
      type: "REVIEW",
      mission: "NBLA-235",
      message: "Changes requested",
    },
    {
      time: "14:05",
      type: "CREATE",
      mission: "NBLA-241",
      message: "New mission created",
    },
    {
      time: "13:32",
      type: "MERGE",
      mission: "NBLA-238",
      message: "Merged to main",
    },
    {
      time: "12:15",
      type: "AI_RUN",
      mission: "NBLA-239",
      message: "AI execution started",
    },
  ];

  const getTypeSymbol = (type: string) => {
    switch (type) {
      case "APPROVAL":
        return "✓";
      case "COMMIT":
        return "⊕";
      case "REVIEW":
        return "⊙";
      case "CREATE":
        return "+";
      case "MERGE":
        return "⇄";
      case "AI_RUN":
        return "⚡";
      default:
        return "•";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "APPROVAL":
        return "text-green-400";
      case "COMMIT":
        return "text-blue-400";
      case "REVIEW":
        return "text-yellow-400";
      case "CREATE":
        return "text-purple-400";
      case "MERGE":
        return "text-green-400";
      case "AI_RUN":
        return "text-cyan-400";
      default:
        return "text-green-400";
    }
  };

  return (
    <div className="border-2 border-green-500/30 bg-black h-full">
      {/* Header */}
      <div className="border-b-2 border-green-500/30 px-3 py-2 bg-green-950/20">
        <span className="text-green-400 text-sm font-bold">
          ┌─ RECENT ACTIVITY ─┐
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="space-y-1.5 text-xs font-mono">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-2 hover:bg-green-950/20 p-1 transition-colors">
              <span className="text-green-700 flex-shrink-0">[{activity.time}]</span>
              <span className={`${getTypeColor(activity.type)} flex-shrink-0`}>
                {getTypeSymbol(activity.type)}
              </span>
              <span className="text-cyan-400 flex-shrink-0">{activity.mission}</span>
              <span className="text-green-600 truncate">{activity.message}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-green-900/30 mt-3 pt-2">
          <div className="text-green-700 text-xs text-center">
            → 'nebula log' for full history
          </div>
        </div>
      </div>
    </div>
  );
}
