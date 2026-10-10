import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './ambient-tasks.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F7F8F5',
}

export const metadata: Metadata = {
  title: 'FairHome — Divide tasks, not peace',
  description:
    'Organize household tasks in a simple, fair and automatic way among all housemates.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  )
}
