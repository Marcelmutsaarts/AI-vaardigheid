import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  indicatorColor?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, indicatorColor, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        className={cn(
          'relative h-3 w-full overflow-hidden rounded-full bg-muted',
          className
        )}
        {...props}
      >
        <div
          className="h-full transition-all duration-300 ease-in-out rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: indicatorColor || '#a15df5',
          }}
        />
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export { Progress }
