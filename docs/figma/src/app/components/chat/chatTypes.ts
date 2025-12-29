export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  reasoning?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, any>;
  output?: string;
}

export interface Pin {
  id: string;
  content: string;
  category: "question" | "decision" | "idea" | "concern";
  createdAt: string;
  resolved?: boolean;
}
