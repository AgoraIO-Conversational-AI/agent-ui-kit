"use client"

import { useEffect, useRef, useState, type HTMLAttributes } from "react"

import { cn } from "../../lib/utils"

export type LiveWaveformProps = HTMLAttributes<HTMLDivElement> & {
  active?: boolean
  data?: number[]
  deviceId?: string
  fftSize?: number
  smoothingTimeConstant?: number
  sensitivity?: number
  barWidth?: number
  barGap?: number
  barRadius?: number
  barColor?: string
  fadeEdges?: boolean
  fadeWidth?: number
  height?: string | number
  /** Minimum opacity for bars (0-1). When null, uses value directly. Default: null */
  minAlpha?: number | null
  /** Maximum additional opacity range. Default: 1.0 */
  alphaRange?: number
  onError?: (error: Error) => void
}

export const LiveWaveform = ({
  active = false,
  data: externalData,
  deviceId,
  fftSize = 256,
  smoothingTimeConstant = 0.8,
  sensitivity = 1,
  barWidth = 3,
  barGap = 1,
  barRadius = 1.5,
  barColor,
  fadeEdges = true,
  fadeWidth = 24,
  height = 64,
  minAlpha = null,
  alphaRange = 1.0,
  onError,
  className,
  ...props
}: LiveWaveformProps) => {
  const [data, setData] = useState<number[]>(externalData || [])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationIdRef = useRef<number | null>(null)

  const heightStyle = typeof height === "number" ? `${height}px` : height

  // Canvas setup and resizing
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.scale(dpr, dpr)
      }
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  // Microphone setup and frequency data extraction
  useEffect(() => {
    if (!active || !deviceId) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }

      // create gentle idle animation
      let rafId: number
      let t = 0
      const animateIdle = () => {
        t += 0.03
        // generate flat, symmetric waveform values
        const idleArray = Array.from({ length: 64 }, (_, i) => 0.05 + Math.sin(t + i * 0.3) * 0.01)
        setData(idleArray)
        rafId = requestAnimationFrame(animateIdle)
      }
      animateIdle()
      // cleanup when effect re-runs (e.g., mic turns on)
      return () => cancelAnimationFrame(rafId)
    }

    const setupMicrophone = async () => {
      try {
        const audioConstraints: MediaTrackConstraints = {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }

        if (deviceId) {
          audioConstraints.deviceId = deviceId
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraints,
        })
        streamRef.current = stream

        const AudioContextConstructor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const audioContext = new AudioContextConstructor()
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = fftSize
        analyser.smoothingTimeConstant = smoothingTimeConstant

        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)

        audioContextRef.current = audioContext
        analyserRef.current = analyser

        const dataArray = new Uint8Array(analyser.frequencyBinCount)

        const updateData = () => {
          if (!analyserRef.current || !active) return

          analyserRef.current.getByteFrequencyData(dataArray)

          const startFreq = Math.floor(dataArray.length * 0.05)
          const endFreq = Math.floor(dataArray.length * 0.4)
          const relevantData = dataArray.slice(startFreq, endFreq)

          const halfLength = Math.floor(relevantData.length / 2)
          const normalizedData: number[] = []

          // Mirror the data for symmetric center-aligned display
          for (let i = halfLength - 1; i >= 0; i--) {
            const value = Math.min(1, (relevantData[i] / 255) * sensitivity)
            normalizedData.push(value)
          }

          for (let i = 0; i < halfLength; i++) {
            const value = Math.min(1, (relevantData[i] / 255) * sensitivity)
            normalizedData.push(value)
          }

          setData(normalizedData)
          animationIdRef.current = requestAnimationFrame(updateData)
        }

        updateData()
      } catch (error) {
        onError?.(error as Error)
      }
    }

    setupMicrophone()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [active, deviceId, fftSize, smoothingTimeConstant, sensitivity, onError])

  // Update data from external source if provided (removed useEffect to avoid setState in effect)

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let rafId: number

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const computedBarColor =
        barColor ||
        (() => {
          const style = getComputedStyle(canvas)
          const color = style.color
          return color || "#000"
        })()

      const step = barWidth + barGap
      const barCount = Math.floor(rect.width / step)
      const centerY = rect.height / 2

      // Use external data if available, otherwise use internal data
      const displayData = externalData || data

      // Render bars from data
      for (let i = 0; i < barCount && i < displayData.length; i++) {
        const value = displayData[i] || 0.05
        const x = i * step
        const barHeight = Math.max(4, value * rect.height * 0.8)
        const y = centerY - barHeight / 2

        ctx.fillStyle = computedBarColor
        // Calculate alpha based on configuration
        // If minAlpha is null, use value directly. Otherwise use minAlpha + (value * alphaRange)
        ctx.globalAlpha = minAlpha !== null ? minAlpha + value * alphaRange : value

        if (barRadius > 0) {
          ctx.beginPath()
          ctx.roundRect(x, y, barWidth, barHeight, barRadius)
          ctx.fill()
        } else {
          ctx.fillRect(x, y, barWidth, barHeight)
        }
      }

      // Apply edge fading
      if (fadeEdges && fadeWidth > 0 && rect.width > 0) {
        const gradient = ctx.createLinearGradient(0, 0, rect.width, 0)
        const fadePercent = Math.min(0.3, fadeWidth / rect.width)

        gradient.addColorStop(0, "rgba(255,255,255,1)")
        gradient.addColorStop(fadePercent, "rgba(255,255,255,0)")
        gradient.addColorStop(1 - fadePercent, "rgba(255,255,255,0)")
        gradient.addColorStop(1, "rgba(255,255,255,1)")

        ctx.globalCompositeOperation = "destination-out"
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, rect.width, rect.height)
        ctx.globalCompositeOperation = "source-over"
      }

      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [
    data,
    externalData,
    barWidth,
    barGap,
    barRadius,
    barColor,
    fadeEdges,
    fadeWidth,
    minAlpha,
    alphaRange,
  ])

  return (
    <div
      className={cn("relative h-full w-full", className)}
      ref={containerRef}
      style={{ height: heightStyle }}
      aria-label={active ? "Live audio waveform" : "Audio waveform idle"}
      role="img"
      {...props}
    >
      <canvas className="block h-full w-full" ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
