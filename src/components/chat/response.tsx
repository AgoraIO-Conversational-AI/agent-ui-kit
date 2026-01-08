"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export type ResponseProps = React.HTMLAttributes<HTMLDivElement>

export const Response = React.forwardRef<HTMLDivElement, ResponseProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm leading-relaxed break-words whitespace-pre-wrap", className)}
      {...props}
    />
  )
)

Response.displayName = "Response"
