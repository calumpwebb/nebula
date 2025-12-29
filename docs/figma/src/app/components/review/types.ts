export interface Document {
  id: string;
  title: string;
  content: string;
}

export interface Comment {
  id: string;
  documentId: string;
  author: string;
  authorType: "human" | "ai";
  content: string;
  timestamp: string;
  lineStart?: number;
  lineEnd?: number;
  resolved: boolean;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  author: string;
  authorType: "human" | "ai";
  content: string;
  timestamp: string;
}
