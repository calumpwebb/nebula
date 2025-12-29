import { AsciiLogo } from "./AsciiLogo";
import { SystemStatus } from "./SystemStatus";
import { QuickStats } from "./QuickStats";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";
import { ActiveMissions } from "./ActiveMissions";
import { ResourceMonitor } from "./ResourceMonitor";

export function TerminalContent() {
  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="space-y-4">
        <AsciiLogo />
        
        {/* Top Row - System Status & Resource Monitor */}
        <div className="grid grid-cols-2 gap-4">
          <SystemStatus />
          <ResourceMonitor />
        </div>

        {/* Middle Row - Stats & Active Missions */}
        <div className="grid grid-cols-3 gap-4">
          <QuickStats />
          <div className="col-span-2">
            <ActiveMissions />
          </div>
        </div>

        {/* Bottom Row - Activity & Actions */}
        <div className="grid grid-cols-2 gap-4">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
