'use client'

import { useEffect, useState } from 'react'
import type { Task, TaskAssignment, Member } from '@/types'

type Props = {
  tasks: Task[]
  index: number
  assignments: TaskAssignment[]
  members: Member[]
  onNavigate: (index: number) => void
  onClose: () => void
  onToggle: (id: string) => void
}

const themes = {
  trash: { color: '#95DED2', ink: '#145F63', shade: '#E5F9F6', file: 'trash.webp', symbol: '♻' },
  dishes: { color: '#A8CFF7', ink: '#425E95', shade: '#EDF6FF', file: 'dishes.webp', symbol: '✧' },
  laundry: { color: '#C9B4ED', ink: '#69448C', shade: '#F6EEFF', file: 'laundry.webp', symbol: '◈' },
  vacuum: { color: '#B0D9F2', ink: '#496D8B', shade: '#EAF7FE', file: 'vacuum.webp', symbol: '✦' },
  bathroom: { color: '#A7DDEB', ink: '#316E81', shade: '#E9FAFC', file: 'bathroom.webp', symbol: '✧' },
  kitchen: { color: '#F1CB9F', ink: '#876043', shade: '#FFF5EA', file: 'kitchen.webp', symbol: '✳' },
  bedding: { color: '#E8BFD3', ink: '#80526C', shade: '#FFF0F7', file: 'bedding.webp', symbol: '♡' },
  generic: { color: '#C6D7CF', ink: '#46665B', shade: '#F2F8F4', file: '', symbol: '✦' },
} as const

function themeFor(task: Task) {
  const name = task.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  if (/lixo|recicla/.test(name)) return themes.trash
  if (/louca|prato/.test(name)) return themes.dishes
  if (/roupa|lavanderia|lavar roupa|estender/.test(name)) return themes.laundry
  if (/aspirar|varrer|aspirador/.test(name)) return themes.vacuum
  if (/banheiro|vaso|box|banheira|sabonete/.test(name)) return themes.bathroom
  if (/cozinha|fogao|bancada|geladeira/.test(name)) return themes.kitchen
  if (/cama|lencol|quarto/.test(name)) return themes.bedding
  return themes.generic
}

function AmbientArtwork({ file, symbol }: { file: string; symbol: string }) {
  const [failed, setFailed] = useState(false)
  if (!file || failed) {
    return <span className="ambient-art-fallback" aria-hidden="true">{symbol}</span>
  }
  return <img src={`/assets/tasks/${file}`} className="ambient-art-image" alt="" onError={() => setFailed(true)} />
}

export default function TaskAmbientOverlay({ tasks, index, assignments, members, onNavigate, onClose, onToggle }: Props) {
  const task = tasks[index]
  const [renderedIndex, setRenderedIndex] = useState(index)
  const [incoming, setIncoming] = useState(true)
  useEffect(() => {
    if (index === renderedIndex) return
    setIncoming(false)
    const timer = window.setTimeout(() => {
      setRenderedIndex(index)
      setIncoming(true)
    }, 260)
    return () => window.clearTimeout(timer)
  }, [index, renderedIndex])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!task) return null
  const shown = tasks[renderedIndex] ?? task
  const theme = themeFor(shown)
  const selectedAssignment = assignments.find(a => a.taskId === shown.id && a.status === 'pending') ??
    assignments.find(a => a.taskId === shown.id)
  const assignee = members.find(m => m.id === selectedAssignment?.memberId)
  const isDone = selectedAssignment?.status === 'done'

  return (
    <div className="ambient-overlay" role="dialog" aria-modal="true" aria-label={`Detalhes da tarefa: ${shown.name}`}>
      <div className="ambient-scene" style={{ background: `radial-gradient(circle at 80% 24%, ${theme.color}90, transparent 57%), linear-gradient(160deg, #FFFFFF 0%, ${theme.shade} 65%, #F8F5FF 100%)` }}>
        <div className="ambient-scene-top">
          <span className="ambient-brand">Fair Home <span aria-hidden="true">♥</span></span>
          <button type="button" className="ambient-close" onClick={onClose} aria-label="Fechar detalhes">×</button>
        </div>
        <div className={`ambient-fade ${incoming ? 'ambient-visible' : ''}`} key={renderedIndex}>
          <div className="ambient-headline">
            <span className="ambient-kicker">NOSSA CASA, MAIS LEVE</span>
            <h2>{shown.name}</h2>
            <p>Um cuidado de cada vez.</p>
          </div>
          <div className="ambient-art-wrap">
            <div className="ambient-art-glow" style={{ background: theme.color }} />
            <AmbientArtwork file={theme.file} symbol={theme.symbol} />
          </div>
          <div className="ambient-content">
            <div className="ambient-glass">
              <div className="ambient-details">
                <div><small>Responsável</small><strong>{assignee?.displayName ?? 'A definir'}</strong></div>
                <div><small>Quando</small><strong>{selectedAssignment?.dueDate ?? shown.frequency}</strong></div>
              </div>
              <p className="ambient-subtitle">{shown.estimatedMinutes} min estimados · {shown.area}</p>
              {selectedAssignment ? (
                <button className="ambient-cta" type="button" onClick={() => onToggle(selectedAssignment.id)}>
                  {isDone ? '✓ Concluída · Reabrir' : '✓ Marcar como concluída'}
                </button>
              ) : (
                <p className="ambient-no-assignment">Sem atribuição disponível para esta tarefa.</p>
              )}
            </div>
            <div className="ambient-stepper">
              <button type="button" onClick={() => onNavigate((index - 1 + tasks.length) % tasks.length)} aria-label="Tarefa anterior">←</button>
              <span>{index + 1} de {tasks.length} tarefas</span>
              <button type="button" onClick={() => onNavigate((index + 1) % tasks.length)} aria-label="Próxima tarefa">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
