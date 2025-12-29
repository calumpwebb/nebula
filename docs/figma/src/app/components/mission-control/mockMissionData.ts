import type { Mission, Ticket, WorktreeInfo } from "./missionTypes";

export const mockMissions: Mission[] = [
  {
    id: "NBLA-241",
    title: "Add dark mode support",
    phase: "design",
    status: "in_review",
    worktree: "nbla-241-dark-mode",
    createdAt: "2024-01-15T14:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    progress: {
      brainstorm: 100,
      design: 80,
      plan: 0,
      execute: 0,
    },
    pinCount: 2,
    approvals: {
      required: 1,
      completed: 0,
    },
  },
  {
    id: "NBLA-239",
    title: "Implement user authentication flow",
    phase: "execute",
    status: "active",
    worktree: "nbla-239-auth",
    createdAt: "2024-01-14T10:00:00Z",
    updatedAt: "2024-01-15T15:00:00Z",
    progress: {
      brainstorm: 100,
      design: 100,
      plan: 100,
      execute: 45,
    },
    pinCount: 0,
    approvals: {
      required: 3,
      completed: 3,
    },
  },
  {
    id: "NBLA-235",
    title: "Refactor API error handling",
    phase: "plan",
    status: "pending_approval",
    worktree: "nbla-235-error-handling",
    createdAt: "2024-01-13T16:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
    progress: {
      brainstorm: 100,
      design: 100,
      plan: 90,
      execute: 0,
    },
    pinCount: 1,
    approvals: {
      required: 2,
      completed: 2,
    },
  },
];

export const mockTickets: Ticket[] = [
  {
    id: "NBLA-248",
    title: "Add animation to theme transitions",
    priority: "low",
    createdAt: "2024-01-15T14:05:00Z",
    labels: ["enhancement", "ui"],
  },
  {
    id: "NBLA-247",
    title: "Investigate slow database queries",
    priority: "high",
    createdAt: "2024-01-15T09:00:00Z",
    labels: ["performance", "backend"],
  },
  {
    id: "NBLA-246",
    title: "Update dependencies to latest versions",
    priority: "medium",
    createdAt: "2024-01-14T15:00:00Z",
    labels: ["maintenance"],
  },
  {
    id: "NBLA-244",
    title: "Add export to CSV feature",
    priority: "medium",
    createdAt: "2024-01-13T11:00:00Z",
    labels: ["feature", "data"],
  },
];

export const mockWorktrees: WorktreeInfo[] = [
  {
    name: "main",
    branch: "main",
    status: "idle",
    commits: 0,
  },
  {
    name: "nbla-241-dark-mode",
    branch: "feature/dark-mode",
    status: "active",
    commits: 3,
  },
  {
    name: "nbla-239-auth",
    branch: "feature/auth-flow",
    status: "active",
    commits: 12,
  },
  {
    name: "nbla-235-error-handling",
    branch: "refactor/error-handling",
    status: "idle",
    commits: 7,
  },
];
