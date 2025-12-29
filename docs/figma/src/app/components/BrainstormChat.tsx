import { useState } from "react";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";
import { PinsSidebar } from "./chat/PinsSidebar";
import { BrainstormActions } from "./chat/BrainstormActions";
import { mockMessages, mockPins } from "./chat/mockChatData";
import type { Message, Pin } from "./chat/chatTypes";

export function BrainstormChat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [pins, setPins] = useState<Pin[]>(mockPins);
  const [verboseMode, setVerboseMode] = useState(false);
  const [showActions, setShowActions] = useState(true);

  const addMessage = (content: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `m${Date.now() + 1}`,
        role: "assistant",
        content: "I understand. Let me think about that...",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const addPin = (pin: Pin) => {
    setPins([...pins, pin]);
  };

  const removePin = (pinId: string) => {
    setPins(pins.filter((p) => p.id !== pinId));
  };

  const updatePin = (pinId: string, updates: Partial<Pin>) => {
    setPins(pins.map((p) => (p.id === pinId ? { ...p, ...updates } : p)));
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f]">
      <ChatHeader
        verboseMode={verboseMode}
        onToggleVerbose={() => setVerboseMode(!verboseMode)}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <ChatMessages
            messages={messages}
            verboseMode={verboseMode}
            onCreatePin={addPin}
          />

          {showActions ? (
            <BrainstormActions onDismiss={() => setShowActions(false)} />
          ) : (
            <ChatInput onSendMessage={addMessage} />
          )}
        </div>

        <PinsSidebar
          pins={pins}
          onRemovePin={removePin}
          onUpdatePin={updatePin}
        />
      </div>
    </div>
  );
}
