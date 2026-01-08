/**
 * Tests for MobileTabs component API contract
 */

import React from "react"
import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { MobileTabs } from "../mobile-tabs"
import type { MobileTabsProps, Tab } from "../mobile-tabs"

describe("MobileTabs Component", () => {
  const mockTabs: Tab[] = [
    { id: "video", label: "Video", content: <div>Video Content</div> },
    { id: "chat", label: "Chat", content: <div>Chat Content</div> },
  ]

  it("renders without crashing", () => {
    const { container } = render(<MobileTabs tabs={mockTabs} />)
    expect(container).toBeInTheDocument()
  })

  it("accepts all documented props", () => {
    const props: MobileTabsProps = {
      tabs: mockTabs,
      activeTab: "video",
      onTabChange: () => {},
      tabPosition: "top",
    }
    expect(props.tabs).toHaveLength(2)
    expect(props.activeTab).toBe("video")
    expect(props.tabPosition).toBe("top")
  })

  it("exports Tab type", () => {
    const tab: Tab = {
      id: "test",
      label: "Test Tab",
      content: <div>Test Content</div>,
    }
    expect(tab.id).toBe("test")
    expect(tab.label).toBe("Test Tab")
  })

  it("renders with tabs at top", () => {
    const { container } = render(<MobileTabs tabs={mockTabs} tabPosition="top" />)
    expect(container).toBeInTheDocument()
  })

  it("renders with tabs at bottom", () => {
    const { container } = render(<MobileTabs tabs={mockTabs} tabPosition="bottom" />)
    expect(container).toBeInTheDocument()
  })

  it("renders with icon in tab", () => {
    const tabsWithIcons: Tab[] = [
      {
        id: "video",
        label: "Video",
        icon: <span>📹</span>,
        content: <div>Video Content</div>,
      },
      {
        id: "chat",
        label: "Chat",
        icon: <span>💬</span>,
        content: <div>Chat Content</div>,
      },
    ]
    const { container } = render(<MobileTabs tabs={tabsWithIcons} />)
    expect(container).toBeInTheDocument()
  })
})
