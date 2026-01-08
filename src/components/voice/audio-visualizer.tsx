"use client"

import React, { useEffect, useRef, useState } from "react"

// Type definitions for Agora tracks (peer dependency)
export type ILocalAudioTrack = {
  getMediaStreamTrack: () => MediaStreamTrack
}

export type IRemoteAudioTrack = {
  getMediaStreamTrack: () => MediaStreamTrack
}

export interface AudioVisualizerProps {
  track: ILocalAudioTrack | IRemoteAudioTrack | MediaStream | undefined
  gradientColors?: string[]
  className?: string
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  track,
  gradientColors = ["#A0FAFF", "#FCF9F8", "#C46FFB"],
  className = "",
}) => {
  const [isVisualizing, setIsVisualizing] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const barsRef = useRef<(HTMLDivElement | null)[]>([])

  const animate = () => {
    if (!analyserRef.current) {
      console.log("No analyser found in animate")
      return
    }

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    const frequencyRanges = [
      [24, 31], // Highest (bar 0, 8)
      [16, 23], // Mid-high (bar 1, 7)
      [8, 15], // Mid (bar 2, 6)
      [4, 7], // Low-mid (bar 3, 5)
      [0, 3], // Lowest (bar 4 - center)
    ]

    barsRef.current.forEach((bar, index) => {
      if (!bar) {
        console.log("No bar found at index", index)
        return
      }

      const rangeIndex = index < 5 ? index : 8 - index
      const [start, end] = frequencyRanges[rangeIndex]

      let sum = 0
      for (let i = start; i <= end; i++) {
        sum += dataArray[i]
      }
      let average = sum / (end - start + 1)

      const multipliers = [0.7, 0.8, 0.85, 0.9, 0.95]
      const multiplierIndex = index < 5 ? index : 8 - index
      average *= multipliers[multiplierIndex]

      const height = Math.min((average / 255) * 100, 100)
      bar.style.height = `${height}px`
    })

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (!track) {
      console.log("No track provided")
      return
    }

    const startVisualizer = async () => {
      try {
        console.log("Starting visualizer")
        audioContextRef.current = new AudioContext()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 64

        let mediaStreamTrack: MediaStreamTrack

        // Check if track is a MediaStream or an Agora track
        if (track instanceof MediaStream) {
          // Direct MediaStream - get audio tracks
          const audioTracks = track.getAudioTracks()
          if (audioTracks.length === 0) {
            console.error("No audio tracks found in MediaStream")
            return
          }
          mediaStreamTrack = audioTracks[0]
        } else {
          // Agora track - use getMediaStreamTrack()
          mediaStreamTrack = track.getMediaStreamTrack()
        }

        const stream = new MediaStream([mediaStreamTrack])
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)

        console.log("Setup complete, starting animation")
        setIsVisualizing(true)
        animate()
      } catch (error) {
        console.error("Error starting visualizer:", error)
      }
    }

    startVisualizer()

    return () => {
      console.log("Cleaning up")
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [track])

  // Build gradient string from colors array
  const gradientString = `linear-gradient(to top, ${gradientColors.join(", ")})`

  return (
    <div
      className={`relative flex h-40 w-full items-center justify-center overflow-hidden rounded-lg ${className}`}
    >
      <div className="relative z-10 flex h-[100px] items-center space-x-2">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              barsRef.current[index] = el
            }}
            className="visualizer-bar w-3 rounded-full transition-all duration-75"
            style={{
              height: "2px",
              transformOrigin: "bottom",
              minHeight: "2px",
              display: "block",
              position: "relative",
              background: gradientString,
              opacity: 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
