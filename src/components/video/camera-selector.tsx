"use client"

import * as React from "react"
import { Video, VideoOff, Check, ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

export interface CameraDevice {
  deviceId: string
  label: string
  groupId?: string
}

export interface CameraSelectorProps {
  /**
   * List of available camera devices
   */
  devices?: CameraDevice[]

  /**
   * Selected camera device ID
   */
  value?: string

  /**
   * Callback when camera device changes
   */
  onValueChange?: (deviceId: string) => void

  /**
   * Whether camera is disabled/off
   */
  disabled?: boolean

  /**
   * Callback when disabled state changes
   */
  onDisabledChange?: (disabled: boolean) => void

  /**
   * Whether the selector is in an error state
   */
  hasError?: boolean

  /**
   * Custom class name
   */
  className?: string
}

export const CameraSelector = React.forwardRef<HTMLDivElement, CameraSelectorProps>(
  (
    {
      devices = [],
      value,
      onValueChange,
      disabled = false,
      onDisabledChange,
      hasError = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const selectedDevice = devices.find((d) => d.deviceId === value) || devices[0]

    const handleToggleCamera = () => {
      onDisabledChange?.(!disabled)
    }

    const handleSelectDevice = (deviceId: string) => {
      onValueChange?.(deviceId)
      setIsOpen(false)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-2",
          hasError && "border-destructive",
          className
        )}
      >
        {/* Toggle camera button */}
        <button
          onClick={handleToggleCamera}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
            hasError
              ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
              : disabled
                ? "bg-muted text-muted-foreground hover:bg-muted/80"
                : "bg-primary/10 text-primary hover:bg-primary/20"
          )}
        >
          {hasError || disabled ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </button>

        {/* Device selector dropdown */}
        {devices.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 text-sm hover:text-foreground/80"
              disabled={disabled || hasError}
            >
              <span className="max-w-[150px] truncate">
                {selectedDevice?.label || "Select camera"}
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <>
                {/* Backdrop */}
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                {/* Menu */}
                <div className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border bg-popover p-1 shadow-lg">
                  {devices.map((device) => (
                    <button
                      key={device.deviceId}
                      onClick={() => handleSelectDevice(device.deviceId)}
                      className={cn(
                        "flex w-full items-center justify-between rounded px-3 py-2 text-sm hover:bg-accent",
                        device.deviceId === value && "bg-accent"
                      )}
                    >
                      <span className="truncate">{device.label}</span>
                      {device.deviceId === value && <Check className="h-4 w-4 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* No devices message */}
        {devices.length === 0 && !hasError && (
          <span className="text-sm text-muted-foreground">No cameras available</span>
        )}

        {/* Error indicator */}
        {hasError && (
          <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-amber-900">
            <span className="text-xs font-bold leading-none">!</span>
          </div>
        )}
      </div>
    )
  }
)

CameraSelector.displayName = "CameraSelector"
