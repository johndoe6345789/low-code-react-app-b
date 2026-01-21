import { ReactNode, createElement } from 'react'

interface HeadingProps {
  children: ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

const levelClasses = {
  1: 'text-4xl font-bold tracking-tight',
  2: 'text-3xl font-semibold tracking-tight',
  3: 'text-2xl font-semibold tracking-tight',
  4: 'text-xl font-semibold',
  5: 'text-lg font-medium',
  6: 'text-base font-medium',
}

export function Heading({ children, level = 1, className = '' }: HeadingProps) {
  return createElement(
    `h${level}`,
    { className: `${levelClasses[level]} ${className}` },
    children
  )
}
