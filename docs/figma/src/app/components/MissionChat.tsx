import { useState } from "react";
import { ChatHeader } from "./mission-chat/ChatHeader";
import { ChatMessages } from "./mission-chat/ChatMessages";
import { ChatInput } from "./mission-chat/ChatInput";
import { MissionContext } from "./mission-chat/MissionContext";

export function MissionChat() {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      // Handle sending message
      console.log("Send:", input);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="max-w-7xl mx-auto h-screen flex flex-col">
        <ChatHeader />
        
        <div className="flex-1 flex gap-4 overflow-hidden mt-4">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col border-2 border-green-500/30 bg-black">
            <ChatMessages />
            <ChatInput 
              value={input}
              onChange={setInput}
              onSend={handleSend}
            />
          </div>

          {/* Mission Context Sidebar */}
          <div className="w-80">
            <MissionContext />
          </div>
        </div>
      </div>
    </div>
  );
}
