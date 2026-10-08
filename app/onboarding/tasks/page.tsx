'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { suggestedTasks } from '@/lib/mock-data'
import {
  clearOnboardingDraft,
  createAppStateFromOnboarding,
  readOnboardingDraft,
  saveAppState,
} from '@/lib/app-state'
import type { TaskArea } from '@/types'

const areas: TaskArea[] = ['Cozinha', 'Banheiro', 'Sala', 'Quarto', 'Geral']

const areaEmoji: Record<TaskArea, string> = {
  Cozinha: '🍳',
  Banheiro: '🚿',
  Sala: '🛋️',
  Quarto: '🛏️',
  Geral: '🏠',
}

const weightColor: Record<number, string> = {
  1: '#4D8A6D',
  2: '#4470CC',
  3: '#B45309',
  4: '#C2410C',
  5: '#B91C1C',
}

const weightBg: Record<number, string> = {
  1: '#E8F4ED',
  2: '#EEF4FF',
  3: '#FEF3C7',
  4: '#FFF7ED',
  5: '#FEF2F2',
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 px-5 pt-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full transition-all duration-300"
          style={{ background: i < step ? '#6FAF8E' : '#E3E7E1' }}
        />
      ))}
    </div>
  )
}

export default function TasksOnboarding() {
  const router = useRouter()
  const [selectedArea, setSelectedArea] = useState<TaskArea>('Cozinha')
  const [selected, setSelected] = useState<Set<string>>(
    new Set(['Lavar louça', 'Tirar lixo', 'Limpar vaso', 'Aspirar/varrer sala'])
  )

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const areaTasks = suggestedTasks.filter((t) => t.area === selectedArea)

  return (
    <div className="app-shell">
      <ProgressBar step={4} total={4} />
      <div className="px-5 pt-6 pb-36">
        <Link href="/onboarding/members" className="text-[#68736D] mb-5 flex items-center gap-1 text-sm">
          ← Voltar
        </Link>
        <p className="text-xs font-semibold text-[#6FAF8E] uppercase tracking-widest mb-2">
          Passo 4 de 4
        </p>
        <h1 className="text-2xl font-bold text-[#18201C] mb-1">Escolha as tarefas da casa</h1>
        <p className="text-[#68736D] text-sm mb-5">
          Selecione as que fazem parte da rotina.{' '}
          <span className="font-medium text-[#18201C]">{selected.size} selecionadas</span>
        </p>

        {/* Area tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {areas.map((area) => {
            const count = suggestedTasks.filter((t) => t.area === area && selected.has(t.name)).length
            return (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: selectedArea === area ? '#6FAF8E' : 'white',
                  color: selectedArea === area ? 'white' : '#68736D',
                  border: `1.5px solid ${selectedArea === area ? '#6FAF8E' : '#E3E7E1'}`,
                }}
              >
                <span>{areaEmoji[area]}</span>
                {area}
                {count > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center"
                    style={{
                      background: selectedArea === area ? 'rgba(255,255,255,0.3)' : '#E8F4ED',
                      color: selectedArea === area ? 'white' : '#4D8A6D',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tasks list */}
        <div className="space-y-2">
          {areaTasks.map((task) => {
            const isSelected = selected.has(task.name)
            return (
              <button
                key={task.name}
                onClick={() => toggle(task.name)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left"
                style={{
                  borderColor: isSelected ? '#6FAF8E' : '#E3E7E1',
                  background: isSelected ? '#F0FAF5' : 'white',
                }}
              >
                {/* Checkbox */}
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: isSelected ? '#6FAF8E' : 'white',
                    border: `2px solid ${isSelected ? '#6FAF8E' : '#E3E7E1'}`,
                  }}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#18201C] text-sm">{task.name}</p>
                  <p className="text-xs text-[#68736D] mt-0.5">{task.frequency} · {task.estimatedMinutes} min</p>
                </div>

                {/* Weight badge */}
                <span
                  className="text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0"
                  style={{
                    background: weightBg[task.weight] || '#F0F2EF',
                    color: weightColor[task.weight] || '#68736D',
                  }}
                >
                  {task.weight}pt
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-5 fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] pb-8 bg-[#F7F8F5]/95 backdrop-blur-sm pt-3">
        <Button
          fullWidth
          size="lg"
          disabled={selected.size === 0}
          onClick={() => {
            const draft = readOnboardingDraft()
            if (!draft) {
              router.push('/dashboard')
              return
            }
            saveAppState(createAppStateFromOnboarding(draft, selected))
            clearOnboardingDraft()
            router.push('/dashboard')
          }}
        >
          Criar rotina justa ({selected.size} tarefas) →
        </Button>
      </div>
    </div>
  )
}
