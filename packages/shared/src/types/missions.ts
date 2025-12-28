export enum MissionPhase {
  Brainstorm = 'brainstorm',
  Design = 'design',
  Plan = 'plan',
  Execute = 'execute',
}

export enum MissionStatus {
  Active = 'active',
  Paused = 'paused',
  Completed = 'completed',
  Aborted = 'aborted',
}

export interface Mission {
  id: string
  ticketId?: string
  phase: MissionPhase
  status: MissionStatus
  createdAt: Date
  updatedAt: Date
}
