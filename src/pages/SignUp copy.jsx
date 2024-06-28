import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import Compressor from 'compressorjs';
import './SignUp.css';

function SignUp() {
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);

  function handleFirstStepValidation(event) {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const name = formData.get('name');
    const password = formData.get('password');

    // バリデーション
    if (!email || !name || !password) {
      setError('All fields are required.');
      return;
    }

    setEmail(email);
    setName(name);
    setPassword(password);
    setStep(2);
  }

  async function handleSubmitAndUpload(event) {
    event.preventDefault();
    setError('');

    try {
      // サインアップリクエスト
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

      // ファイルアップロードリクエスト
      new Compressor(file, {
        quality: 0.6,
        success(compressedFile) {
          const formData = new FormData();
          formData.append('icon', compressedFile);

          fetch('https://railway.bookreview.techtrain.dev/uploads', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${data.token}`
            },
            body: formData
          })
          .then(response => {
            if (!response.ok) {
              return response.json().then(errorData => {
                throw new Error(errorData.ErrorMessageJP || 'Network response was not ok');
              });
            }
            console.log('Signup and file upload successful!');
          })
          .catch(error => {
            console.error('Error uploading file:', error.message);
            setError(error.message);
            // ロールバック処理（ユーザー作成のキャンセルなど）
          });
        },
        error(err) {
          console.error('Error compressing file:', err.message);
          setError(err.message);
        },
      });

    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message);
    }
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
            <form className="signup-form" onSubmit={handleFirstStepValidation}>
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
            <form className="file-upload-form" onSubmit={handleSubmitAndUpload}>
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
