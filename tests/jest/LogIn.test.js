/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from '../../src/pages/LogIn.jsx'

test('renders login button', () => {
  render(<Login />)
  const loginButton = screen.getByRole('button', { name: /login/i })
  expect(loginButton).toBeInTheDocument()
})

test('email and password input fields are required', () => {
  render(<Login />)
  const emailInput = screen.getByRole('textbox', { name: /email/i })
  const passwordInput = screen.getByLabelText(/password/i)
  expect(emailInput).toHaveAttribute('required')
  expect(passwordInput).toHaveAttribute('required')
})
