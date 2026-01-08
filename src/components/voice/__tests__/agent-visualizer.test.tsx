/**
 * Tests for AgentVisualizer component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { AgentVisualizer } from "../agent-visualizer"
import type { AgentVisualizerProps, AgentVisualizerState } from "../agent-visualizer"

describe("AgentVisualizer Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<AgentVisualizer state="listening" />)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    // Type-only test - verifies prop interface is complete
    const props: AgentVisualizerProps = {
      state: "talking",
      size: "lg",
      className: "custom-class",
    }
    expect(props.state).toBe("talking")
    expect(props.size).toBe("lg")
    expect(props.className).toBe("custom-class")
  })

  it("exports AgentVisualizerState type", () => {
    const states: AgentVisualizerState[] = ["not-joined", "listening", "talking", "thinking"]
    expect(states.length).toBe(4)
  })

  it("renders with different states", () => {
    const { rerender, container } = render(<AgentVisualizer state="listening" />)
    expect(container).toBeInTheDocument()

    rerender(<AgentVisualizer state="talking" />)
    expect(container).toBeInTheDocument()

    rerender(<AgentVisualizer state="thinking" />)
    expect(container).toBeInTheDocument()

    rerender(<AgentVisualizer state="not-joined" />)
    expect(container).toBeInTheDocument()
  })

  it("renders with different sizes", () => {
    const { rerender, container } = render(<AgentVisualizer state="listening" size="sm" />)
    expect(container).toBeInTheDocument()

    rerender(<AgentVisualizer state="listening" size="md" />)
    expect(container).toBeInTheDocument()

    rerender(<AgentVisualizer state="listening" size="lg" />)
    expect(container).toBeInTheDocument()
  })
})
