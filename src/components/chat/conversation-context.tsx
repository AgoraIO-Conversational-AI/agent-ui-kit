import * as React from "react"

export interface ConversationContextValue {
  scrollRef: React.RefObject<HTMLDivElement | null>
  agentName: string
  userName: string
}

export const ConversationContext = React.createContext<ConversationContextValue | null>(null)

export const useConversation = () => {
  const context = React.useContext(ConversationContext)
  if (!context) {
    throw new Error("useConversation must be used within Conversation")
  }
  return context
}

export const useConversationNames = () => {
  const context = React.useContext(ConversationContext)
  // If not within Conversation, use defaults
  return context
    ? { agentName: context.agentName, userName: context.userName }
    : { agentName: "Agent", userName: "User" }
}
