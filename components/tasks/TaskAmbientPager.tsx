'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Member, Task, TaskAssignment } from '@/types'

interface TaskAmbientPagerProps {
  tasks: Task[]
  assignments: TaskAssignment[]
  members: Member[]
  onToggle: (assignmentId: string) => void
  onManage: () => void
}

type Theme = {
  asset: string
  symbol: string
  label: string
  background: string
  accent: string
}

const themes: Record<string, Theme> = {
  trash: { asset: 'trash.webp', symbol: '♻', label: 'Verde menta', background: 'linear-gradient(155deg, #F8FFFD 0%, #D8F4EC 51%, #BCE8E0 100%)', accent: '#278D83' },
  dishes: { asset: 'dishes.webp', symbol: '✧', label: 'Azul céu', background: 'linear-gradient(155deg, #FAFDFF 0%, #DDEEFE 49%, #BFDDFC 100%)', accent: '#487ECA' },
  laundry: { asset: 'laundry.webp', symbol: '◈', label: 'Lavanda', background: 'linear-gradient(155deg, #FFFCFF 0%, #F0E5FC 48%, #DCCCF2 100%)', accent: '#9870C6' },
  vacuum: { asset: 'vacuum.webp', symbol: '✦', label: 'Azul piscina', background: 'linear-gradient(155deg, #F8FEFF 0%, #DBF5F8 50%, #B4E3E9 100%)', accent: '#368C9A' },
  kitchen: { asset: 'kitchen.webp', symbol: '✳', label: 'Pêssego', background: 'linear-gradient(155deg, #FFFDFC 0%, #FFEBDD 49%, #FAD4C3 100%)', accent: '#CC8C67' },
  bathroom: { asset: 'bathroom.webp', symbol: '✧', label: 'Orquídea', background: 'linear-gradient(155deg, #FEFDFF 0%, #E8E4FD 52%, #CBCBF7 100%)', accent: '#7E75C9' },
  bedding: { asset: 'bedding.webp', symbol: '♡', label: 'Rosa claro', background: 'linear-gradient(155deg, #FFFCFE 0%, #FAE7F0 52%, #F0C9DC 100%)', accent: '#C47B9D' },
  generic: { asset: '', symbol: '✦', label: 'Verde suave', background: 'linear-gradient(155deg, #FDFFFE 0%, #E5EFEA 51%, #CCDED4 100%)', accent: '#6D9A83' },
}

function getTheme(task: Task): Theme {
  const name = task.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  if (/lixo|recicla/.test(name)) return themes.trash
  if (/louca|prato|copo/.test(name)) return themes.dishes
  if (/roupa|lavanderia|estender|passar roupa/.test(name)) return themes.laundry
  if (/aspirar|varrer|po dos moveis|pano no chao/.test(name)) return themes.vacuum
  if (/banheiro|vaso|box|banheira|sabonete|toalha/.test(name)) return themes.bathroom
  if (/cozinha|fogao|bancada|pia|geladeira|produto de limpeza/.test(name)) return themes.kitchen
  if (/cama|lencol|quarto|armario/.test(name)) return themes.bedding
  return themes.generic
}

function TaskArt({ theme }: { theme: Theme }) {
  const [isMissing, setIsMissing] = useState(false)
  return (
    <div className="fair-task-artbox" aria-hidden="true">
      <div className="fair-task-aura" style={{ background: theme.accent }} />
      {theme.asset && !isMissing
        ? <img className="fair-task-art" src={`/assets/tasks/${theme.asset}`} alt="" draggable={false} onError={() => setIsMissing(true)} />
        : <div className="fair-task-art-fallback" style={{ color: theme.accent }}>{theme.symbol}</div>}
    </div>
  )
}

function TaskScene({
  task, assignments, members, onToggle, onManage, position, total, isLeaving, hasNext, onNext,
}: {
  task: Task
  assignments: TaskAssignment[]
  members: Member[]
  onToggle: (id: string) => void
  onManage: () => void
  position: number
  total: number
  isLeaving: boolean
  hasNext: boolean
  onNext: () => void
}) {
  const theme = getTheme(task)
  const assignment = assignments.find(item => item.taskId === task.id && item.status === 'pending') ??
    assignments.find(item => item.taskId === task.id)
  const person = members.find(member => member.id === assignment?.memberId)
  const complete = assignment?.status === 'done'
  const date = assignment?.dueDate
  const dueLabel = date ? new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : task.frequency
  return (
    <section className={`fair-task-scene ${isLeaving ? 'fair-scene-leaving' : 'fair-scene-entering'}`} style={{ background: theme.background }} aria-label={`${position} de ${total}: ${task.name}`} aria-hidden={isLeaving}>
      <div className="fair-task-topbar">
        <div className="fair-task-logo">Fair Home <span aria-hidden="true">♥</span><small>Nossa casa, mais leve</small></div>
        <button className="fair-task-manage" type="button" onClick={onManage} aria-label="Gerenciar tarefas">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.5V5m0 14v1.5M20.5 12H19M5 12H3.5m14.55-6.05-1.06 1.06m-9.98 9.98-1.06 1.06m12.1 0-1.06-1.06M7.01 7.01 5.95 5.95" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2"/></svg>
        </button>
      </div>

      <div className="fair-task-heading">
        <span className="fair-task-eyebrow" style={{ color: theme.accent }}>TAREFA {position.toString().padStart(2, '0')} <span className="fair-task-separator">/ {total.toString().padStart(2, '0')}</span></span>
        <h1>{task.name}</h1>
        <p>Um cuidado de cada vez.</p>
      </div>

      <TaskArt theme={theme} />

      {hasNext && (
        <button type="button" onClick={onNext} className="fair-task-next" aria-label="Próxima tarefa abaixo" title="Próxima tarefa">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v16m-7-7 7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>DESÇA</span>
        </button>
      )}

      <div className="fair-task-bottom-content">
        <div className="fair-task-glass">
          <div className="fair-task-row">
            <div className="fair-task-person">
              <span className="fair-task-avatar" style={{ background: theme.accent + '24', color: theme.accent }}>{person?.displayName?.charAt(0).toUpperCase() ?? '♡'}</span>
              <div><small>Responsável</small><strong>{person?.displayName || 'A definir'}</strong></div>
            </div>
            <div className="fair-task-date"><small>{assignment ? 'Programada' : 'Frequência'}</small><strong>{dueLabel}</strong></div>
          </div>
          <div className="fair-task-meta">
            <span>{task.estimatedMinutes} min estimados</span>
            <span className="fair-task-meta-dot">·</span>
            <span>{task.area}</span>
            <span className="fair-task-meta-dot">·</span>
            <span>{task.weight} {task.weight === 1 ? 'ponto' : 'pontos'}</span>
          </div>
          <button
            type="button"
            className="fair-task-complete"
            disabled={!assignment}
            onClick={() => assignment && onToggle(assignment.id)}
            aria-pressed={complete}
          >
            <span className="fair-task-check" aria-hidden="true">✓</span>
            <span>{!assignment ? 'Aguardando distribuição' : complete ? 'Concluída · Reabrir' : 'Marcar como concluída'}</span>
          </button>
        </div>
        <div className="fair-task-progress" aria-label={`Tarefa ${position} de ${total}`}>
          <span>Deslize para {hasNext ? 'a próxima tarefa' : 'voltar'}</span>
          <div className="fair-task-dots">{Array.from({length: Math.min(total, 7)}, (_, i) => <span key={i} className={Math.min(Math.floor((position - 1) / Math.max(1, total / 7)), 6) === i ? 'active' : ''} />)}</div>
        </div>
      </div>
    </section>
  )
}

export default function TaskAmbientPager({ tasks, assignments, members, onToggle, onManage }: TaskAmbientPagerProps) {
  const [index, setIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const indexRef = useRef(0)
  const touchStart = useRef<number | null>(null)
  const lockedUntil = useRef(0)
  const wheelAccum = useRef(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const root = useRef<HTMLDivElement>(null)

  const move = useCallback((direction: number) => {
    if (Date.now() < lockedUntil.current) return
    const next = Math.max(0, Math.min(tasks.length - 1, indexRef.current + direction))
    if (next === indexRef.current) return
    lockedUntil.current = Date.now() + 950
    wheelAccum.current = 0
    setPreviousIndex(indexRef.current)
    indexRef.current = next
    setIndex(next)
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setPreviousIndex(null), 870)
  }, [tasks.length])

  useEffect(() => {
    const element = root.current
    if (!element) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      if (Date.now() < lockedUntil.current) return
      wheelAccum.current += event.deltaY
      if (Math.abs(wheelAccum.current) >= 55) move(wheelAccum.current > 0 ? 1 : -1)
    }
    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [move])

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown'].includes(event.key)) { event.preventDefault(); move(1) }
      if (['ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); move(-1) }
    }
    window.addEventListener('keydown', keyHandler)
    return () => window.removeEventListener('keydown', keyHandler)
  }, [move])
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current) }, [])

  const current = tasks[index]
  const previous = previousIndex !== null ? tasks[previousIndex] : null
  if (!current) return null

  return (
    <main
      className="fair-task-pager"
      ref={root}
      aria-label="Tarefas em sequência vertical"
      onTouchStart={event => { touchStart.current = event.touches[0]?.clientY ?? null }}
      onTouchEnd={event => {
        if (touchStart.current === null) return
        const delta = touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current)
        touchStart.current = null
        if (Math.abs(delta) > 45) move(delta > 0 ? 1 : -1)
      }}
    >
      {previous && <TaskScene key={`out-${previous.id}`} task={previous} assignments={assignments} members={members} onToggle={onToggle} onManage={onManage} position={previousIndex! + 1} total={tasks.length} isLeaving hasNext={previousIndex! < tasks.length - 1} onNext={() => move(1)} />}
      <TaskScene key={current.id} task={current} assignments={assignments} members={members} onToggle={onToggle} onManage={onManage} position={index + 1} total={tasks.length} isLeaving={false} hasNext={index < tasks.length - 1} onNext={() => move(1)} />
    </main>
  )
}
