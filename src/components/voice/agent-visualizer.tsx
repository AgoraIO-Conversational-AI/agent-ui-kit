"use client"

import * as React from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

import { cn } from "../../lib/utils"

export type AgentVisualizerState =
  | "not-joined"
  | "joining"
  | "ambient"
  | "listening"
  | "analyzing"
  | "talking"
  | "disconnected"

export type AgentVisualizerSize = "sm" | "md" | "lg"

export interface AgentVisualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current state of the agent visualizer
   */
  state: AgentVisualizerState

  /**
   * Size of the visualizer
   * @default "md"
   */
  size?: AgentVisualizerSize

  /**
   * Base path for lottie files.
   * @default "/agora-uikit/lottie"
   * @example "https://cdn.example.com/lottie"
   * @example "/custom-path/lottie"
   */
  lottieBasePath?: string

  /**
   * Custom paths for specific states. Overrides lottieBasePath for specified states.
   * @example { "listening": "https://cdn.example.com/custom-listening.lottie" }
   */
  lottiePaths?: Partial<Record<AgentVisualizerState, string>>
}

const stateToLottieFile: Record<AgentVisualizerState, string> = {
  "not-joined": "Dark Mode - 340p - 01 - Not Joined.lottie",
  joining: "Dark Mode - 340p - 02 - Joining.lottie",
  ambient: "Dark Mode - 340p - 03 - Ambient.lottie",
  listening: "Dark Mode - 340p - 04 - Listening v3.2.lottie",
  analyzing: "Dark Mode - 340p - 05 - Analyzing - Scale Down Once.lottie",
  talking: "Dark Mode - 340p - 06 - Talking v3.lottie",
  disconnected: "Dark Mode - 340p - 07 - Disconnected.lottie",
}

const stateToText: Record<AgentVisualizerState, string> = {
  "not-joined": "Not Joined",
  joining: "Joining",
  ambient: "Ambient",
  listening: "Listening",
  analyzing: "Analyzing",
  talking: "Talking",
  disconnected: "Disconnected",
}

const sizeClasses: Record<AgentVisualizerSize, { container: string; text: string }> = {
  sm: {
    container: "w-32 h-32",
    text: "text-sm",
  },
  md: {
    container: "w-48 h-48",
    text: "text-base",
  },
  lg: {
    container: "w-64 h-64",
    text: "text-lg",
  },
}

export const AgentVisualizer = React.forwardRef<HTMLDivElement, AgentVisualizerProps>(
  (
    {
      state,
      size = "md",
      lottieBasePath = "/agora-uikit/lottie",
      lottiePaths,
      className,
      ...props
    },
    ref
  ) => {
    const lottieFileName = stateToLottieFile[state]
    const displayText = stateToText[state]
    const sizeConfig = sizeClasses[size]

    // Use custom path if provided, otherwise construct from base path
    const lottieSrc = lottiePaths?.[state] || `${lottieBasePath}/${lottieFileName}`

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center gap-4", className)}
        {...props}
      >
        <div className={cn("flex items-center justify-center", sizeConfig.container)}>
          <DotLottieReact src={lottieSrc} loop autoplay className="h-full w-full" />
        </div>
        {displayText && (
          <p className={cn("text-foreground text-center font-medium", sizeConfig.text)}>
            {displayText}
          </p>
        )}
      </div>
    )
  }
)

AgentVisualizer.displayName = "AgentVisualizer"
