'use client'

import { useState } from 'react'
import BottomNav from '@/components/layout/BottomNav'
import Header from '@/components/layout/Header'
import Avatar from '@/components/ui/Avatar'
import { getWeeklyBalance } from '@/lib/app-state'
import { useAppState } from '@/lib/use-app-state'

const weekHistory = [
  { week: 'Sem. 1', data: { 'member-1': 11, 'member-2': 10, 'member-3': 9 } },
  { week: 'Sem. 2', data: { 'member-1': 12, 'member-2': 11, 'member-3': 4 } },
  { week: 'Sem. 3', data: { 'member-1': 10, 'member-2': 11, 'member-3': 4 } },
  { week: 'Atual',  data: { 'member-1': 12, 'member-2': 10, 'member-3': 4 } },
]

export default function BalancePage() {
  const { state, setState } = useAppState()
  const [rebalanced, setRebalanced] = useState(false)
  const balances = getWeeklyBalance(state)
  const maxWeek = Math.max(0, ...balances.map((b) => b.weekPoints))
  const maxTotal = Math.max(0, ...balances.map((b) => b.totalPoints))
  const minWeek = Math.min(...balances.map((b) => b.weekPoints))
  const minMember = state.members.find((m) => balances.find((wb) => wb.memberId === m.id)?.weekPoints === minWeek)
  const sorted = [...balances].sort((a, b) => b.totalPoints - a.totalPoints)
  const currentData = Object.fromEntries(balances.map((balance) => [balance.memberId, balance.weekPoints]))
  const chartHistory = weekHistory.map(({ week }, index) => ({
    week,
    data: Object.fromEntries(state.members.map((member) => [
      member.id,
      week === 'Atual' ? currentData[member.id] ?? 0 : Math.round((currentData[member.id] ?? 0) * (0.78 + index * 0.07)),
    ])),
  }))

  const rebalance = () => {
    if (!state.members.length) return
    const points = new Map(state.members.map((member) => [member.id, 0]))
    const assignments = [...state.assignments]
      .sort((a, b) => b.points - a.points)
      .map((assignment) => {
        const nextMember = [...state.members].sort((a, b) => (points.get(a.id) ?? 0) - (points.get(b.id) ?? 0))[0]
        points.set(nextMember.id, (points.get(nextMember.id) ?? 0) + assignment.points)
        return { ...assignment, memberId: nextMember.id }
      })
    setState((prev) => ({ ...prev, assignments }))
    setRebalanced(true)
  }

  return (
    <div className="app-shell">
      <Header title="Equilíbrio" subtitle="Últimas 4 semanas" />

      <div className="has-bottom-nav" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Tip */}
        <div style={{ background: '#FFF4E6', borderRadius: 18, padding: '16px', display: 'flex', gap: 12, border: '1px solid #FFE4C0' }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#18201C' }}>{minMember?.displayName} está com menos pontos</p>
            <p style={{ fontSize: 12, color: '#68736D', marginTop: 3, lineHeight: 1.4 }}>A próxima semana compensa automaticamente.</p>
          </div>
        </div>

        {/* This week */}
        <div style={{ background: 'white', borderRadius: 22, border: '1px solid #E3E7E1', padding: '20px', boxShadow: '0 2px 8px rgba(24,32,28,0.06)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#A8B5AE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 18 }}>Esta semana</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[...balances].sort((a, b) => b.weekPoints - a.weekPoints).map((balance) => {
              const member = state.members.find((m) => m.id === balance.memberId)
              if (!member) return null
              const pct = maxWeek > 0 ? (balance.weekPoints / maxWeek) * 100 : 0
              return (
                <div key={balance.memberId}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <Avatar name={member.displayName} color={member.avatarColor} size="sm" />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#18201C', flex: 1 }}>{member.displayName}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: member.avatarColor }}>{balance.weekPoints}<span style={{ fontSize: 11, fontWeight: 500, color: '#A8B5AE' }}> pts</span></span>
                  </div>
                  <div style={{ height: 8, background: '#F0F2EF', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: member.avatarColor, borderRadius: 999, transition: 'width 600ms ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 4-week table */}
        <div style={{ background: 'white', borderRadius: 22, border: '1px solid #E3E7E1', overflow: 'hidden', boxShadow: '0 2px 8px rgba(24,32,28,0.06)' }}>
          <div style={{ padding: '20px 20px 0' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#A8B5AE', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Histórico — 4 semanas</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F0F2EF' }}>
                <th style={{ padding: '8px 20px', textAlign: 'left', fontSize: 11, color: '#A8B5AE', fontWeight: 600 }}>Morador</th>
                <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 11, color: '#A8B5AE', fontWeight: 600 }}>Atual</th>
                <th style={{ padding: '8px 20px', textAlign: 'left', fontSize: 11, color: '#A8B5AE', fontWeight: 600 }}>4 semanas</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((balance) => {
                const member = state.members.find((m) => m.id === balance.memberId)
                if (!member) return null
                const totalPct = maxTotal > 0 ? (balance.totalPoints / maxTotal) * 100 : 0
                return (
                  <tr key={balance.memberId} style={{ borderBottom: '1px solid #F7F8F5' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar name={member.displayName} color={member.avatarColor} size="sm" />
                        <span style={{ fontWeight: 600, color: '#18201C', fontSize: 13 }}>{member.displayName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 800, color: member.avatarColor, fontSize: 16 }}>{balance.weekPoints}</span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: '#F0F2EF', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ width: `${totalPct}%`, height: '100%', background: member.avatarColor, borderRadius: 999 }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#18201C', width: 28, textAlign: 'right' }}>{balance.totalPoints}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Bar chart */}
        <div style={{ background: 'white', borderRadius: 22, border: '1px solid #E3E7E1', padding: '20px', boxShadow: '0 2px 8px rgba(24,32,28,0.06)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#A8B5AE', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Pontos por semana</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
            {chartHistory.map(({ week, data }) => {
              const weekMax = Math.max(...Object.values(data))
              const isNow = week === 'Atual'
              return (
                <div key={week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', gap: 2, height: 64 }}>
                    {state.members.map((m) => {
                      const pts = (isNow ? currentData[m.id] : data[m.id as keyof typeof data]) || 0
                      const h = weekMax > 0 ? (pts / weekMax) * 100 : 0
                      return <div key={m.id} style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0', background: m.avatarColor, opacity: isNow ? 1 : 0.4 }} />
                    })}
                  </div>
                  <span style={{ fontSize: 10, fontWeight: isNow ? 700 : 400, color: isNow ? '#6FAF8E' : '#A8B5AE' }}>{week}</span>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 16 }}>
            {state.members.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.avatarColor }} />
                <span style={{ fontSize: 11, color: '#68736D', fontWeight: 500 }}>{m.displayName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rebalance */}
        <button onClick={rebalance} style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#E8F4ED', border: 'none', color: '#4D8A6D', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          ⚖️ Reequilibrar próxima semana
        </button>
        {rebalanced && <p style={{ textAlign: 'center', color: '#4D8A6D', fontSize: 12, fontWeight: 600 }}>Próxima semana redistribuída entre os moradores.</p>}
      </div>

      <BottomNav />
    </div>
  )
}
