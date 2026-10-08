# Casa Justa / FairHome — MVP

> Divida as tarefas da casa sem dividir a paz.

## Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Telas

| URL | Tela |
|-----|------|
| `/` | Landing page |
| `/onboarding` | Passo 1-2: tipo de casa + nome |
| `/onboarding/members` | Passo 3: adicionar moradores |
| `/onboarding/tasks` | Passo 4: escolher tarefas |
| `/dashboard` | Dashboard semanal |
| `/tasks` | Lista de tarefas |
| `/members` | Moradores + pontos |
| `/balance` | Equilíbrio + histórico |

## Stack
- Next.js 15 + App Router + TypeScript
- Tailwind CSS v4
- Dados iniciais mockados com persistência local no navegador (`localStorage`)
- Onboarding completo: casa, moradores, tarefas e geração da primeira rotina
- Ações funcionais no MVP: concluir tarefas, adicionar tarefas/moradores e reequilibrar a próxima semana

## Próximos passos
1. Supabase (auth + banco, substituindo a persistência local)
2. Magic link para convites
3. Algoritmo de distribuição semanal por peso
4. Stripe (plano Plus)
5. PWA + notificações
