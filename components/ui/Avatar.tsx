import { getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  color?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizePx: Record<string, number> = { sm: 28, md: 36, lg: 44, xl: 64 }
const fontPx: Record<string, number> = { sm: 11, md: 13, lg: 15, xl: 20 }

export default function Avatar({ name, color = '#6FAF8E', size = 'md' }: AvatarProps) {
  const px = sizePx[size]
  const fp = fontPx[size]
  return (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: '999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: fp,
        flexShrink: 0,
        backgroundColor: color + '28',
        color: color,
        letterSpacing: '-0.02em',
      }}
    >
      {getInitials(name)}
    </div>
  )
}
