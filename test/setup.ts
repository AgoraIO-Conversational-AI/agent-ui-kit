/**
 * Test setup for client-ui-kit
 */
import "@testing-library/jest-dom"

// Mock IntersectionObserver for Lottie animations
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any
