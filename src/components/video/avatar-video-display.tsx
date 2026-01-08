"use client"

import * as React from "react"
import type { IRemoteVideoTrack } from "agora-rtc-sdk-ng"

import { cn } from "../../lib/utils"

export type AvatarVideoState = "connected" | "loading" | "disconnected"

export interface AvatarVideoDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Remote video track from Agora RTC
   */
  videoTrack?: IRemoteVideoTrack | null

  /**
   * Current connection state
   * @default "disconnected"
   */
  state?: AvatarVideoState

  /**
   * Show connection status overlay
   * @default false
   */
  showStatus?: boolean

  /**
   * Placeholder content when no video
   */
  placeholder?: React.ReactNode

  /**
   * Use MediaStream instead of Agora's play() method
   * Enables multiple video elements to show the same track
   * @default false
   */
  useMediaStream?: boolean
}

export const AvatarVideoDisplay = React.forwardRef<HTMLDivElement, AvatarVideoDisplayProps>(
  (
    {
      className,
      videoTrack,
      state = "disconnected",
      showStatus = false,
      placeholder,
      useMediaStream = false,
      ...props
    },
    ref
  ) => {
    const videoContainerRef = React.useRef<HTMLDivElement>(null)
    const videoElementRef = React.useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = React.useState(false)

    // MediaStream mode - use native video element
    React.useEffect(() => {
      if (!useMediaStream || !videoTrack || !videoElementRef.current) {
        if (useMediaStream) setIsPlaying(false)
        return
      }

      try {
        const mediaStreamTrack = videoTrack.getMediaStreamTrack()
        const stream = new MediaStream([mediaStreamTrack])
        videoElementRef.current.srcObject = stream
        videoElementRef.current.play()
        setIsPlaying(true)
        console.log("[AvatarVideoDisplay] MediaStream video playing")
      } catch (error) {
        console.error("[AvatarVideoDisplay] Failed to play MediaStream:", error)
        setIsPlaying(false)
      }

      return () => {
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = null
        }
        setIsPlaying(false)
      }
    }, [videoTrack, useMediaStream])

    // Agora play() mode - use container div
    React.useEffect(() => {
      if (useMediaStream || !videoTrack || !videoContainerRef.current) {
        if (!useMediaStream) setIsPlaying(false)
        return
      }

      try {
        videoTrack.play(videoContainerRef.current)
        setIsPlaying(true)
        console.log("[AvatarVideoDisplay] Agora video track playing")
      } catch (error) {
        console.error("[AvatarVideoDisplay] Failed to play video track:", error)
        setIsPlaying(false)
      }

      return () => {
        try {
          videoTrack.stop()
          setIsPlaying(false)
        } catch (error) {
          console.error("[AvatarVideoDisplay] Failed to stop video track:", error)
        }
      }
    }, [videoTrack, useMediaStream])

    const showPlaceholder = !isPlaying || state === "disconnected"

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg bg-muted",
          "flex items-center justify-center",
          className
        )}
        {...props}
      >
        {/* Video container (Agora play mode) */}
        {!useMediaStream && (
          <div
            ref={videoContainerRef}
            className={cn(
              "absolute inset-2 rounded-lg overflow-hidden",
              showPlaceholder && "hidden"
            )}
          />
        )}

        {/* Video element (MediaStream mode) */}
        {useMediaStream && (
          <video
            ref={videoElementRef}
            autoPlay
            playsInline
            className={cn(
              "absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-cover rounded-lg",
              showPlaceholder && "hidden"
            )}
          />
        )}

        {/* Placeholder */}
        {showPlaceholder && (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-muted-foreground">
            {placeholder || (
              <div className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </div>
                <p className="text-sm">{state === "loading" ? "Connecting..." : "No video"}</p>
              </div>
            )}
          </div>
        )}

        {/* Status overlay */}
        {showStatus && state !== "disconnected" && (
          <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
            {state === "loading" && "Connecting..."}
            {state === "connected" && isPlaying && (
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
        )}
      </div>
    )
  }
)

AvatarVideoDisplay.displayName = "AvatarVideoDisplay"
