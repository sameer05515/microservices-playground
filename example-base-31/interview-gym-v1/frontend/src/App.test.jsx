import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App.jsx'
describe('Interview Gym', () => {
  it('shows the sign-in screen when there is no saved token', () => {
    localStorage.clear()
    render(<App />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in to interview gym/i })).toBeInTheDocument()
  })
})
