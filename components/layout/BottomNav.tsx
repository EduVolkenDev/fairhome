'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    href: '/dashboard',
    label: 'Início',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
          stroke={active ? '#6FAF8E' : '#A8B5AE'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? '#E8F4ED' : 'none'}
        />
      </svg>
    ),
  },
  {
    href: '/tasks',
    label: 'Tarefas',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3" y="3" width="18" height="18" rx="5"
          stroke={active ? '#6FAF8E' : '#A8B5AE'}
          strokeWidth="1.8"
          fill={active ? '#E8F4ED' : 'none'}
        />
        <path
          d="M7 12L10 15L17 8"
          stroke={active ? '#6FAF8E' : '#A8B5AE'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: '/members',
    label: 'Moradores',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="9" cy="7" r="4"
          stroke={active ? '#6FAF8E' : '#A8B5AE'}
          strokeWidth="1.8"
          fill={active ? '#E8F4ED' : 'none'}
        />
        <path
          d="M3 21C3 17.134 5.68629 14 9 14C10.29 14 11.5 14.37 12.5 15"
          stroke={active ? '#6FAF8E' : '#A8B5AE'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle
          cx="17" cy="9" r="3"
          stroke={active ? '#6FAF8E' : '#A8B5AE'}
          strokeWidth="1.8"
          fill={active ? '#E8F4ED' : 'none'}
        />
        <path
          d="M13.5 21C13.5 18.5 15 17 17 17C19 17 20.5 18.5 20.5 21"
          stroke={active ? '#6FAF8E' : '#A8B5AE'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: '/balance',
    label: 'Equilíbrio',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 20H21"
          stroke={active ? '#6FAF8E' : '#A8B5AE'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M5 20V14M9 20V10M13 20V12M17 20V6M21 20V4"
          stroke={active ? '#6FAF8E' : '#A8B5AE'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 8px 0',
        }}
      >
        {navItems.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '6px 16px',
                borderRadius: '12px',
                background: active ? '#F0FAF5' : 'transparent',
                textDecoration: 'none',
              }}
            >
              {icon(active)}
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#6FAF8E' : '#A8B5AE',
                  letterSpacing: '0.01em',
                }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
