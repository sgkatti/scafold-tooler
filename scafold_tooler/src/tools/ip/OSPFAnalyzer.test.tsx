import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import OSPFAnalyzer from './OSPFAnalyzer'

describe('OSPFAnalyzer component', () => {
  it('renders without crashing and shows input textarea', () => {
    render(<OSPFAnalyzer />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeTruthy()
  })
})
