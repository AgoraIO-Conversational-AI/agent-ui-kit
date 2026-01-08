"use client"

import * as React from "react"

export type ChipProps = React.HTMLAttributes<HTMLDivElement>

export const Chip = React.forwardRef<HTMLDivElement, ChipProps>(({ children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-card-layer-1 relative inline-flex items-center justify-center gap-2 rounded-full p-3"
      {...props}
    >
      {children}
    </div>
  )
})

Chip.displayName = "Chip"
