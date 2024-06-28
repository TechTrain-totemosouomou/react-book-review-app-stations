import React, { useState } from 'react';
import './App.css';

function App() {
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch('https://railway.bookreview.techtrain.dev/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.ErrorMessageJP || 'Network response was not ok');
      }

      console.log('Login successful!');

    } catch (error) {
      console.error('Error logging in:', error.message);
      setError(error.message);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Book Review</h1>
        <p>Enter your email and password to access your account.</p>

        {error && <div className="error-message">{error}</div>} {/* エラーメッセージを表示 */}
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input name="email" type="email" id="email" placeholder="example@email.com" required />
          <label htmlFor="password">Password</label>
          <input name="password" type="password" id="password" required />
          <button type="submit">Login</button>
        </form>
      </header>
    </div>
  );
}

export default App;
