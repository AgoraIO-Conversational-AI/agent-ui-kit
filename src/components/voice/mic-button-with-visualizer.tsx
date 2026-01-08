"use client"

import React, { useEffect, useRef, useState } from "react"
// Import from peer dependency
// @ts-expect-error - peer dependency
import { IMicrophoneAudioTrack, useRTCClient } from "agora-rtc-react"
import { Mic, MicOff } from "lucide-react"

interface AudioBar {
  height: number
}

export interface MicButtonWithVisualizerProps {
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
  track: IMicrophoneAudioTrack | MediaStream | null
  enabledColor?: string
  disabledColor?: string
  onToggle?: () => void | Promise<void>
  className?: string
  /**
   * @deprecated Use `track` instead. Will be removed in next major version.
   */
  localMicrophoneTrack?: IMicrophoneAudioTrack | null
}

export function MicButtonWithVisualizer({
  isEnabled,
  setIsEnabled,
  track,
  enabledColor = "#A0FAFF",
  disabledColor = "#DE344A",
  onToggle,
  className = "",
  localMicrophoneTrack, // deprecated
}: MicButtonWithVisualizerProps) {
  const [audioData, setAudioData] = useState<AudioBar[]>(Array(5).fill({ height: 0 }))
  const client = useRTCClient()
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)

  // Support deprecated prop
  const audioTrack = track || localMicrophoneTrack

  useEffect(() => {
    const updateAudioData = () => {
      if (!analyserRef.current) return

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)

      const segmentSize = Math.floor(dataArray.length / 5)
      const newAudioData = Array(5)
        .fill(0)
        .map((_, index) => {
          const start = index * segmentSize
          const end = start + segmentSize
          const segment = dataArray.slice(start, end)
          const average = segment.reduce((a, b) => a + b, 0) / segment.length

          const scaledHeight = Math.min(60, (average / 255) * 100 * 1.2)
          const height = Math.pow(scaledHeight / 60, 0.7) * 60

          return {
            height: height,
          }
        })

      setAudioData(newAudioData)
      animationFrameRef.current = requestAnimationFrame(updateAudioData)
    }

    const cleanupAudioAnalyser = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      setAudioData(Array(5).fill({ height: 0 }))
    }

    const setupAudioAnalyser = async () => {
      if (!audioTrack) return

      try {
        audioContextRef.current = new AudioContext()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 64
        analyserRef.current.smoothingTimeConstant = 0.5

        let mediaStream: MediaStream
        if (audioTrack instanceof MediaStream) {
          mediaStream = audioTrack
        } else {
          // Agora track
          const mediaStreamTrack = audioTrack.getMediaStreamTrack()
          mediaStream = new MediaStream([mediaStreamTrack])
        }

        const source = audioContextRef.current.createMediaStreamSource(mediaStream)
        source.connect(analyserRef.current)

        updateAudioData()
      } catch (error) {
        console.error("Error setting up audio analyser:", error)
      }
    }

    if (audioTrack && isEnabled) {
      setupAudioAnalyser()
    } else {
      cleanupAudioAnalyser()
    }

    return () => cleanupAudioAnalyser()
  }, [audioTrack, isEnabled])

  const toggleMicrophone = async () => {
    // If custom onToggle provided, use it
    if (onToggle) {
      await onToggle()
      return
    }

    // Otherwise, handle Agora track toggle
    const agoraTrack = audioTrack && !(audioTrack instanceof MediaStream) ? audioTrack : null
    if (agoraTrack) {
      const newState = !isEnabled
      try {
        await agoraTrack.setEnabled(newState)
        if (!newState) {
          await client.unpublish(agoraTrack)
        } else {
          await client.publish(agoraTrack)
        }
        setIsEnabled(newState)
        console.log("Microphone state updated successfully")
      } catch (error) {
        console.error("Failed to toggle microphone:", error)
        agoraTrack.setEnabled(isEnabled)
      }
    } else {
      // Just toggle state for MediaStream
      setIsEnabled(!isEnabled)
    }
  }

  const activeColor = isEnabled ? enabledColor : disabledColor

  return (
    <button
      onClick={toggleMicrophone}
      className={`group relative flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 ${className}`}
      style={{
        borderColor: activeColor,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center gap-1">
        {audioData.map((bar, index) => (
          <div
            key={index}
            className="w-1 rounded-full transition-all duration-100 group-hover:bg-black group-active:bg-black"
            style={{
              height: `${bar.height}%`,
              transform: `scaleY(${Math.max(0.1, bar.height / 100)})`,
              transformOrigin: "center",
              backgroundColor: activeColor,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 transition-colors duration-300">
        {isEnabled ? (
          <Mic
            size={24}
            className="transition-colors duration-300 group-hover:text-black group-active:text-black"
            style={{ color: enabledColor }}
          />
        ) : (
          <MicOff
            size={24}
            className="transition-colors duration-300 group-hover:text-black group-active:text-black"
            style={{ color: disabledColor }}
          />
        )}
      </div>
    </button>
  )
}
