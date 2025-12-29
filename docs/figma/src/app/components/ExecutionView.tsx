import { ExecutionHeader } from "./execution/ExecutionHeader";
import { FileChanges } from "./execution/FileChanges";
import { LiveLogs } from "./execution/LiveLogs";
import { ExecutionProgress } from "./execution/ExecutionProgress";

export function ExecutionView() {
  return (
    <div className="h-screen flex flex-col bg-black">
      <ExecutionHeader />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left - File Changes & Diff */}
        <div className="flex-1 border-r border-gray-900 flex flex-col">
          <FileChanges />
        </div>

        {/* Right - Progress & Logs */}
        <div className="w-96 flex flex-col">
          <ExecutionProgress />
          <LiveLogs />
        </div>
      </div>
    </div>
  );
}
