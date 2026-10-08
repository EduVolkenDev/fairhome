'use client'

import { useState } from 'react'
import BottomNav from '@/components/layout/BottomNav'
import Header from '@/components/layout/Header'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { getWeeklyBalance } from '@/lib/app-state'
import { useAppState } from '@/lib/use-app-state'

function getMemberStats(memberId: string, assignments: ReturnType<typeof useAppState>['state']['assignments']) {
  const all = assignments.filter((a) => a.memberId === memberId)
  const done = all.filter((a) => a.status === 'done')
  return { total: all.length, done: done.length }
}

export default function MembersPage() {
  const { state, setState } = useAppState()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const balances = getWeeklyBalance(state)
  const maxWeek = Math.max(0, ...balances.map((b) => b.weekPoints))
  const minWeek = Math.min(...balances.map((b) => b.weekPoints))
  const avgWeek = balances.length ? balances.reduce((s, b) => s + b.weekPoints, 0) / balances.length : 0
  const imbalanced = avgWeek > 0 && (avgWeek - minWeek) / avgWeek > 0.35
  const minMember = state.members.find((m) => balances.find((wb) => wb.memberId === m.id)?.weekPoints === minWeek)

  const addMember = () => {
    const trimmedName = name.trim()
    if (!trimmedName) return
    const member = {
      id: `member-${Date.now()}`,
      houseId: state.house.id,
      displayName: trimmedName,
      email: email.trim() || undefined,
      avatarColor: ['#AFCBFF', '#FFC9A0', '#C9AFFF', '#A0D4FF'][state.members.length % 4],
      role: 'member' as const,
      createdAt: new Date().toISOString(),
    }
    setState((prev) => ({
      ...prev,
      members: [...prev.members, member],
      weeklyBalance: [...prev.weeklyBalance, { memberId: member.id, weekPoints: 0, totalPoints: 0 }],
    }))
    setName('')
    setEmail('')
    setShowAdd(false)
  }

  return (
    <div className="app-shell">
      <Header
        title="Moradores"
            subtitle={state.house.name}
        action={
          <button onClick={() => setShowAdd(true)} aria-label="Adicionar morador" style={{ width: 36, height: 36, borderRadius: 12, border: '1.5px solid #E3E7E1', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#68736D' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
          </button>
        }
      />

      <div className="has-bottom-nav" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Alert */}
        {imbalanced && (
          <div style={{ background: '#FFF4E6', borderRadius: 18, padding: '14px 16px', display: 'flex', gap: 12, border: '1px solid #FFE4C0' }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>⚖️</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#18201C' }}>Rotina desequilibrada</p>
              <p style={{ fontSize: 12, color: '#68736D', marginTop: 3, lineHeight: 1.4 }}>
                {minMember?.displayName} recebeu menos pontos esta semana.
              </p>
            </div>
          </div>
        )}

        {/* Member cards */}
        {state.members.map((member) => {
          const stats = getMemberStats(member.id, state.assignments)
          const balance = balances.find((b) => b.memberId === member.id)
          const weekPts = balance?.weekPoints ?? 0
          const pct = maxWeek > 0 ? (weekPts / maxWeek) * 100 : 0

          return (
            <div key={member.id} style={{ background: 'white', borderRadius: 22, border: '1px solid #E3E7E1', padding: '20px', boxShadow: '0 2px 8px rgba(24,32,28,0.06)' }}>
              {/* Top row: avatar + name + score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <Avatar name={member.displayName} color={member.avatarColor} size="lg" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#18201C' }}>{member.displayName}</p>
                    {member.role === 'admin' && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#E8F4ED', color: '#4D8A6D' }}>Admin</span>
                    )}
                  </div>
                  {member.email && <p style={{ fontSize: 12, color: '#A8B5AE', marginTop: 2 }}>{member.email}</p>}
                </div>
                {/* Big score */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 34, fontWeight: 800, color: member.avatarColor, lineHeight: 1 }}>{weekPts}</p>
                  <p style={{ fontSize: 10, color: '#A8B5AE', marginTop: 2 }}>pts / sem.</p>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: 7, background: '#F0F2EF', borderRadius: 999, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: member.avatarColor, borderRadius: 999, transition: 'width 600ms ease' }} />
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: '#F7F8F5', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#18201C', lineHeight: 1 }}>{stats.done}<span style={{ fontSize: 13, fontWeight: 500, color: '#A8B5AE' }}>/{stats.total}</span></p>
                  <p style={{ fontSize: 11, color: '#68736D', marginTop: 4 }}>tarefas feitas</p>
                </div>
                <div style={{ background: '#F7F8F5', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#18201C', lineHeight: 1 }}>{balance?.totalPoints ?? 0}</p>
                  <p style={{ fontSize: 11, color: '#68736D', marginTop: 4 }}>pts (4 semanas)</p>
                </div>
              </div>
            </div>
          )
        })}

        {/* Invite */}
        <button onClick={() => setShowAdd(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', borderRadius: 16, border: '2px dashed #D1D9D4', background: 'transparent', color: '#68736D', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 13V19M21 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 21C3 17.134 5.686 14 9 14C10.53 14 11.94 14.52 13.06 15.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          </svg>
          Convidar morador por link
        </button>
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(24,32,28,0.28)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 430, background: '#F7F8F5', borderRadius: '24px 24px 0 0', padding: '22px 20px max(24px, env(safe-area-inset-bottom))', boxShadow: '0 -8px 30px rgba(24,32,28,0.14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div><p style={{ fontSize: 11, fontWeight: 700, color: '#6FAF8E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Novo morador</p><h2 style={{ fontSize: 21, fontWeight: 800, color: '#18201C', marginTop: 2 }}>Convide alguém da casa</h2></div>
              <button onClick={() => setShowAdd(false)} aria-label="Fechar" style={{ width: 34, height: 34, borderRadius: 12, border: '1px solid #E3E7E1', background: 'white', color: '#68736D', fontSize: 20 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input value={name} onChange={(event) => setName(event.target.value)} autoFocus placeholder="Nome do morador" className="input-base" />
              <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="E-mail (opcional)" className="input-base" />
              <p style={{ fontSize: 12, color: '#68736D', lineHeight: 1.45 }}>O convite por link entra na próxima etapa do produto. Por enquanto, o morador já aparece nesta casa.</p>
              <Button fullWidth size="lg" onClick={addMember} disabled={!name.trim()}>Adicionar morador</Button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
