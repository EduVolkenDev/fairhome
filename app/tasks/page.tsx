'use client'

import { useState } from 'react'
import BottomNav from '@/components/layout/BottomNav'
import TaskAmbientPager from '@/components/tasks/TaskAmbientPager'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import { buildAssignments } from '@/lib/app-state'
import { useAppState } from '@/lib/use-app-state'
import type { TaskArea, TaskFrequency } from '@/types'

const areas: TaskArea[] = ['Cozinha', 'Banheiro', 'Sala', 'Quarto', 'Geral']
const areaEmoji: Record<TaskArea, string> = {
  Cozinha: '🍳', Banheiro: '🚿', Sala: '🛋️', Quarto: '🛏️', Geral: '🏠',
}
const weightConfig: Record<number, { bg: string; color: string; label: string }> = {
  1: { bg: '#E8F4ED', color: '#4D8A6D', label: 'Leve' },
  2: { bg: '#EEF4FF', color: '#4470CC', label: 'Fácil' },
  3: { bg: '#FEF3C7', color: '#B45309', label: 'Média' },
  4: { bg: '#FFEDD5', color: '#C2410C', label: 'Pesada' },
  5: { bg: '#FEE2E2', color: '#B91C1C', label: 'Difícil' },
}

export default function TasksPage() {
  const { state, setState } = useAppState()
  const [showManage, setShowManage] = useState(false)
  const [activeArea, setActiveArea] = useState<TaskArea | 'Todas'>('Todas')
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [area, setArea] = useState<TaskArea>('Geral')
  const [frequency, setFrequency] = useState<TaskFrequency>('Semanal')
  const [weight, setWeight] = useState(2)
  const filtered = activeArea === 'Todas' ? state.tasks : state.tasks.filter((t) => t.area === activeArea)

  const addTask = () => {
    const trimmedName = name.trim()
    if (!trimmedName) return
    const task = {
      id: `task-${Date.now()}`,
      houseId: state.house.id,
      name: trimmedName,
      area,
      frequency,
      weight,
      estimatedMinutes: weight * 10,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
      assignments: [...prev.assignments, ...buildAssignments([task], prev.members, prev.house.id)],
    }))
    setName('')
    setShowAdd(false)
  }

  const toggleAssignment = (id: string) => setState(prev => ({
    ...prev,
    assignments: prev.assignments.map(a => a.id === id ? {
      ...a,
      status: a.status === 'done' ? 'pending' : 'done',
      completedAt: a.status === 'done' ? undefined : new Date().toISOString(),
    } : a),
  }))

  return (
    <div className={`app-shell ${showManage ? "" : "fair-task-app"}`}>
      {showManage ? <>
      <div className="fair-manager-back"><button type="button" onClick={() => setShowManage(false)}>← Voltar à experiência</button></div>
      <Header
        title="Tarefas"
            subtitle={`${state.tasks.length} tarefas ativas`}
        action={
            <button onClick={() => setShowAdd(true)} aria-label="Adicionar tarefa" style={{ width: 36, height: 36, borderRadius: 12, background: '#6FAF8E', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </button>
        }
      />

      {/* Area filter */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', borderBottom: '1px solid #F0F2EF' }}>
        {(['Todas', ...areas] as const).map((area) => {
          const isActive = activeArea === area
          return (
            <button key={area} onClick={() => setActiveArea(area as TaskArea | 'Todas')} style={{
              padding: '8px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
              whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer', transition: 'all 150ms',
              background: isActive ? '#6FAF8E' : 'white',
              color: isActive ? 'white' : '#68736D',
              border: `1.5px solid ${isActive ? '#6FAF8E' : '#E3E7E1'}`,
            }}>
              {area !== 'Todas' && <span style={{ marginRight: 4 }}>{areaEmoji[area as TaskArea]}</span>}
              {area}
            </button>
          )
        })}
      </div>

      {/* Task list */}
      <div className="has-bottom-nav" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((task) => {
          const wc = weightConfig[task.weight] || { bg: '#F0F2EF', color: '#68736D', label: '' }
          return (
            <div key={task.id} style={{ background: 'white', borderRadius: 20, border: '1px solid #E3E7E1', padding: '16px', boxShadow: '0 1px 4px rgba(24,32,28,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: '#F7F8F5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {areaEmoji[task.area]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#18201C' }}>{task.name}</p>
                  <p style={{ fontSize: 12, color: '#A8B5AE', marginTop: 3 }}>{task.frequency} · {task.estimatedMinutes} min</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: wc.bg, borderRadius: 12, padding: '8px 12px', flexShrink: 0 }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: wc.color, lineHeight: 1 }}>{task.weight}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: wc.color, marginTop: 2 }}>{wc.label}</span>
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #F0F2EF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: '#A8B5AE' }}>🔄 Rodízio automático</span>
                <button type="button" onClick={() => setShowManage(false)} style={{ border: 'none', background: '#F0EEFF', color: '#6653C8', padding: '8px 13px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Ver experiência →</button>
              </div>
            </div>
          )
        })}

        <button onClick={() => setShowAdd(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', borderRadius: 16, border: '2px dashed #D1D9D4', background: 'transparent', color: '#68736D', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          Adicionar tarefa
        </button>
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(24,32,28,0.28)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 430, background: '#F7F8F5', borderRadius: '24px 24px 0 0', padding: '22px 20px max(24px, env(safe-area-inset-bottom))', boxShadow: '0 -8px 30px rgba(24,32,28,0.14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#6FAF8E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Nova tarefa</p>
                <h2 style={{ fontSize: 21, fontWeight: 800, color: '#18201C', marginTop: 2 }}>Adicionar à rotina</h2>
              </div>
              <button onClick={() => setShowAdd(false)} aria-label="Fechar" style={{ width: 34, height: 34, borderRadius: 12, border: '1px solid #E3E7E1', background: 'white', color: '#68736D', fontSize: 20 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input value={name} onChange={(event) => setName(event.target.value)} autoFocus placeholder="Ex: Regar as plantas" className="input-base" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label style={{ fontSize: 12, color: '#68736D', fontWeight: 600 }}>Área<select value={area} onChange={(event) => setArea(event.target.value as TaskArea)} className="input-base" style={{ marginTop: 5, padding: '11px 12px' }}>{areas.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label style={{ fontSize: 12, color: '#68736D', fontWeight: 600 }}>Frequência<select value={frequency} onChange={(event) => setFrequency(event.target.value as TaskFrequency)} className="input-base" style={{ marginTop: 5, padding: '11px 12px' }}>{['Diário', '3x por semana', 'Semanal', 'Quinzenal', 'Mensal'].map((item) => <option key={item}>{item}</option>)}</select></label>
              </div>
              <label style={{ fontSize: 12, color: '#68736D', fontWeight: 600 }}>Peso: {weight} pontos<input type="range" min="1" max="5" value={weight} onChange={(event) => setWeight(Number(event.target.value))} style={{ width: '100%', accentColor: '#6FAF8E', marginTop: 8 }} /></label>
              <Button fullWidth size="lg" onClick={addTask} disabled={!name.trim()}>Adicionar tarefa</Button>
            </div>
          </div>
        </div>
      )}

      </> : <TaskAmbientPager tasks={state.tasks} assignments={state.assignments} members={state.members} onToggle={toggleAssignment} onManage={() => setShowManage(true)} />}
      <BottomNav />
    </div>
  )
}
