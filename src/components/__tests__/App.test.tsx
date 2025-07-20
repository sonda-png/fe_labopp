import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

// Simple test component for testing setup
const TestComponent = () => {
  return <div>Test Component</div>
}

describe('Test Setup', () => {
  it('should render test component', () => {
    render(<TestComponent />)
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })
})
