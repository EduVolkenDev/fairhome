import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F8F5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(247,248,245,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E3E7E1', padding: '0 20px',
      }}>
        <div style={{ maxWidth: 480, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: '#6FAF8E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 13 }}>
              CJ
            </div>
            <span style={{ fontWeight: 700, color: '#18201C', fontSize: 15 }}>FairHome</span>
          </div>
          <Link href="/onboarding" style={{
            padding: '9px 18px', borderRadius: 12, background: '#6FAF8E',
            color: 'white', fontWeight: 600, fontSize: 13, textDecoration: 'none',
          }}>
            Começar →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 480, margin: '0 auto', padding: '56px 24px 48px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#E8F4ED', borderRadius: 999, padding: '5px 14px',
          fontSize: 12, fontWeight: 600, color: '#4D8A6D', marginBottom: 24,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6FAF8E', flexShrink: 0 }} />
          Grátis para começar
        </div>

        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#18201C', lineHeight: 1.15, marginBottom: 16 }}>
          Divida as tarefas.
          <br />
          <span style={{ color: '#6FAF8E' }}>Não a paz.</span>
        </h1>

        <p style={{ fontSize: 16, color: '#68736D', lineHeight: 1.6, marginBottom: 32, maxWidth: 320, margin: '0 auto 32px' }}>
          Distribua responsabilidades de forma automática e justa entre todos os moradores.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 280, margin: '0 auto' }}>
          <Link href="/onboarding" style={{
            display: 'block', padding: '16px', borderRadius: 16,
            background: '#6FAF8E', color: 'white', fontWeight: 700,
            fontSize: 15, textDecoration: 'none', textAlign: 'center',
            boxShadow: '0 4px 16px rgba(111,175,142,0.35)',
          }}>
            Criar minha casa grátis →
          </Link>
          <Link href="/dashboard" style={{
            display: 'block', padding: '15px', borderRadius: 16,
            border: '1.5px solid #E3E7E1', background: 'white',
            color: '#68736D', fontWeight: 600, fontSize: 14,
            textDecoration: 'none', textAlign: 'center',
          }}>
            Ver o app funcionando
          </Link>
        </div>

        {/* App Preview */}
        <div style={{
          marginTop: 48, background: 'white', borderRadius: 24,
          border: '1px solid #E3E7E1', padding: '20px',
          boxShadow: '0 8px 32px rgba(24,32,28,0.08)',
          maxWidth: 320, margin: '48px auto 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#A8B5AE', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Esta semana</p>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6FAF8E' }}>75%</span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 6, background: '#E3E7E1', borderRadius: 999, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ width: '75%', height: '100%', background: '#6FAF8E', borderRadius: 999 }} />
          </div>

          {[
            { name: 'Lavar louça', person: 'Edu', pts: 3, done: true, color: '#6FAF8E' },
            { name: 'Tirar lixo', person: 'Maria', pts: 1, done: true, color: '#AFCBFF' },
            { name: 'Aspirar sala', person: 'João', pts: 3, done: false, color: '#FFC9A0' },
            { name: 'Limpar banheiro', person: 'Edu', pts: 5, done: false, color: '#6FAF8E' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 0',
              borderBottom: i < 3 ? '1px solid #F0F2EF' : 'none',
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                background: item.done ? '#6FAF8E' : '#F0F2EF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.done && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>}
              </div>
              <span style={{
                flex: 1, fontSize: 13, fontWeight: 500,
                color: item.done ? '#A8B5AE' : '#18201C',
                textDecoration: item.done ? 'line-through' : 'none',
              }}>{item.name}</span>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: item.color + '28', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: item.color, flexShrink: 0 }}>
                {item.person[0]}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: '#E8F4ED', color: '#4D8A6D', flexShrink: 0 }}>
                {item.pts}pt
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section style={{ background: 'white', borderTop: '1px solid #E3E7E1', borderBottom: '1px solid #E3E7E1', padding: '56px 24px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#6FAF8E', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 8 }}>Como funciona</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#18201C', textAlign: 'center', marginBottom: 36 }}>
            Pronto em 5 minutos
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { n: '1', title: 'Crie a sua casa', desc: 'Nome e tipo de moradia. Só isso.' },
              { n: '2', title: 'Adicione os moradores', desc: 'Sem cadastro complicado.' },
              { n: '3', title: 'Escolha as tarefas', desc: 'O app sugere as mais comuns.' },
              { n: '4', title: 'A rotina se divide sozinha', desc: 'Cada tarefa tem um peso. O equilíbrio é automático.' },
            ].map(({ n, title, desc }) => (
              <div key={n} style={{
                display: 'flex', gap: 16, alignItems: 'flex-start',
                background: '#F7F8F5', borderRadius: 18, padding: '16px 18px',
              }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#6FAF8E', color: 'white', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {n}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#18201C', marginBottom: 3 }}>{title}</p>
                  <p style={{ fontSize: 13, color: '#68736D', lineHeight: 1.4 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferencial */}
      <section style={{ padding: '56px 24px', background: '#E8F4ED' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#4D8A6D', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>O diferencial</p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#18201C', marginBottom: 12 }}>
            Pesos, não contagem
          </h2>
          <p style={{ fontSize: 14, color: '#68736D', maxWidth: 300, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Limpar o banheiro não vale o mesmo que tirar o lixo. O app sabe disso.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { img: '/assets/divisaojusta.png', title: 'Divisão justa', desc: 'Por pontos, não por número de tarefas' },
              { img: '/assets/rodizioautomatico.png', title: 'Rodízio automático', desc: 'Ninguém faz sempre a mesma coisa' },
              { img: '/assets/historicoreal.png', title: 'Histórico real', desc: 'Sem achismo, só dados' },
              { img: '/assets/semcobrancas.png', title: 'Sem cobranças', desc: 'O app fala, você não precisa' },
            ].map(({ img, title, desc }) => (
              <div key={title} style={{ background: 'white', borderRadius: 20, padding: '24px 16px 20px', textAlign: 'center', border: '1px solid rgba(111,175,142,0.2)', boxShadow: '0 4px 16px rgba(111,175,142,0.10)' }}>
                <div style={{ width: 80, height: 80, borderRadius: 22, background: '#F0F8F4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <Image src={img} alt={title} width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain' }} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#18201C', marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: 11, color: '#68736D', lineHeight: 1.4 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: '56px 24px', textAlign: 'center', background: '#F7F8F5' }}>
        <div style={{ maxWidth: 340, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#18201C', marginBottom: 12, lineHeight: 1.2 }}>
            Comece esta semana.
          </h2>
          <p style={{ fontSize: 14, color: '#68736D', marginBottom: 32, lineHeight: 1.6 }}>
            Grátis. Sem instalar nada. Sem cartão de crédito.
          </p>
          <Link href="/onboarding" style={{
            display: 'block', padding: '16px', borderRadius: 16,
            background: '#6FAF8E', color: 'white', fontWeight: 700,
            fontSize: 15, textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(111,175,142,0.35)',
          }}>
            Criar minha casa grátis →
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid #E3E7E1', padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#A8B5AE' }}>© 2025 FairHome · divide tasks, not peace</p>
      </footer>
    </div>
  )
}
