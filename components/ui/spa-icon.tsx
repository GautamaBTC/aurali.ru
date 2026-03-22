import { cn } from '@/lib/utils'
import type { LucideIcon, LucideProps } from 'lucide-react'

interface SpaIconProps extends Omit<LucideProps, 'size'> {
  icon: LucideIcon
  size?: 'sm' | 'md' | 'lg'
  tone?: 'primary' | 'muted' | 'light'
}

const sizeClasses: Record<NonNullable<SpaIconProps['size']>, string> = {
  sm: 'h-4 w-4 md:h-5 md:w-5',
  md: 'h-5 w-5 md:h-6 md:w-6',
  lg: 'h-9 w-9 md:h-12 md:w-12',
}

const toneClasses: Record<NonNullable<SpaIconProps['tone']>, string> = {
  primary: 'text-[#d4af37]',
  muted: 'text-[#8c8c8c]',
  light: 'text-[#d9cfc4]',
}

export function SpaIcon({
  icon: Icon,
  size = 'md',
  tone = 'primary',
  className,
  ...props
}: SpaIconProps) {
  return (
    <Icon
      strokeWidth={1.8}
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn(sizeClasses[size], toneClasses[tone], className)}
      {...props}
    />
  )
}

