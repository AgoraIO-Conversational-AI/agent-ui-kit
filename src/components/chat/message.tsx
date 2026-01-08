"use client"

import * as React from "react"

import { cn } from "../../lib/utils"
import { useConversationNames } from "./conversation-context"

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Who is sending the message
   */
  from: "user" | "assistant"

  /**
   * Optional: Override the name to display above the message
   * If not provided, uses agentName/userName from parent Conversation
   */
  name?: string
}

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  ({ className, from, name, children, ...props }, ref) => {
    const { agentName, userName } = useConversationNames()
    const isUser = from === "user"
    const displayName = name ?? (isUser ? userName : agentName)

    return (
      <div
        ref={ref}
        className={cn("flex w-full", className)}
        style={{ justifyContent: isUser ? "flex-end" : "flex-start" }}
        {...props}
      >
        <div
          className="flex flex-col gap-0.5"
          style={{ alignItems: isUser ? "flex-end" : "flex-start" }}
        >
          {displayName && (
            <div className="text-sm font-medium text-muted-foreground">{displayName}</div>
          )}
          {children}
        </div>
      </div>
    )
  }
)

Message.displayName = "Message"

export type MessageContentProps = React.HTMLAttributes<HTMLDivElement>

export const MessageContent = React.forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex max-w-xs flex-col gap-2 rounded-2xl px-1 py-1 bg-secondary text-foreground",
          className
        )}
        {...props}
      />
    )
  }
)

MessageContent.displayName = "MessageContent"
