import { MissionControlHeader } from "./mission-control/MissionControlHeader";
import { ActiveMissions } from "./mission-control/ActiveMissions";
import { RepositoryOverview } from "./mission-control/RepositoryOverview";
import { BacklogPanel } from "./mission-control/BacklogPanel";

export function MissionControl() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f]">
      <MissionControlHeader />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Active Missions */}
        <div className="w-80 border-r border-gray-800 bg-[#0d0d14] flex flex-col">
          <ActiveMissions />
        </div>

        {/* Center - Repository Overview */}
        <div className="flex-1 overflow-auto">
          <RepositoryOverview />
        </div>

        {/* Right Panel - Backlog & Observability */}
        <div className="w-80 border-l border-gray-800 bg-[#0d0d14] flex flex-col">
          <BacklogPanel />
        </div>
      </div>
    </div>
  );
}
