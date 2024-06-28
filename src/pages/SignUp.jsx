import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import Compressor from 'compressorjs';
import './SignUp.css';

function SignUp() {
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [token, setToken] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const name = formData.get('name');
    const password = formData.get('password');

    try {
      const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.ErrorMessageJP || 'Network response was not ok');
      }

      const data = await response.json();
      setToken(data.token);
      setStep(2);

    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message);
    }
  }

  async function handleFileUpload(event) {
    event.preventDefault();
    setError('');

    new Compressor(file, {
      quality: 0.6,
      success(compressedFile) {
        const formData = new FormData();
        formData.append('icon', compressedFile);

        fetch('https://railway.bookreview.techtrain.dev/uploads', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errorData => {
              throw new Error(errorData.ErrorMessageJP || 'Network response was not ok');
            });
          }
          console.log('File upload successful!');
        })
        .catch(error => {
          console.error('Error uploading file:', error.message);
          setError(error.message);
        });
      },
      error(err) {
        console.error('Error compressing file:', err.message);
        setError(err.message);
      },
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <Header />
        {step === 1 ? (
          <>
            <h2>SIGN-UP 1/2</h2>
            <p>Create your account by entering your email, name, and password.</p>
            {error && <div className="error-message">{error}</div>} {/* エラーメッセージを表示 */}
            <form className="signup-form" onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input name="email" type="email" id="email" placeholder="example@email.com" required />
              <label htmlFor="name">Name</label>
              <input name="name" type="text" id="name" placeholder="Your Name" required />
              <label htmlFor="password">Password</label>
              <input name="password" type="password" id="password" required />
              <button type="submit">Next</button>
            </form>
          </>
        ) : (
          <>
            <h2>SIGN-UP 2/2</h2>
            <p>Upload an icon image to complete your sign up.</p>
            {error && <div className="error-message">{error}</div>} {/* エラーメッセージを表示 */}
            <form className="file-upload-form" onSubmit={handleFileUpload}>
              <label htmlFor="file">File</label>
              <input name="file" type="file" id="file" onChange={(e) => setFile(e.target.files[0])} required />
              <button type="submit">Upload File</button>
            </form>
          </>
        )}
      </header>
    </div>
  );
}

export default SignUp;
