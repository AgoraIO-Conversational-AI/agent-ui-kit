"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export interface VideoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Avatar video content (top-right, largest area)
   */
  avatar?: React.ReactNode

  /**
   * Chat/conversation content (top-left)
   */
  chat?: React.ReactNode

  /**
   * Local video preview (bottom-left)
   */
  localVideo?: React.ReactNode

  /**
   * Controls (buttons, selectors) (bottom-right)
   */
  controls?: React.ReactNode
}

/**
 * Desktop 2x2 grid layout for video chat application
 *
 * Layout:
 * ┌─────────────┬─────────────┐
 * │ Chat        │ Avatar      │
 * │ (40%)       │ (60%)       │
 * ├─────────────┼─────────────┤
 * │ Local Video │ Controls    │
 * │ (40%)       │ (60%)       │
 * └─────────────┴─────────────┘
 */
export const VideoGrid = React.forwardRef<HTMLDivElement, VideoGridProps>(
  ({ className, avatar, chat, localVideo, controls: _controls, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid h-full w-full", className)}
        style={{
          gridTemplateColumns: "40% 60%",
          gridTemplateRows: "1fr 1fr",
          gap: "1rem",
        }}
        {...props}
      >
        {/* Top-left: Chat */}
        <div
          className="overflow-hidden rounded-lg border bg-card shadow-lg"
          style={{ gridRow: "1" }}
        >
          {chat}
        </div>

        {/* Right: Avatar (spans 2 rows) */}
        <div
          className="overflow-hidden rounded-lg border bg-card shadow-lg"
          style={{ gridRow: "1 / 3", gridColumn: "2" }}
        >
          {avatar}
        </div>

        {/* Bottom-left: Local Video */}
        <div
          className="overflow-hidden rounded-lg border bg-card shadow-lg"
          style={{ gridRow: "2" }}
        >
          {localVideo}
        </div>

        {/* Bottom-right is empty in this layout, controls overlay on avatar */}
      </div>
    )
  }
)

VideoGrid.displayName = "VideoGrid"

/**
 * Alternative layout where controls take bottom-right position
 */
export const VideoGridWithControls = React.forwardRef<HTMLDivElement, VideoGridProps>(
  ({ className, avatar, chat, localVideo, controls, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid h-full w-full gap-4", "grid-cols-2 grid-rows-2", className)}
        {...props}
      >
        {/* Top-left: Chat */}
        <div className="overflow-hidden rounded-lg border bg-card shadow-lg">{chat}</div>

        {/* Top-right: Avatar */}
        <div className="overflow-hidden rounded-lg border bg-card shadow-lg">{avatar}</div>

        {/* Bottom-left: Local Video */}
        <div className="overflow-hidden rounded-lg border bg-card shadow-lg">{localVideo}</div>

        {/* Bottom-right: Controls */}
        <div className="overflow-hidden rounded-lg border bg-card shadow-lg p-4 flex items-center justify-center">
          {controls}
        </div>
      </div>
    )
  }
)

VideoGridWithControls.displayName = "VideoGridWithControls"
