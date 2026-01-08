/**
 * Tests for Message component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Message, MessageContent } from "../message"
import { Conversation, ConversationContent } from "../conversation"
import type { MessageProps } from "../message"

describe("Message Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Message from="user">Hello</Message>)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    // Type-only test - verifies prop interface is complete
    const props: MessageProps = {
      from: "assistant",
      name: "Custom Name",
    }
    expect(props.from).toBe("assistant")
    expect(props.name).toBe("Custom Name")
  })

  it("uses agentName from Conversation context", () => {
    const { getByText } = render(
      <Conversation agentName="Bot" userName="Me">
        <ConversationContent>
          <Message from="assistant">
            <MessageContent>Hello</MessageContent>
          </Message>
        </ConversationContent>
      </Conversation>
    )
    expect(getByText("Bot")).toBeInTheDocument()
  })

  it("uses userName from Conversation context", () => {
    const { getByText } = render(
      <Conversation agentName="Bot" userName="Me">
        <ConversationContent>
          <Message from="user">
            <MessageContent>Hi</MessageContent>
          </Message>
        </ConversationContent>
      </Conversation>
    )
    expect(getByText("Me")).toBeInTheDocument()
  })

  it("allows name override", () => {
    const { getByText } = render(
      <Conversation agentName="Bot" userName="Me">
        <ConversationContent>
          <Message from="user" name="Override Name">
            <MessageContent>Hi</MessageContent>
          </Message>
        </ConversationContent>
      </Conversation>
    )
    expect(getByText("Override Name")).toBeInTheDocument()
  })

  it("uses default names when not in Conversation", () => {
    const { getByText } = render(
      <Message from="assistant">
        <MessageContent>Hello</MessageContent>
      </Message>
    )
    expect(getByText("Agent")).toBeInTheDocument()
  })

  it("renders MessageContent", () => {
    const { getByText } = render(<MessageContent>Message text</MessageContent>)
    expect(getByText("Message text")).toBeInTheDocument()
  })
})
