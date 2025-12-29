import { useState } from "react";
import { Check, X, Clock, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ApprovalActions() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showDefer, setShowDefer] = useState(false);

  const handleApprove = () => {
    alert("✓ Design approved! Moving to Plan phase...");
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      setShowFeedback(true);
      return;
    }
    alert(`✗ Design rejected with feedback:\n\n${feedback}`);
    setFeedback("");
    setShowFeedback(false);
  };

  const handleDefer = (option: string) => {
    alert(`Deferred to ${option}`);
    setShowDefer(false);
  };

  return (
    <div className="border-t border-gray-800 bg-[#0d0d14] px-6 py-4">
      {showFeedback && (
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">
            Feedback for AI
          </label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Explain what needs to change..."
            className="bg-gray-900 border-gray-700 text-gray-200 min-h-[100px] mb-2"
          />
          <p className="text-xs text-gray-500">
            AI will iterate on the design based on your feedback
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">
            Review complete?
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu open={showDefer} onOpenChange={setShowDefer}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              >
                <Clock className="size-4 mr-2" />
                Not Now
                <ChevronDown className="size-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-900 border-gray-700"
            >
              <DropdownMenuItem
                onClick={() => handleDefer("Ticket")}
                className="text-gray-300 focus:bg-gray-800 focus:text-gray-100"
              >
                Convert to Ticket
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDefer("Next Week")}
                className="text-gray-300 focus:bg-gray-800 focus:text-gray-100"
              >
                Defer to Next Week
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDefer("Parking Lot")}
                className="text-gray-300 focus:bg-gray-800 focus:text-gray-100"
              >
                Move to Parking Lot
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setShowFeedback(!showFeedback)}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
          >
            <X className="size-4 mr-2" />
            Request Changes
          </Button>

          <Button
            onClick={handleApprove}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Check className="size-4 mr-2" />
            Approve & Continue
          </Button>
        </div>
      </div>

      {showFeedback && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleReject}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Submit Feedback
          </Button>
        </div>
      )}
    </div>
  );
}
