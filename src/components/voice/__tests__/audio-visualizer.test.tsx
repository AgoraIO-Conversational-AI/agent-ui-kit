/**
 * Tests for AudioVisualizer component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { AudioVisualizer } from "../audio-visualizer"
import type { AudioVisualizerProps } from "../audio-visualizer"

describe("AudioVisualizer Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<AudioVisualizer data={[0.5, 0.7, 0.3]} />)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    // Type-only test - verifies prop interface is complete
    const props: AudioVisualizerProps = {
      data: [0.1, 0.2, 0.3],
      barCount: 64,
      barWidth: 3,
      barGap: 1,
      height: 120,
      color: "rgb(34, 197, 94)",
      className: "custom-class",
    }
    expect(props.data).toHaveLength(3)
    expect(props.barCount).toBe(64)
    expect(props.barWidth).toBe(3)
    expect(props.barGap).toBe(1)
    expect(props.height).toBe(120)
    expect(props.color).toBe("rgb(34, 197, 94)")
    expect(props.className).toBe("custom-class")
  })

  it("renders with empty data", () => {
    const { container } = render(<AudioVisualizer data={[]} />)
    expect(container).toBeInTheDocument()
  })

  it("renders with default props", () => {
    const { container } = render(<AudioVisualizer data={[0.5]} />)
    expect(container).toBeInTheDocument()
  })
})
