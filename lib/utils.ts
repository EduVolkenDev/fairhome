import type { Member, TaskAssignment } from '@/types'
import { mockMembers, mockAssignments } from './mock-data'

export function getMemberById(id: string): Member | undefined {
  return mockMembers.find((m) => m.id === id)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.toDateString() === today.toDateString()) return 'Hoje'
  if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã'

  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })
}

export function groupAssignmentsByDate(
  assignments: TaskAssignment[]
): Record<string, TaskAssignment[]> {
  return assignments.reduce(
    (acc, a) => {
      if (!acc[a.dueDate]) acc[a.dueDate] = []
      acc[a.dueDate].push(a)
      return acc
    },
    {} as Record<string, TaskAssignment[]>
  )
}

export function getMemberWeekPoints(memberId: string): number {
  return mockAssignments
    .filter((a) => a.memberId === memberId && a.status === 'done')
    .reduce((sum, a) => sum + a.points, 0)
}

export function getMemberTotalPendingPoints(memberId: string): number {
  return mockAssignments
    .filter((a) => a.memberId === memberId)
    .reduce((sum, a) => sum + a.points, 0)
}

export function getBalancePercentage(points: number, maxPoints: number): number {
  if (maxPoints === 0) return 0
  return Math.round((points / maxPoints) * 100)
}

export function getWeightLabel(weight: number): string {
  const labels: Record<number, string> = {
    1: 'Muito leve',
    2: 'Leve',
    3: 'Média',
    5: 'Pesada',
    8: 'Muito pesada',
  }
  return labels[weight] ?? `Peso ${weight}`
}

export function getWeightColor(weight: number): string {
  if (weight <= 1) return 'bg-emerald-100 text-emerald-700'
  if (weight <= 2) return 'bg-blue-100 text-blue-700'
  if (weight <= 3) return 'bg-amber-100 text-amber-700'
  if (weight <= 5) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
