import type {
  House,
  Member,
  Task,
  TaskAssignment,
  WeeklyBalance,
  SuggestedTask,
} from '@/types'

export const mockHouse: House = {
  id: 'house-1',
  name: 'Apartamento 204',
  type: 'friends',
  createdAt: '2024-01-01',
}

export const mockMembers: Member[] = [
  {
    id: 'member-1',
    houseId: 'house-1',
    displayName: 'Edu',
    email: 'edu@email.com',
    avatarColor: '#6FAF8E',
    role: 'admin',
    createdAt: '2024-01-01',
  },
  {
    id: 'member-2',
    houseId: 'house-1',
    displayName: 'Maria',
    email: 'maria@email.com',
    avatarColor: '#AFCBFF',
    role: 'member',
    createdAt: '2024-01-01',
  },
  {
    id: 'member-3',
    houseId: 'house-1',
    displayName: 'João',
    email: 'joao@email.com',
    avatarColor: '#FFC9A0',
    role: 'member',
    createdAt: '2024-01-01',
  },
]

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    houseId: 'house-1',
    name: 'Limpar banheiro',
    area: 'Banheiro',
    frequency: 'Semanal',
    weight: 5,
    estimatedMinutes: 30,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'task-2',
    houseId: 'house-1',
    name: 'Lavar louça',
    area: 'Cozinha',
    frequency: 'Diário',
    weight: 3,
    estimatedMinutes: 20,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'task-3',
    houseId: 'house-1',
    name: 'Tirar lixo',
    area: 'Geral',
    frequency: '3x por semana',
    weight: 1,
    estimatedMinutes: 5,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'task-4',
    houseId: 'house-1',
    name: 'Aspirar sala',
    area: 'Sala',
    frequency: 'Semanal',
    weight: 3,
    estimatedMinutes: 20,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'task-5',
    houseId: 'house-1',
    name: 'Limpar cozinha',
    area: 'Cozinha',
    frequency: 'Semanal',
    weight: 5,
    estimatedMinutes: 40,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'task-6',
    houseId: 'house-1',
    name: 'Trocar roupa de cama',
    area: 'Quarto',
    frequency: 'Quinzenal',
    weight: 2,
    estimatedMinutes: 15,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'task-7',
    houseId: 'house-1',
    name: 'Lavar roupa',
    area: 'Geral',
    frequency: 'Semanal',
    weight: 2,
    estimatedMinutes: 60,
    isActive: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'task-8',
    houseId: 'house-1',
    name: 'Comprar produtos de limpeza',
    area: 'Geral',
    frequency: 'Mensal',
    weight: 2,
    estimatedMinutes: 30,
    isActive: true,
    createdAt: '2024-01-01',
  },
]

// Datas relativas à semana atual para a demo
const today = new Date()
const getDate = (offset: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

export const mockAssignments: TaskAssignment[] = [
  // Hoje
  {
    id: 'a-1',
    taskId: 'task-3',
    houseId: 'house-1',
    memberId: 'member-1',
    dueDate: getDate(0),
    status: 'pending',
    points: 1,
  },
  {
    id: 'a-2',
    taskId: 'task-2',
    houseId: 'house-1',
    memberId: 'member-2',
    dueDate: getDate(0),
    status: 'done',
    completedAt: new Date().toISOString(),
    points: 3,
  },
  // Amanhã
  {
    id: 'a-3',
    taskId: 'task-4',
    houseId: 'house-1',
    memberId: 'member-3',
    dueDate: getDate(1),
    status: 'pending',
    points: 3,
  },
  {
    id: 'a-4',
    taskId: 'task-7',
    houseId: 'house-1',
    memberId: 'member-1',
    dueDate: getDate(1),
    status: 'pending',
    points: 2,
  },
  // Esta semana
  {
    id: 'a-5',
    taskId: 'task-1',
    houseId: 'house-1',
    memberId: 'member-3',
    dueDate: getDate(2),
    status: 'pending',
    points: 5,
  },
  {
    id: 'a-6',
    taskId: 'task-5',
    houseId: 'house-1',
    memberId: 'member-2',
    dueDate: getDate(3),
    status: 'pending',
    points: 5,
  },
  {
    id: 'a-7',
    taskId: 'task-6',
    houseId: 'house-1',
    memberId: 'member-1',
    dueDate: getDate(4),
    status: 'pending',
    points: 2,
  },
  {
    id: 'a-8',
    taskId: 'task-3',
    houseId: 'house-1',
    memberId: 'member-2',
    dueDate: getDate(4),
    status: 'pending',
    points: 1,
  },
]

export const mockWeeklyBalance: WeeklyBalance[] = [
  { memberId: 'member-1', weekPoints: 12, totalPoints: 46 },
  { memberId: 'member-2', weekPoints: 10, totalPoints: 43 },
  { memberId: 'member-3', weekPoints: 4, totalPoints: 21 },
]

export const suggestedTasks: SuggestedTask[] = [
  // Cozinha
  { name: 'Lavar louça', area: 'Cozinha', weight: 3, estimatedMinutes: 20, frequency: 'Diário' },
  { name: 'Limpar bancada', area: 'Cozinha', weight: 2, estimatedMinutes: 10, frequency: 'Diário' },
  { name: 'Limpar fogão', area: 'Cozinha', weight: 3, estimatedMinutes: 20, frequency: 'Semanal' },
  { name: 'Limpar geladeira', area: 'Cozinha', weight: 3, estimatedMinutes: 30, frequency: 'Mensal' },
  { name: 'Tirar lixo', area: 'Geral', weight: 1, estimatedMinutes: 5, frequency: '3x por semana' },
  // Banheiro
  { name: 'Limpar vaso', area: 'Banheiro', weight: 5, estimatedMinutes: 20, frequency: 'Semanal' },
  { name: 'Limpar pia', area: 'Banheiro', weight: 3, estimatedMinutes: 10, frequency: 'Semanal' },
  { name: 'Limpar box/banheira', area: 'Banheiro', weight: 4, estimatedMinutes: 20, frequency: 'Semanal' },
  { name: 'Trocar toalhas', area: 'Banheiro', weight: 1, estimatedMinutes: 5, frequency: 'Semanal' },
  { name: 'Repor papel/sabonete', area: 'Banheiro', weight: 1, estimatedMinutes: 5, frequency: 'Semanal' },
  // Sala
  { name: 'Aspirar/varrer sala', area: 'Sala', weight: 3, estimatedMinutes: 20, frequency: 'Semanal' },
  { name: 'Passar pano no chão', area: 'Sala', weight: 3, estimatedMinutes: 20, frequency: 'Semanal' },
  { name: 'Organizar objetos', area: 'Sala', weight: 2, estimatedMinutes: 15, frequency: 'Diário' },
  { name: 'Tirar pó dos móveis', area: 'Sala', weight: 2, estimatedMinutes: 15, frequency: 'Quinzenal' },
  // Quarto
  { name: 'Trocar roupa de cama', area: 'Quarto', weight: 2, estimatedMinutes: 15, frequency: 'Quinzenal' },
  { name: 'Organizar armário', area: 'Quarto', weight: 2, estimatedMinutes: 20, frequency: 'Mensal' },
  { name: 'Aspirar/varrer quarto', area: 'Quarto', weight: 2, estimatedMinutes: 15, frequency: 'Semanal' },
  // Geral
  { name: 'Lavar roupa', area: 'Geral', weight: 2, estimatedMinutes: 60, frequency: 'Semanal' },
  { name: 'Estender roupa', area: 'Geral', weight: 1, estimatedMinutes: 15, frequency: 'Semanal' },
  { name: 'Guardar roupa', area: 'Geral', weight: 1, estimatedMinutes: 15, frequency: 'Semanal' },
  { name: 'Comprar produtos de limpeza', area: 'Geral', weight: 2, estimatedMinutes: 30, frequency: 'Mensal' },
]

export const WEIGHT_LABELS: Record<number, string> = {
  1: 'Muito leve',
  2: 'Leve',
  3: 'Média',
  5: 'Pesada',
  8: 'Muito pesada',
}
