/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

test('renders login button', () => {
  render(<App />);
  const loginButton = screen.getByRole('button', { name: /login/i });
  expect(loginButton).toBeInTheDocument();
});

test('email and password input fields are required', () => {
  render(<App />);
  const emailInput = screen.getByRole('textbox', { name: /email/i });
  const passwordInput = screen.getByLabelText(/password/i);
  expect(emailInput).toHaveAttribute('required');
  expect(passwordInput).toHaveAttribute('required');
});
