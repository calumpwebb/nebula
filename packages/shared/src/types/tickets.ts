export enum TicketStatus {
  Backlog = 'backlog',
  InProgress = 'in-progress',
  Blocked = 'blocked',
  Done = 'done',
}

export interface Ticket {
  id: string
  title: string
  description?: string
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
}
