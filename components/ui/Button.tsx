'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', fullWidth, children, ...props },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-medium rounded-2xl transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

    const variants = {
      primary:
        'bg-[#6FAF8E] text-white hover:bg-[#5A9B7A] shadow-sm',
      secondary:
        'bg-[#E8F4ED] text-[#4D8A6D] hover:bg-[#d4eadb]',
      ghost:
        'bg-transparent text-[#68736D] hover:bg-[#E3E7E1]',
      outline:
        'bg-white border border-[#E3E7E1] text-[#18201C] hover:bg-[#F7F8F5]',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-3 text-sm',
      lg: 'px-6 py-4 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
