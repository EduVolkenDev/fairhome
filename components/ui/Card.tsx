import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

export default function Card({ children, className, onClick, padding = 'md' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-[#E3E7E1]',
        paddingMap[padding],
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.99]',
        className
      )}
      style={{ boxShadow: '0 1px 3px rgba(24,32,28,0.06)' }}
    >
      {children}
    </div>
  )
}
