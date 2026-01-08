"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export type AvatarSize = "sm" | "md" | "lg"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Image URL for the avatar
   */
  src?: string

  /**
   * Icon to display (takes precedence over initials if no image)
   */
  icon?: React.ReactNode

  /**
   * Custom initials to display (takes precedence over name)
   */
  initials?: string

  /**
   * Full name (used to generate initials if initials not provided)
   */
  name?: string

  /**
   * Size of the avatar
   * @default "md"
   */
  size?: AvatarSize

  /**
   * Background color for the avatar
   * @default "bg-gradient-to-br from-blue-500 to-blue-600"
   */
  bgColor?: string

  /**
   * Alt text for image
   */
  alt?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

const getInitials = (name?: string, customInitials?: string): string => {
  if (customInitials) return customInitials.toUpperCase()
  if (name) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }
  return "?"
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      icon,
      initials,
      name,
      size = "md",
      bgColor = "bg-gradient-to-br from-blue-500 to-blue-600",
      alt = "avatar",
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false)
    const displayInitials = getInitials(name, initials)

    // Debug: Log once per unique initials
    React.useEffect(() => {
      if (displayInitials) {
        console.log(`[Avatar] Rendering with initials: "${displayInitials}", size: ${size}`)
      }
    }, [displayInitials, size])

    return (
      <div
        ref={ref}
        className={cn(
          "ring-border flex items-center justify-center overflow-hidden rounded-full ring-1",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : icon ? (
          <div className={cn("h-full w-full flex items-center justify-center text-white", bgColor)}>
            {icon}
          </div>
        ) : (
          <div
            className={cn(
              "h-full w-full flex items-center justify-center text-xs font-semibold text-white",
              bgColor
            )}
          >
            {displayInitials}
          </div>
        )}
      </div>
    )
  }
)

Avatar.displayName = "Avatar"
