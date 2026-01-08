/**
 * Tests for CameraSelector component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { CameraSelector } from "../camera-selector"
import type { CameraSelectorProps, CameraDevice } from "../camera-selector"

describe("CameraSelector Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<CameraSelector />)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    const devices: CameraDevice[] = [
      { deviceId: "cam1", label: "Camera 1", groupId: "group1" },
      { deviceId: "cam2", label: "Camera 2", groupId: "group2" },
    ]

    const props: CameraSelectorProps = {
      devices,
      value: "cam1",
      onValueChange: () => {},
      disabled: false,
      onDisabledChange: () => {},
      hasError: false,
    }
    expect(props.devices).toHaveLength(2)
    expect(props.value).toBe("cam1")
    expect(props.disabled).toBe(false)
  })

  it("exports CameraDevice type", () => {
    const device: CameraDevice = {
      deviceId: "test-id",
      label: "Test Camera",
      groupId: "test-group",
    }
    expect(device.deviceId).toBe("test-id")
    expect(device.label).toBe("Test Camera")
  })

  it("renders with empty devices list", () => {
    const { container } = render(<CameraSelector devices={[]} />)
    expect(container).toBeInTheDocument()
  })

  it("renders with devices", () => {
    const devices: CameraDevice[] = [
      { deviceId: "cam1", label: "Camera 1" },
      { deviceId: "cam2", label: "Camera 2" },
    ]
    const { container } = render(<CameraSelector devices={devices} />)
    expect(container).toBeInTheDocument()
  })
})
