export type MissionPhase = "brainstorm" | "design" | "plan" | "execute" | "complete";
export type MissionStatus = "active" | "pending_approval" | "in_review" | "blocked" | "complete";

export interface Mission {
  id: string;
  title: string;
  phase: MissionPhase;
  status: MissionStatus;
  worktree: string;
  createdAt: string;
  updatedAt: string;
  progress: {
    brainstorm: number;
    design: number;
    plan: number;
    execute: number;
  };
  pinCount: number;
  approvals: {
    required: number;
    completed: number;
  };
}

export interface Ticket {
  id: string;
  title: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
  labels: string[];
}

export interface WorktreeInfo {
  name: string;
  branch: string;
  status: "active" | "idle" | "merging";
  commits: number;
}
