/**
 * Tests for Response component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { Response } from "../response"

describe("Response Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Response>Test response</Response>)
    expect(container).toBeInTheDocument()
  })

  it("renders text content", () => {
    const { getByText } = render(<Response>Hello world</Response>)
    expect(getByText("Hello world")).toBeInTheDocument()
  })

  it("renders children elements", () => {
    const { getByText } = render(
      <Response>
        <span>Child element</span>
      </Response>
    )
    expect(getByText("Child element")).toBeInTheDocument()
  })
})
