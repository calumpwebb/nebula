import { Pin as PinIcon, HelpCircle, Lightbulb, AlertCircle, CheckCircle2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import type { Pin } from "./chatTypes";

interface PinsSidebarProps {
  pins: Pin[];
  onRemovePin: (pinId: string) => void;
  onUpdatePin: (pinId: string, updates: Partial<Pin>) => void;
}

export function PinsSidebar({ pins, onRemovePin, onUpdatePin }: PinsSidebarProps) {
  const getCategoryIcon = (category: Pin["category"]) => {
    switch (category) {
      case "question":
        return <HelpCircle className="size-4 text-orange-400" />;
      case "decision":
        return <CheckCircle2 className="size-4 text-green-400" />;
      case "idea":
        return <Lightbulb className="size-4 text-yellow-400" />;
      case "concern":
        return <AlertCircle className="size-4 text-red-400" />;
    }
  };

  const getCategoryColor = (category: Pin["category"]) => {
    switch (category) {
      case "question":
        return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "decision":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "idea":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "concern":
        return "bg-red-500/10 border-red-500/30 text-red-400";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-80 border-l border-gray-800 bg-[#0d0d14] flex flex-col">
      <div className="border-b border-gray-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <PinIcon className="size-5 text-gray-400" />
          <h2 className="text-gray-200">Pins</h2>
          <Badge className="ml-auto bg-purple-500/10 text-purple-400 border-purple-500/30">
            {pins.length}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Deferred decisions & open questions
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {pins.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <PinIcon className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No pins yet</p>
              <p className="text-xs mt-1">
                Important points will appear here
              </p>
            </div>
          )}

          {pins.map((pin) => (
            <div
              key={pin.id}
              className={`
                p-3 rounded-lg border transition-all
                ${
                  pin.resolved
                    ? "bg-gray-900/30 border-gray-800 opacity-60"
                    : "bg-gray-900/50 border-gray-700 hover:border-gray-600"
                }
              `}
            >
              <div className="flex items-start gap-2 mb-2">
                <div className={`p-1.5 rounded border ${getCategoryColor(pin.category)}`}>
                  {getCategoryIcon(pin.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-700 text-gray-400 mb-1"
                  >
                    {pin.category}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemovePin(pin.id)}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                >
                  <X className="size-3" />
                </Button>
              </div>

              <p className="text-sm text-gray-300 mb-2">{pin.content}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {formatTime(pin.createdAt)}
                </span>
                {!pin.resolved && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUpdatePin(pin.id, { resolved: true })}
                    className="h-6 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10"
                  >
                    <CheckCircle2 className="size-3 mr-1" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-gray-800 p-4">
        <p className="text-xs text-gray-500 text-center">
          Pins will be included in the design doc
        </p>
      </div>
    </div>
  );
}
