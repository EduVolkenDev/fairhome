'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { readOnboardingDraft, saveOnboardingDraft } from '@/lib/app-state'

const avatarColors = ['#6FAF8E', '#AFCBFF', '#FFC9A0', '#C9AFFF', '#FFD1B0', '#A0D4FF']

interface MemberForm {
  id: string
  name: string
  email: string
  color: string
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

export default function MembersOnboarding() {
  const router = useRouter()
  const [members, setMembers] = useState<MemberForm[]>([
    { id: '1', name: '', email: '', color: avatarColors[0] },
  ])
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const addMember = () => {
    if (newName.trim()) {
      setMembers((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: newName.trim(),
          email: newEmail.trim(),
          color: avatarColors[prev.length % avatarColors.length],
        },
      ])
      setNewName('')
      setNewEmail('')
      setShowAdd(false)
    }
  }

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="app-shell">
      <ProgressBar step={3} total={4} />
      <div className="px-5 pt-8 pb-36">
        <Link href="/onboarding" className="text-[#68736D] mb-6 flex items-center gap-1 text-sm">
          ← Voltar
        </Link>
        <p className="text-xs font-semibold text-[#6FAF8E] uppercase tracking-widest mb-2">
          Passo 3 de 4
        </p>
        <h1 className="text-2xl font-bold text-[#18201C] mb-1">Quem mora com você?</h1>
        <p className="text-[#68736D] text-sm mb-6">
          Adicione as pessoas da casa. E-mail é opcional por enquanto.
        </p>

        {/* Você mesmo */}
        <div
          className="bg-[#E8F4ED] rounded-2xl p-4 mb-3 flex items-center gap-3"
        >
          <Avatar name="Você" color="#6FAF8E" size="md" />
          <div>
            <p className="font-semibold text-[#18201C] text-sm">Você</p>
            <p className="text-xs text-[#68736D]">Criador da casa</p>
          </div>
          <span className="ml-auto text-xs font-medium px-2 py-1 rounded-full bg-[#6FAF8E] text-white">
            Admin
          </span>
        </div>

        {/* Moradores adicionados */}
        {members.filter((m) => m.name).map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-2xl p-4 mb-3 flex items-center gap-3 border border-[#E3E7E1]"
          >
            <Avatar name={member.name} color={member.color} size="md" />
            <div className="flex-1">
              <p className="font-semibold text-[#18201C] text-sm">{member.name}</p>
              {member.email && (
                <p className="text-xs text-[#68736D]">{member.email}</p>
              )}
            </div>
            <button
              onClick={() => removeMember(member.id)}
              className="text-[#A8B5AE] hover:text-red-400 transition-colors p-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* Form novo morador */}
        {showAdd ? (
          <div className="bg-white rounded-2xl p-4 border-2 border-[#6FAF8E] mb-3 space-y-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome do morador"
              autoFocus
              className="w-full px-3 py-3 rounded-xl border border-[#E3E7E1] text-[#18201C] text-sm focus:outline-none focus:border-[#6FAF8E] transition-colors placeholder:text-[#A8B5AE]"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="E-mail (opcional)"
              className="w-full px-3 py-3 rounded-xl border border-[#E3E7E1] text-[#18201C] text-sm focus:outline-none focus:border-[#6FAF8E] transition-colors placeholder:text-[#A8B5AE]"
            />
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)} fullWidth>
                Cancelar
              </Button>
              <Button size="sm" onClick={addMember} fullWidth disabled={!newName.trim()}>
                Adicionar
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-[#E3E7E1] text-[#68736D] hover:border-[#6FAF8E] hover:text-[#4D8A6D] transition-all"
          >
            <div className="w-9 h-9 rounded-full border-2 border-dashed border-current flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">Adicionar morador</span>
          </button>
        )}

        <p className="text-xs text-[#A8B5AE] text-center mt-4">
          Você pode convidar mais pessoas depois, por link.
        </p>
      </div>

      <div className="px-5 fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] pb-8 bg-[#F7F8F5]/95 backdrop-blur-sm pt-3">
        <Button
          fullWidth
          size="lg"
          onClick={() => {
            const draft = readOnboardingDraft()
            if (draft) {
              saveOnboardingDraft({
                ...draft,
                members: members
                  .filter((member) => member.name.trim())
                  .map((member) => ({
                    displayName: member.name.trim(),
                    email: member.email.trim(),
                    avatarColor: member.color,
                  })),
              })
            }
            router.push('/onboarding/tasks')
          }}
        >
          Continuar →
        </Button>
      </div>
    </div>
  )
}
