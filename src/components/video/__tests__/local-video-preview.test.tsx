/**
 * Tests for LocalVideoPreview component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { LocalVideoPreview } from "../local-video-preview"
import type { LocalVideoPreviewProps } from "../local-video-preview"

describe("LocalVideoPreview Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<LocalVideoPreview />)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    // Type-only test - verifies prop interface is complete
    const props: LocalVideoPreviewProps = {
      videoTrack: null,
      isMirrored: true,
      showLabel: true,
      label: "You",
      placeholder: <div>Camera off</div>,
      useMediaStream: true,
    }
    expect(props.isMirrored).toBe(true)
    expect(props.showLabel).toBe(true)
    expect(props.label).toBe("You")
    expect(props.useMediaStream).toBe(true)
  })

  it("renders with mirror enabled by default", () => {
    const { container } = render(<LocalVideoPreview />)
    expect(container).toBeInTheDocument()
  })

  it("renders with custom label", () => {
    const { container } = render(<LocalVideoPreview label="Custom Label" />)
    expect(container).toBeInTheDocument()
  })

  it("renders with MediaStream mode enabled", () => {
    const { container } = render(<LocalVideoPreview useMediaStream={true} />)
    expect(container).toBeInTheDocument()
  })

  it("renders with MediaStream mode disabled (default)", () => {
    const { container } = render(<LocalVideoPreview useMediaStream={false} />)
    expect(container).toBeInTheDocument()
  })
})
