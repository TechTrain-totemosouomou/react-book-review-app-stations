// LogIn.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Cookies from 'js-cookie'
import '../styles/forms.scss'

function LogIn() {
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .matches(
        // RFC 5322に基づく正規表現
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Invalid email address'
      )
      .required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required'),
  })

  async function handleSubmit(values, { setSubmitting }) {
    setError('')
    try {
      const response = await fetch(
        'https://railway.bookreview.techtrain.dev/signin',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.ErrorMessageJP || 'Network response was not ok'
        )
      }

      const data = await response.json()
      const authToken = data.token
      Cookies.set('authToken', authToken, { expires: 1 }) // 有効期限24時間
      console.log('Login successful!')
      navigate('/')
    } catch (error) {
      console.error('Error logging in:', error.message)
      setError(error.message)
    }
    setSubmitting(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => navigate('/')}
    >
      <div
        className="ml-24 mr-0 w-full max-w-6xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <h2>LOG-IN</h2>
        </div>
        <div className="App-content">
          <p>Enter your email and password to access your account.</p>

          {error && <div className="error-message">{error}</div>}

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="login-form">
                <label htmlFor="email">Email</label>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
                <Field
                  name="email"
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  required
                />
                <label htmlFor="password">Password</label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
                <Field
                  name="password"
                  type="password"
                  id="password"
                  required
                />
                <button type="submit" disabled={isSubmitting}>
                  Login
                </button>
                <span className="ml-10">
                  Sign Up <Link to="/signup">here</Link>
                </span>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default LogIn
