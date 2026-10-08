'use client'

import { useState } from 'react'
import BottomNav from '@/components/layout/BottomNav'
import Avatar from '@/components/ui/Avatar'
import { useAppState } from '@/lib/use-app-state'
import { formatDate } from '@/lib/utils'
import type { TaskAssignment } from '@/types'

function groupByDate(assignments: TaskAssignment[]) {
  const groups: Record<string, TaskAssignment[]> = {}
  for (const a of assignments) {
    if (!groups[a.dueDate]) groups[a.dueDate] = []
    groups[a.dueDate].push(a)
  }
  return groups
}

export default function DashboardPage() {
  const { state, setState } = useAppState()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'all'>('upcoming')

  const { house, members, tasks, assignments } = state

  const today = new Date().toISOString().split('T')[0]

  const toggleDone = (id: string) => {
    setState((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'done' ? 'pending' : 'done', completedAt: a.status === 'done' ? undefined : new Date().toISOString() }
          : a
      )
    }))
  }

  const weekDone = assignments.filter((a) => a.status === 'done').length
  const weekTotal = assignments.length
  const weekProgress = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0

  const displayAssignments = activeTab === 'upcoming'
    ? assignments.filter((a) => a.dueDate >= today)
    : assignments

  const grouped = groupByDate(displayAssignments)
  const sortedDates = Object.keys(grouped).sort()

  return (
    <div className="app-shell">

      {/* Header sticky */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(247,248,245,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>

        {/* Top bar */}
        <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: '#A8B5AE', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            🏠 {house.name}
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#18201C', marginTop: 2 }}>
              Esta semana
            </h1>
          </div>
          {/* Member avatars stacked */}
          <div style={{ display: 'flex' }}>
            {members.map((m, i) => (
              <div key={m.id} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: members.length - i, position: 'relative' }}>
                <Avatar name={m.displayName} color={m.avatarColor} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Progress card */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{
            background: 'white', borderRadius: 20,
            border: '1px solid #E3E7E1', padding: '16px 18px',
            boxShadow: '0 2px 8px rgba(24,32,28,0.06)',
          }}>
            {/* Numbers row */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#18201C', lineHeight: 1 }}>{weekDone}</span>
                <span style={{ fontSize: 16, fontWeight: 500, color: '#A8B5AE' }}> / {weekTotal}</span>
                <p style={{ fontSize: 12, color: '#A8B5AE', marginTop: 2 }}>tarefas feitas</p>
              </div>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#6FAF8E', lineHeight: 1 }}>{weekProgress}%</span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 8, background: '#F0F2EF', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${weekProgress}%`, height: '100%', background: '#6FAF8E', borderRadius: 999, transition: 'width 600ms ease' }} />
            </div>

            {/* Member scores */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {members.map((member) => {
                if (!member) return null
                const b = assignments
                  .filter((assignment) => assignment.memberId === member.id)
                  .reduce((sum, assignment) => sum + assignment.points, 0)
                return (
                  <div key={member.id} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, background: '#F7F8F5', borderRadius: 12, padding: '8px 10px' }}>
                    <Avatar name={member.displayName} color={member.avatarColor} size="sm" />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: member.avatarColor, lineHeight: 1 }}>{b}</p>
                      <p style={{ fontSize: 9, color: '#A8B5AE', marginTop: 1 }}>pts</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: '14px 20px' }}>
          <div style={{ display: 'flex', background: '#ECEEED', borderRadius: 14, padding: 4, gap: 3 }}>
            {[
              { key: 'upcoming', label: 'Próximas' },
              { key: 'all', label: 'Semana toda' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as 'upcoming' | 'all')}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 11,
                  fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
                  transition: 'all 150ms',
                  background: activeTab === key ? 'white' : 'transparent',
                  color: activeTab === key ? '#18201C' : '#68736D',
                  boxShadow: activeTab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task groups */}
      <div className="has-bottom-nav" style={{ padding: '4px 20px 8px' }}>
        {sortedDates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 20px' }}>
            <p style={{ fontSize: 48, marginBottom: 12 }}>🎉</p>
            <p style={{ fontWeight: 700, color: '#18201C', fontSize: 17 }}>Tudo em dia!</p>
            <p style={{ fontSize: 13, color: '#68736D', marginTop: 6 }}>Nenhuma tarefa pendente.</p>
          </div>
        )}

        {sortedDates.map((date) => {
          const dateAssignments = grouped[date]
          const label = formatDate(date)
          const isToday = date === today
          const doneCnt = dateAssignments.filter((a) => a.status === 'done').length

          return (
            <div key={date} style={{ marginBottom: 28 }}>
              {/* Date header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isToday ? '#6FAF8E' : '#68736D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {label}
                </span>
                {isToday && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, background: '#E8F4ED', color: '#4D8A6D' }}>
                    HOJE
                  </span>
                )}
                <div style={{ flex: 1, height: 1, background: '#E3E7E1' }} />
                <span style={{ fontSize: 11, color: '#A8B5AE', fontWeight: 600 }}>{doneCnt}/{dateAssignments.length}</span>
              </div>

              {/* Task cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dateAssignments.map((assignment) => {
                  const task = tasks.find((item) => item.id === assignment.taskId)
                  const member = members.find((item) => item.id === assignment.memberId)
                  if (!task || !member) return null
                  const isDone = assignment.status === 'done'

                  return (
                    <div
                      key={assignment.id}
                      style={{
                        background: 'white',
                        borderRadius: 18,
                        border: `1.5px solid ${isDone ? '#D4EBD9' : '#E3E7E1'}`,
                        padding: '14px 16px',
                        display: 'flex', alignItems: 'center', gap: 12,
                        boxShadow: isDone ? 'none' : '0 1px 4px rgba(24,32,28,0.05)',
                        opacity: isDone ? 0.6 : 1,
                        transition: 'all 200ms',
                      }}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleDone(assignment.id)}
                        aria-label={`${isDone ? 'Reabrir' : 'Marcar como concluída'}: ${task.name}`}
                        aria-pressed={isDone}
                        style={{
                          width: 26, height: 26, borderRadius: 9, flexShrink: 0,
                          border: `2px solid ${isDone ? '#6FAF8E' : '#D1D9D4'}`,
                          background: isDone ? '#6FAF8E' : 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 150ms',
                        }}
                      >
                        {isDone && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 14, fontWeight: 600, color: '#18201C',
                          textDecoration: isDone ? 'line-through' : 'none',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {task.name}
                        </p>
                        <p style={{ fontSize: 11, color: '#A8B5AE', marginTop: 2 }}>
                          {task.area} · {task.estimatedMinutes} min
                        </p>
                      </div>

                      {/* Avatar only (no name) */}
                      <Avatar name={member.displayName} color={member.avatarColor} size="sm" />

                      {/* Points */}
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 999,
                        background: isDone ? '#F0F2EF' : '#E8F4ED', color: isDone ? '#A8B5AE' : '#4D8A6D',
                        flexShrink: 0,
                      }}>
                        {assignment.points}pt
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
