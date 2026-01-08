"use client"

import { useEffect, useState } from "react"
import { Check, ChevronDown, Mic, MicOff } from "lucide-react"

import { useAudioDevices } from "../../hooks/use-audio-devices"
import { Chip } from "../primitives/chip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../primitives/dropdown-menu"
import { IconButton } from "../primitives/icon-button"
import { LiveWaveform } from "./live-waveform"
import type { MicButtonState } from "./mic-button"

export interface MicSelectorProps {
  value?: string
  onValueChange?: (deviceId: string) => void
  muted?: boolean
  onMutedChange?: (muted: boolean) => void
  disabled?: boolean
  className?: string
  /**
   * Current state of the mic selector (idle, listening, processing, error)
   * @default "idle"
   */
  state?: MicButtonState
}

export function MicSelector({
  value,
  onValueChange,
  muted,
  onMutedChange,
  disabled: _disabled = false,
  className: _className,
}: MicSelectorProps) {
  const { devices, loading, error, hasPermission, loadDevices } = useAudioDevices()
  const [internalMuted, setInternalMuted] = useState(false)

  // Use controlled muted if provided, otherwise use internal state
  const isMuted = muted !== undefined ? muted : internalMuted

  // console.log("supriya state: ", state)
  // console.log("supriya error: ", error)
  // console.log("supriya hasPermission: ", hasPermission)

  // Use controlled value if provided, otherwise use first device
  const selectedDevice = value || devices[0]?.deviceId || ""

  // Notify parent when default device is selected and no value is controlled
  useEffect(() => {
    if (!value && selectedDevice && devices.length > 0) {
      onValueChange?.(selectedDevice)
    }
  }, [value, selectedDevice, devices.length, onValueChange])

  const handleDeviceSelect = (deviceId: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    onValueChange?.(deviceId)
  }

  const handleDropdownOpenChange = async (open: boolean) => {
    setIsDropdownOpen(open)
    if (open && !hasPermission && !loading) {
      await loadDevices()
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    if (muted === undefined) {
      setInternalMuted(newMuted)
    }
    onMutedChange?.(newMuted)
  }

  const isError = state === "error" || !hasPermission
  console.log("supriya-isError: ", isError, isMuted)

  return (
    <Chip>
      <div>
        <IconButton
          onClick={toggleMute}
          shape="round"
          variant="standard"
          size={"sm"}
          disabled={isError}
        >
          {isError ? (
            <MicOff className={`size-4`} />
          ) : isMuted ? (
            <MicOff className={`text-error size-4`} />
          ) : (
            <Mic className={`size-4`} />
          )}
        </IconButton>
        {isError && (
          <div className="bg-warning absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full">
            <span className="text-hard-black text-xs leading-none font-bold">!</span>
          </div>
        )}
      </div>
      <div className="w-10">
        <LiveWaveform
          active={!isMuted}
          deviceId={selectedDevice || defaultDeviceId}
          height={20}
          barWidth={3}
          barGap={1}
        />
      </div>
      <DropdownMenu onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <ChevronDown className="size-6 flex-shrink-0" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" side="top" className="w-72">
          {loading ? (
            <div className="text-muted-foreground px-4 py-3 text-center text-sm">
              Loading devices...
            </div>
          ) : error ? (
            <div className="text-error px-4 py-3 text-center text-sm">Error: {error}</div>
          ) : devices.length === 0 ? (
            <div className="text-muted-foreground px-4 py-3 text-center text-sm">
              No microphones available
            </div>
          ) : (
            <>
              {devices.map((device) => (
                <DropdownMenuItem
                  key={device.deviceId}
                  onClick={(e) => handleDeviceSelect(device.deviceId, e)}
                  onSelect={(e) => e.preventDefault()}
                  className="flex cursor-pointer items-center justify-between"
                  disabled={loading && isError}
                >
                  <span className="truncate">{device.label}</span>
                  {selectedDevice === device.deviceId && <Check className="size-5 flex-shrink-0" />}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Chip>
  )
}
