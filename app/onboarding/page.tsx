'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { saveOnboardingDraft } from '@/lib/app-state'

const houseTypes = [
  { id: 'friends', emoji: '👥', label: 'Com amigos', desc: 'República ou repúblicas' },
  { id: 'couple', emoji: '💑', label: 'Com parceiro(a)', desc: 'Moradia a dois' },
  { id: 'family', emoji: '👨‍👩‍👧', label: 'Com a família', desc: 'Casa familiar' },
  { id: 'republic', emoji: '🏠', label: 'República', desc: 'Estudantes ou colega' },
  { id: 'other', emoji: '🏡', label: 'Outro', desc: 'Como preferir' },
]

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

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [houseType, setHouseType] = useState('')
  const [houseName, setHouseName] = useState('')

  if (step === 1) {
    return (
      <div className="app-shell">
        <ProgressBar step={1} total={4} />
        <div className="px-5 pt-8 pb-6">
          <p className="text-xs font-semibold text-[#6FAF8E] uppercase tracking-widest mb-2">Passo 1 de 4</p>
          <h1 className="text-2xl font-bold text-[#18201C] mb-1">Como está sua casa hoje?</h1>
          <p className="text-[#68736D] text-sm mb-8">Isso nos ajuda a sugerir melhores tarefas.</p>

          <div className="space-y-3">
            {houseTypes.map((t) => (
              <button
                key={t.id}
                onClick={() => setHouseType(t.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left"
                style={{
                  borderColor: houseType === t.id ? '#6FAF8E' : '#E3E7E1',
                  background: houseType === t.id ? '#E8F4ED' : 'white',
                }}
              >
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <p className="font-semibold text-[#18201C] text-sm">{t.label}</p>
                  <p className="text-xs text-[#68736D]">{t.desc}</p>
                </div>
                {houseType === t.id && (
                  <div className="ml-auto">
                    <div className="w-5 h-5 rounded-full bg-[#6FAF8E] flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] pb-8 bg-[#F7F8F5]/95 backdrop-blur-sm pt-3">
          <Button
            fullWidth
            size="lg"
            disabled={!houseType}
            onClick={() => setStep(2)}
          >
            Continuar →
          </Button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="app-shell">
        <ProgressBar step={2} total={4} />
        <div className="px-5 pt-8 pb-32">
          <button
            onClick={() => setStep(1)}
            className="text-[#68736D] mb-6 flex items-center gap-1 text-sm"
          >
            ← Voltar
          </button>
          <p className="text-xs font-semibold text-[#6FAF8E] uppercase tracking-widest mb-2">Passo 2 de 4</p>
          <h1 className="text-2xl font-bold text-[#18201C] mb-1">Qual o nome da sua casa?</h1>
          <p className="text-[#68736D] text-sm mb-8">Um apelido fácil de reconhecer.</p>

          <div className="space-y-3 mb-6">
            <input
              type="text"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
              placeholder="Ex: Apartamento 204"
              maxLength={40}
              className="w-full px-4 py-4 rounded-2xl border-2 border-[#E3E7E1] bg-white text-[#18201C] text-base focus:outline-none focus:border-[#6FAF8E] transition-colors placeholder:text-[#A8B5AE]"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs text-[#68736D] font-medium">Sugestões:</p>
            <div className="flex flex-wrap gap-2">
              {['Casa dos Amigos', 'República Centro', 'Ap. 204', 'Casa da Família', 'Nosso Lar'].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setHouseName(s)}
                    className="px-3 py-1.5 rounded-full text-sm border border-[#E3E7E1] bg-white text-[#68736D] hover:border-[#6FAF8E] hover:text-[#4D8A6D] transition-all"
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
        <div className="px-5 fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] pb-8 bg-[#F7F8F5]/95 backdrop-blur-sm pt-3">
          <Button
            fullWidth
            size="lg"
            disabled={houseName.trim().length < 2}
            onClick={() => {
              saveOnboardingDraft({
                houseName,
                houseType: houseType as 'friends' | 'couple' | 'family' | 'republic' | 'other',
                members: [],
              })
              router.push('/onboarding/members')
            }}
          >
            Continuar →
          </Button>
        </div>
      </div>
    )
  }

  return null
}
