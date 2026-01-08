"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

interface Item {
  id: string
  name: string
}

interface ValuePickerProps {
  items: Item[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  maxHeight?: string
}

const ValuePicker = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  ValuePickerProps
>(
  (
    {
      items,
      value,
      onValueChange,
      placeholder = "Select a value...",
      label,
      disabled,
      open,
      onOpenChange,
      maxHeight,
    },
    ref
  ) => {
    const selectedItem = items.find((i) => i.id === value)
    const hasScroll = !!maxHeight

    return (
      <div className="flex flex-col gap-3">
        {label && <label className="text-small font-medium">{label}</label>}
        <SelectPrimitive.Root
          value={value}
          onValueChange={onValueChange}
          open={open}
          onOpenChange={onOpenChange}
        >
          <SelectPrimitive.Trigger
            ref={ref}
            disabled={disabled}
            className={cn(
              "bg-input-field-bg text-font-high text-normal inline-flex w-full items-center justify-between border p-3 font-medium outline-hidden",
              "data-[state=closed]:rounded-md data-[state=open]:rounded-none",
              "data-[placeholder]:text-muted-foreground",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            <SelectPrimitive.Value placeholder={placeholder} asChild>
              <span className="truncate leading-tight">{selectedItem?.name || placeholder}</span>
            </SelectPrimitive.Value>
            <SelectPrimitive.Icon asChild>
              <ChevronDown className="size-5" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className={cn(
                "bg-input-field-bg text-font-high text-normal border-t-primary-brand relative z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-br-md rounded-bl-md border p-0",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2",
                "data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2",
                "data-[side=top]:slide-in-from-bottom-2"
              )}
              position="popper"
              sideOffset={0}
            >
              {hasScroll && (
                <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
                  <ChevronDown className="size-4 rotate-180" />
                </SelectPrimitive.ScrollUpButton>
              )}
              <SelectPrimitive.Viewport
                className={cn(hasScroll && "overflow-y-auto")}
                style={hasScroll ? { maxHeight } : undefined}
              >
                {items.length === 0 ? (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    No items found.
                  </div>
                ) : (
                  items.map((item) => (
                    <SelectPrimitive.Item
                      key={item.id}
                      value={item.id}
                      className={cn(
                        "bg-input-field-bg text-normal relative flex cursor-pointer items-center gap-2 rounded-sm p-3 pr-8 outline-hidden select-none",
                        "transition-colors hover:rounded-none hover:bg-[var(--color-neutral)]/25",
                        "data-[state=checked]:rounded-none data-[state=checked]:bg-[var(--color-neutral)]/15",
                        "focus-visible:bg-[var(--color-neutral)]/15"
                      )}
                    >
                      <SelectPrimitive.ItemText className="flex-1">
                        {item.name}
                      </SelectPrimitive.ItemText>
                      <span className="pointer-events-none absolute right-3 flex size-4 items-center justify-center">
                        <SelectPrimitive.ItemIndicator>
                          <Check className="size-4" />
                        </SelectPrimitive.ItemIndicator>
                      </span>
                    </SelectPrimitive.Item>
                  ))
                )}
              </SelectPrimitive.Viewport>
              {hasScroll && (
                <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
                  <ChevronDown className="size-4" />
                </SelectPrimitive.ScrollDownButton>
              )}
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>
    )
  }
)

ValuePicker.displayName = "ValuePicker"

export { ValuePicker, type Item }
