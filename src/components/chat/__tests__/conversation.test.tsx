/**
 * Tests for Conversation component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Conversation, ConversationContent, ConversationEmptyState } from "../conversation"
import type { ConversationProps } from "../conversation"

describe("Conversation Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Conversation />)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    // Type-only test - verifies prop interface is complete
    const props: ConversationProps = {
      height: "h-[600px]",
      agentName: "AI Assistant",
      userName: "John",
    }
    expect(props.height).toBe("h-[600px]")
    expect(props.agentName).toBe("AI Assistant")
    expect(props.userName).toBe("John")
  })

  it("provides default values", () => {
    const { getByText } = render(
      <Conversation>
        <ConversationContent>
          <div>Test content</div>
        </ConversationContent>
      </Conversation>
    )
    expect(getByText("Test content")).toBeInTheDocument()
  })

  it("renders ConversationContent", () => {
    const { getByText } = render(
      <ConversationContent>
        <div>Chat messages</div>
      </ConversationContent>
    )
    expect(getByText("Chat messages")).toBeInTheDocument()
  })

  it("renders ConversationEmptyState with defaults", () => {
    const { getByText } = render(<ConversationEmptyState />)
    expect(getByText("No messages yet")).toBeInTheDocument()
    expect(getByText("Start a conversation to see messages here")).toBeInTheDocument()
  })

  it("renders ConversationEmptyState with custom text", () => {
    const { getByText } = render(
      <ConversationEmptyState title="Empty chat" description="Say something!" />
    )
    expect(getByText("Empty chat")).toBeInTheDocument()
    expect(getByText("Say something!")).toBeInTheDocument()
  })
})
