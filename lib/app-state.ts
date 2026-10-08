import type {
  House,
  HouseType,
  Member,
  SuggestedTask,
  Task,
  TaskAssignment,
  WeeklyBalance,
} from '@/types'
import {
  mockAssignments,
  mockHouse,
  mockMembers,
  mockTasks,
  mockWeeklyBalance,
  suggestedTasks,
} from './mock-data'

export const APP_STATE_KEY = 'fairhome-app-state-v1'
export const ONBOARDING_DRAFT_KEY = 'fairhome-onboarding-draft-v1'

export interface AppState {
  house: House
  members: Member[]
  tasks: Task[]
  assignments: TaskAssignment[]
  weeklyBalance: WeeklyBalance[]
}

export interface OnboardingDraft {
  houseName: string
  houseType: HouseType
  members: Array<Pick<Member, 'displayName' | 'email' | 'avatarColor'>>
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export function createInitialAppState(): AppState {
  return {
    house: clone(mockHouse),
    members: clone(mockMembers),
    tasks: clone(mockTasks),
    assignments: clone(mockAssignments),
    weeklyBalance: clone(mockWeeklyBalance),
  }
}

export function readAppState(): AppState {
  if (typeof window === 'undefined') return createInitialAppState()

  try {
    const raw = window.localStorage.getItem(APP_STATE_KEY)
    if (!raw) return createInitialAppState()
    const parsed = JSON.parse(raw) as AppState
    if (!parsed.house || !Array.isArray(parsed.members) || !Array.isArray(parsed.tasks)) {
      return createInitialAppState()
    }
    return parsed
  } catch {
    return createInitialAppState()
  }
}

export function saveAppState(state: AppState) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(APP_STATE_KEY, JSON.stringify(state))
  }
}

export function saveOnboardingDraft(draft: OnboardingDraft) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(draft))
  }
}

export function readOnboardingDraft(): OnboardingDraft | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(ONBOARDING_DRAFT_KEY)
    return raw ? (JSON.parse(raw) as OnboardingDraft) : null
  } catch {
    return null
  }
}

export function clearOnboardingDraft() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(ONBOARDING_DRAFT_KEY)
  }
}

export function useableTaskFromSuggested(
  suggestion: SuggestedTask,
  houseId: string,
  index: number
): Task {
  return {
    id: `task-${Date.now()}-${index}`,
    houseId,
    name: suggestion.name,
    area: suggestion.area,
    frequency: suggestion.frequency,
    weight: suggestion.weight,
    estimatedMinutes: suggestion.estimatedMinutes,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
}

function dateForOffset(offset: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return date.toISOString().split('T')[0]
}

export function buildAssignments(tasks: Task[], members: Member[], houseId: string): TaskAssignment[] {
  if (!members.length) return []

  return tasks.map((task, index) => ({
    id: `assignment-${Date.now()}-${index}`,
    taskId: task.id,
    houseId,
    memberId: members[index % members.length].id,
    dueDate: dateForOffset(index % 7),
    status: 'pending',
    points: task.weight,
  }))
}

export function createAppStateFromOnboarding(
  draft: OnboardingDraft,
  selectedNames: Set<string>
): AppState {
  const houseId = `house-${Date.now()}`
  const house: House = {
    id: houseId,
    name: draft.houseName.trim(),
    type: draft.houseType,
    createdAt: new Date().toISOString(),
  }

  const members: Member[] = [
    {
      id: `member-${Date.now()}-owner`,
      houseId,
      displayName: 'Você',
      avatarColor: '#6FAF8E',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    ...draft.members.filter((member) => member.displayName.trim()).map((member, index) => ({
      id: `member-${Date.now()}-${index}`,
      houseId,
      displayName: member.displayName,
      email: member.email || undefined,
      avatarColor: member.avatarColor,
      role: 'member' as const,
      createdAt: new Date().toISOString(),
    })),
  ]

  const tasks = suggestedTasks
    .filter((task) => selectedNames.has(task.name))
    .map((task, index) => useableTaskFromSuggested(task, houseId, index))
  const assignments = buildAssignments(tasks, members, houseId)

  return {
    house,
    members,
    tasks,
    assignments,
    weeklyBalance: members.map((member) => ({ memberId: member.id, weekPoints: 0, totalPoints: 0 })),
  }
}

export function getWeeklyBalance(state: AppState): WeeklyBalance[] {
  return state.members.map((member) => {
    const memberAssignments = state.assignments.filter((assignment) => assignment.memberId === member.id)
    const weekPoints = memberAssignments.reduce((sum, assignment) => sum + assignment.points, 0)
    const completedPoints = memberAssignments
      .filter((assignment) => assignment.status === 'done')
      .reduce((sum, assignment) => sum + assignment.points, 0)

    return {
      memberId: member.id,
      weekPoints,
      totalPoints: Math.max(weekPoints, completedPoints),
    }
  })
}

