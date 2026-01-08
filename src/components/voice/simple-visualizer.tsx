"use client"

import { cn } from "../../lib/utils"

export interface SimpleVisualizerProps {
  data: number[]
  className?: string
  /** Color for active/lit bars */
  activeColor?: string
  /** Color for inactive/unlit bars */
  inactiveColor?: string
  /** Bar width in pixels */
  barWidth?: number
  /** Bar height in pixels */
  barHeight?: number
  /** Gap between bars in pixels */
  barGap?: number
}

export function SimpleVisualizer({
  data,
  className,
  activeColor: _activeColor = "bg-gray-700",
  inactiveColor: _inactiveColor = "bg-gray-300",
  barWidth = 3,
  barHeight = 16,
  barGap = 2,
}: SimpleVisualizerProps) {
  return (
    <div
      className={cn("flex items-center justify-start", className)}
      style={{ gap: `${barGap}px`, height: `${barHeight * 2}px` }}
    >
      {data.map((value, i) => (
        <div
          key={i}
          style={{
            width: `${barWidth}px`,
            height: `${barHeight}px`,
            backgroundColor: value > 0 ? "#374151" : "#d1d5db",
            borderRadius: "9999px",
            transition: "background-color 75ms",
            willChange: "background-color",
          }}
        />
      ))}
    </div>
  )
}
