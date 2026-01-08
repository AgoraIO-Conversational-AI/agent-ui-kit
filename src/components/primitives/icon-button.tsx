import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const iconButtonVariants = cva(
  "relative inline-flex items-center justify-center cursor-pointer transition-all disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 outline-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6 [&_svg]:shrink-0",
  {
    variants: {
      shape: {
        round: "rounded-full",
        square: "rounded-md",
      },
      variant: {
        filled: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        outlined: "border border-primary text-primary hover:bg-primary/10 active:bg-primary/20",
        standard: "text-foreground hover:bg-accent/10 active:bg-accent/20",
      },
      size: {
        default: "h-12 w-12 [&_svg:not([class*='size-'])]:size-6",
        sm: "h-6 w-6 [&_svg:not([class*='size-'])]:size-3",
        md: "h-10 w-10 [&_svg:not([class*='size-'])]:size-5",
        lg: "h-12 w-12 [&_svg:not([class*='size-'])]:size-6",
        xl: "h-14 w-14 [&_svg:not([class*='size-'])]:size-8",
      },
    },
    defaultVariants: {
      shape: "round",
      variant: "filled",
      size: "default",
    },
  }
)

interface IconButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof iconButtonVariants> {}

function IconButton({ className, shape, variant, size, ...props }: IconButtonProps) {
  return (
    <button className={cn(iconButtonVariants({ shape, variant, size, className }))} {...props} />
  )
}

export { IconButton, iconButtonVariants }
