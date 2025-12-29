import { Rocket, Ticket, Clock, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface BrainstormActionsProps {
  onDismiss: () => void;
}

export function BrainstormActions({ onDismiss }: BrainstormActionsProps) {
  const handleStartMission = () => {
    alert("🚀 Starting mission! Creating design document...");
  };

  const handleCreateTicket = () => {
    alert("🎫 Creating ticket NBLA-248 for later");
  };

  const handleNotNow = () => {
    alert("Conversation saved. You can resume anytime.");
    onDismiss();
  };

  return (
    <div className="border-t border-gray-800 bg-[#0d0d14]">
      {/* Summary Banner */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-gray-100 mb-2">Brainstorm Complete</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            We've explored the dark mode feature and identified the key
            requirements. Ready to move forward with a design document, or would
            you like to save this for later?
          </p>
          <div className="flex gap-4 mt-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-green-400"></div>
              <span>10 messages exchanged</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-purple-400"></div>
              <span>2 pins created</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-blue-400"></div>
              <span>4 decisions made</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {/* Start Mission */}
          <button
            onClick={handleStartMission}
            className="group relative p-6 rounded-lg border-2 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <Rocket className="size-5 text-green-400" />
              </div>
              <ChevronRight className="size-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-gray-100 mb-1">Start Mission</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Create design doc and begin the full workflow
            </p>
            <div className="mt-3 text-xs text-green-400">Recommended →</div>
          </button>

          {/* Create Ticket */}
          <button
            onClick={handleCreateTicket}
            className="group relative p-6 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Ticket className="size-5 text-blue-400" />
              </div>
              <ChevronRight className="size-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-gray-100 mb-1">Create Ticket</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Save to backlog and work on it later
            </p>
          </button>

          {/* Not Now */}
          <button
            onClick={handleNotNow}
            className="group relative p-6 rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-gray-600 transition-all text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-gray-600/10 border border-gray-600/30">
                <Clock className="size-5 text-gray-400" />
              </div>
              <ChevronRight className="size-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-gray-100 mb-1">Not Now</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Just exploring - save conversation for reference
            </p>
          </button>
        </div>

        <div className="max-w-4xl mx-auto mt-4 text-center">
          <button
            onClick={onDismiss}
            className="text-sm text-gray-500 hover:text-gray-400 underline"
          >
            Continue conversation instead
          </button>
        </div>
      </div>
    </div>
  );
}
