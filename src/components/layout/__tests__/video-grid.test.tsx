/**
 * Tests for VideoGrid component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { VideoGrid, VideoGridWithControls } from "../video-grid"
import type { VideoGridProps } from "../video-grid"

describe("VideoGrid Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<VideoGrid />)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    const props: VideoGridProps = {
      avatar: <div>Avatar</div>,
      chat: <div>Chat</div>,
      localVideo: <div>Local Video</div>,
      controls: <div>Controls</div>,
    }
    expect(props.avatar).toBeDefined()
    expect(props.chat).toBeDefined()
    expect(props.localVideo).toBeDefined()
    expect(props.controls).toBeDefined()
  })

  it("renders with all sections", () => {
    const { container } = render(
      <VideoGrid
        avatar={<div>Avatar</div>}
        chat={<div>Chat</div>}
        localVideo={<div>Local Video</div>}
        controls={<div>Controls</div>}
      />
    )
    expect(container).toBeInTheDocument()
  })

  it("renders with empty sections", () => {
    const { container } = render(<VideoGrid />)
    expect(container).toBeInTheDocument()
  })
})

describe("VideoGridWithControls Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<VideoGridWithControls />)
    expect(container).toBeInTheDocument()
  })

  it("renders with all sections", () => {
    const { container } = render(
      <VideoGridWithControls
        avatar={<div>Avatar</div>}
        chat={<div>Chat</div>}
        localVideo={<div>Local Video</div>}
        controls={<div>Controls</div>}
      />
    )
    expect(container).toBeInTheDocument()
  })
})
