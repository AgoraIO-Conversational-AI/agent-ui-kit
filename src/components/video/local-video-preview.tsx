"use client"

import * as React from "react"
import type { ICameraVideoTrack } from "agora-rtc-sdk-ng"

import { cn } from "../../lib/utils"

export interface LocalVideoPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Local camera video track from Agora RTC
   */
  videoTrack?: ICameraVideoTrack | null

  /**
   * Mirror the video horizontally (like a mirror)
   * @default true
   */
  isMirrored?: boolean

  /**
   * Show label overlay
   * @default false
   */
  showLabel?: boolean

  /**
   * Custom label text
   * @default "You"
   */
  label?: string

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

export const LocalVideoPreview = React.forwardRef<HTMLDivElement, LocalVideoPreviewProps>(
  (
    {
      className,
      videoTrack,
      isMirrored = true,
      showLabel = false,
      label = "You",
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
        console.log("[LocalVideoPreview] MediaStream video playing")
      } catch (error) {
        console.error("[LocalVideoPreview] Failed to play MediaStream:", error)
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
        console.log("[LocalVideoPreview] Agora video track playing")
      } catch (error) {
        console.error("[LocalVideoPreview] Failed to play video track:", error)
        setIsPlaying(false)
      }

      return () => {
        try {
          videoTrack.stop()
          setIsPlaying(false)
        } catch (error) {
          console.error("[LocalVideoPreview] Failed to stop video track:", error)
        }
      }
    }, [videoTrack, useMediaStream])

    const showPlaceholder = !isPlaying

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
              isMirrored && "scale-x-[-1]",
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
            muted
            className={cn(
              "absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-cover rounded-lg",
              isMirrored && "scale-x-[-1]",
              showPlaceholder && "hidden"
            )}
          />
        )}

        {/* Placeholder */}
        {showPlaceholder && (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 text-muted-foreground">
            {placeholder || (
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-slate-600/50 flex items-center justify-center">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <p className="text-xs">Camera off</p>
              </div>
            )}
          </div>
        )}

        {/* Label overlay */}
        {showLabel && isPlaying && label && (
          <div className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
            {label}
          </div>
        )}
      </div>
    )
  }
)

LocalVideoPreview.displayName = "LocalVideoPreview"
