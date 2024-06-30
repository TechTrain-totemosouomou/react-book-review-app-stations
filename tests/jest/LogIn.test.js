/**
 * @jest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LogIn from '../../src/pages/LogIn.jsx'

// react-router-domのモック：動作させず見せかけのものに置き換える
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

test('renders login button', () => {
  render(<LogIn />)
  const loginButton = screen.getByRole('button', { name: /login/i })
  expect(loginButton).toBeInTheDocument()
})

test('email and password input fields are required', () => {
  render(<LogIn />)
  const emailInput = screen.getByRole('textbox', { name: /email/i })
  const passwordInput = screen.getByLabelText(/password/i)
  expect(emailInput).toHaveAttribute('required')
  expect(passwordInput).toHaveAttribute('required')
})
