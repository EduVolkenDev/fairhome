export type HouseType = 'friends' | 'couple' | 'family' | 'republic' | 'other'

export interface House {
  id: string
  name: string
  type: HouseType
  createdAt: string
}

export interface Member {
  id: string
  houseId: string
  displayName: string
  email?: string
  avatarColor: string
  role: 'admin' | 'member'
  createdAt: string
}

export type TaskArea =
  | 'Cozinha'
  | 'Banheiro'
  | 'Sala'
  | 'Quarto'
  | 'Geral'

export type TaskFrequency =
  | 'Diário'
  | '3x por semana'
  | 'Semanal'
  | 'Quinzenal'
  | 'Mensal'

export interface Task {
  id: string
  houseId: string
  name: string
  area: TaskArea
  frequency: TaskFrequency
  weight: number
  estimatedMinutes: number
  isActive: boolean
  createdAt: string
}

export type AssignmentStatus = 'pending' | 'done' | 'skipped'

export interface TaskAssignment {
  id: string
  taskId: string
  houseId: string
  memberId: string
  dueDate: string
  status: AssignmentStatus
  completedAt?: string
  points: number
}

export interface WeeklyBalance {
  memberId: string
  weekPoints: number
  totalPoints: number // últimas 4 semanas
}

export interface SuggestedTask {
  name: string
  area: TaskArea
  weight: number
  estimatedMinutes: number
  frequency: TaskFrequency
}
