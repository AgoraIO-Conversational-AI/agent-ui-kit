"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../primitives/button"
import { ConversationContext, useConversation } from "./conversation-context"

export interface ConversationProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Height of the conversation container
   * @default "h-[400px]"
   */
  height?: string

  /**
   * Name to display for agent messages
   * @default "Agent"
   */
  agentName?: string

  /**
   * Name to display for user messages
   * @default "User"
   */
  userName?: string
}

export const Conversation = React.forwardRef<HTMLDivElement, ConversationProps>(
  ({ className, height = "h-[400px]", agentName = "Agent", userName = "User", ...props }, _ref) => {
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const [showScrollButton, setShowScrollButton] = React.useState(false)

    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }

    React.useEffect(() => {
      const scrollElement = scrollRef.current

      const handleScroll = () => {
        if (scrollElement) {
          const { scrollTop, scrollHeight, clientHeight } = scrollElement
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
          setShowScrollButton(!isNearBottom)
        }
      }

      const observer = new MutationObserver(() => {
        setTimeout(scrollToBottom, 0)
      })

      if (scrollElement) {
        observer.observe(scrollElement, { childList: true, subtree: true })
        scrollElement.addEventListener("scroll", handleScroll)
      }

      return () => {
        observer.disconnect()
        if (scrollElement) {
          scrollElement.removeEventListener("scroll", handleScroll)
        }
      }
    }, [])

    return (
      <ConversationContext.Provider value={{ scrollRef, agentName, userName }}>
        <div
          ref={scrollRef}
          className={cn("relative flex flex-col overflow-scroll", height, className)}
          {...props}
        >
          <div className="flex-1 min-h-0">{props.children}</div>
          {showScrollButton && <ConversationScrollButton onClick={scrollToBottom} />}
        </div>
      </ConversationContext.Provider>
    )
  }
)

Conversation.displayName = "Conversation"

export interface ConversationContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Padding class
   * @default "p-4"
   */
  padding?: string
}

export const ConversationContent = React.forwardRef<HTMLDivElement, ConversationContentProps>(
  ({ className, padding = "p-4", ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1", padding, className)} {...props} />
  )
)

ConversationContent.displayName = "ConversationContent"

export interface ConversationEmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon to display
   */
  icon?: React.ReactNode

  /**
   * Title text
   * @default "No messages yet"
   */
  title?: string

  /**
   * Description text
   * @default "Start a conversation to see messages here"
   */
  description?: string
}

export const ConversationEmptyState = React.forwardRef<HTMLDivElement, ConversationEmptyStateProps>(
  (
    {
      className,
      icon,
      title = "No messages yet",
      description = "Start a conversation to see messages here",
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full flex-col items-center justify-center gap-3 p-8 text-center",
        className
      )}
      {...props}
    >
      {icon && <div className="flex justify-center">{icon}</div>}
      <div className="space-y-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
)

ConversationEmptyState.displayName = "ConversationEmptyState"

export type ConversationScrollButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const ConversationScrollButton = React.forwardRef<
  HTMLButtonElement,
  ConversationScrollButtonProps
>(({ className, ...props }, ref) => {
  const { scrollRef } = useConversation()

  return (
    <Button
      ref={ref}
      className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 shadow-md", className)}
      onClick={() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  )
})

ConversationScrollButton.displayName = "ConversationScrollButton"
