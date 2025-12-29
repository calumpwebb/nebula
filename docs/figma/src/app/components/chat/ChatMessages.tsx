import { useRef, useEffect } from "react";
import { Bot, User, Pin as PinIcon, Wrench } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import type { Message, Pin } from "./chatTypes";

interface ChatMessagesProps {
  messages: Message[];
  verboseMode: boolean;
  onCreatePin: (pin: Pin) => void;
}

export function ChatMessages({
  messages,
  verboseMode,
  onCreatePin,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 overflow-hidden bg-[#0a0a0f]">
      <ScrollArea className="h-full">
        <div ref={scrollRef} className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`
                flex-shrink-0 p-2 rounded-lg h-fit
                ${
                  message.role === "assistant"
                    ? "bg-purple-500/10 border border-purple-500/30"
                    : "bg-blue-500/10 border border-blue-500/30"
                }
              `}
              >
                {message.role === "assistant" ? (
                  <Bot className="size-5 text-purple-400" />
                ) : (
                  <User className="size-5 text-blue-400" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {message.role === "assistant" ? "Nebula AI" : "You"}
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatTime(message.timestamp)}
                  </span>
                </div>

                {/* Verbose: Show reasoning */}
                {verboseMode && message.reasoning && (
                  <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs uppercase text-yellow-400 tracking-wide">
                        Internal Reasoning
                      </span>
                    </div>
                    <p className="text-sm text-yellow-200/80 italic">
                      {message.reasoning}
                    </p>
                  </div>
                )}

                {/* Verbose: Show tool calls */}
                {verboseMode && message.toolCalls && (
                  <div className="space-y-2">
                    {message.toolCalls.map((tool) => (
                      <div
                        key={tool.id}
                        className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-3 font-mono text-xs"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="size-3 text-cyan-400" />
                          <span className="text-cyan-400">{tool.name}</span>
                        </div>
                        <div className="text-gray-400 space-y-1">
                          <div>
                            <span className="text-cyan-300">Input:</span>{" "}
                            {JSON.stringify(tool.input)}
                          </div>
                          {tool.output && (
                            <div>
                              <span className="text-cyan-300">Output:</span>{" "}
                              {tool.output}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Main message content */}
                <div
                  className={`
                  rounded-lg p-4 
                  ${
                    message.role === "assistant"
                      ? "bg-gray-800/50 border border-gray-700"
                      : "bg-blue-500/10 border border-blue-500/20"
                  }
                `}
                >
                  <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
