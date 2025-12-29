import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800 bg-[#0d0d14] px-6 py-4">
      <div className="max-w-4xl mx-auto flex gap-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Continue the conversation... (Shift+Enter for new line)"
          className="flex-1 bg-gray-900 border-gray-700 text-gray-200 min-h-[60px] max-h-[200px] resize-none"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white self-end"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}
