interface ProgressBarProps {
  value: number // 0–100
  color?: string
  className?: string
  height?: number
}

export default function ProgressBar({
  value,
  color = '#6FAF8E',
  className = '',
  height = 6,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      className={`w-full rounded-full overflow-hidden bg-[#E3E7E1] ${className}`}
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}
