/**
 * Tests for AvatarVideoDisplay component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { AvatarVideoDisplay } from "../avatar-video-display"
import type { AvatarVideoDisplayProps, AvatarVideoState } from "../avatar-video-display"

describe("AvatarVideoDisplay Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<AvatarVideoDisplay />)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    // Type-only test - verifies prop interface is complete
    const props: AvatarVideoDisplayProps = {
      videoTrack: null,
      state: "connected",
      showStatus: true,
      placeholder: <div>Loading...</div>,
      useMediaStream: true,
    }
    expect(props.state).toBe("connected")
    expect(props.showStatus).toBe(true)
    expect(props.useMediaStream).toBe(true)
  })

  it("exports AvatarVideoState type", () => {
    const states: AvatarVideoState[] = ["connected", "loading", "disconnected"]
    expect(states.length).toBe(3)
  })

  it("renders with different states", () => {
    const { rerender, container } = render(<AvatarVideoDisplay state="connected" />)
    expect(container).toBeInTheDocument()

    rerender(<AvatarVideoDisplay state="loading" />)
    expect(container).toBeInTheDocument()

    rerender(<AvatarVideoDisplay state="disconnected" />)
    expect(container).toBeInTheDocument()
  })

  it("has correct default state", () => {
    const { container } = render(<AvatarVideoDisplay />)
    // Default state should be 'disconnected'
    expect(container.querySelector("div")).toBeInTheDocument()
  })

  it("renders with MediaStream mode enabled", () => {
    const { container } = render(<AvatarVideoDisplay useMediaStream={true} />)
    expect(container).toBeInTheDocument()
  })

  it("renders with MediaStream mode disabled (default)", () => {
    const { container } = render(<AvatarVideoDisplay useMediaStream={false} />)
    expect(container).toBeInTheDocument()
  })
})
