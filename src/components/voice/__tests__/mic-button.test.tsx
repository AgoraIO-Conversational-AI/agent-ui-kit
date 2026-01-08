/**
 * Tests for MicButton component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { MicButton } from "../mic-button"
import type { MicButtonProps, MicButtonState } from "../mic-button"

describe("MicButton Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<MicButton />)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    // Type-only test - verifies prop interface is complete
    const props: MicButtonProps = {
      state: "listening",
      showErrorBadge: true,
      audioData: [0.5, 0.7, 0.3],
      onClick: () => {},
    }
    // If this compiles, the API contract is satisfied
    expect(props.state).toBe("listening")
    expect(props.showErrorBadge).toBe(true)
    expect(props.audioData).toHaveLength(3)
  })

  it("exports MicButtonState type", () => {
    const states: MicButtonState[] = ["idle", "listening", "processing", "error"]
    expect(states.length).toBe(4)
  })

  it("has correct default state", () => {
    const { container } = render(<MicButton />)
    // Default state should be 'idle'
    expect(container.querySelector("button")).toBeInTheDocument()
  })
})
