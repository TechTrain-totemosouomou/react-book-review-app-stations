// SignUp.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Compressor from 'compressorjs'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../AuthContext.jsx'
import '../styles/forms.scss'

const SignUp = () => {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setUserName } = useAuth()

  const initialValuesStep1 = {
    email: '',
    name: '',
    password: '',
  }

  const validationSchemaStep1 = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .matches(
        // RFC 5322に基づく正規表現
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Invalid email address'
      )
      .required('Required'),
    name: Yup.string().required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required'),
  })

  const initialValuesStep2 = {
    file: null,
  }

  const validationSchemaStep2 = Yup.object({
    file: Yup.mixed().required('File is required'),
  })

  const handleStep1Submit = async (values, { setSubmitting }) => {
    setError('')

    try {
      const response = await fetch(
        'https://railway.bookreview.techtrain.dev/users',
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
      Cookies.set('authToken', data.token)
      setUserName(values.name)
      setStep(2)
    } catch (error) {
      setError(error.message)
    }

    setSubmitting(false)
  }

  const handleStep2Submit = async (values, { setSubmitting }) => {
    setError('')

    new Compressor(values.file, {
      quality: 0.6,
      success(compressedFile) {
        const formData = new FormData()
        formData.append('icon', compressedFile)

        const authToken = Cookies.get('authToken')

        fetch('https://railway.bookreview.techtrain.dev/uploads', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              return response.json().then((errorData) => {
                throw new Error(
                  errorData.ErrorMessageJP || 'Network response was not ok'
                )
              })
            }
            console.log('File Upload successful!')
            navigate('/')
          })
          .catch((error) => {
            console.error('Error uploading file:', error.message)
            setError(error.message)
          })
      },
      error(err) {
        console.error('Error compressing file:', err.message)
        setError(err.message)
      },
    })

    setSubmitting(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => navigate('/')}
    >
      {step === 1 ? (
        <>
          <div
            className="ml-24 mr-0 w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <h2>SIGN-UP 1/2</h2>
            </div>
            <div className="App-content">
              <p>
                Create your account by entering your email, name, and password.
              </p>

              {error && <div className="error-message">{error}</div>}

              <Formik
                initialValues={initialValuesStep1}
                validationSchema={validationSchemaStep1}
                onSubmit={handleStep1Submit}
              >
                {({ isSubmitting }) => (
                  <Form className="signup-form">
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
                    />
                    <label htmlFor="name">Name</label>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message"
                    />
                    <Field
                      name="name"
                      type="text"
                      id="name"
                      placeholder="Your Name"
                    />
                    <label htmlFor="password">Password</label>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                    <Field name="password" type="password" id="password" />
                    <button type="submit" disabled={isSubmitting}>
                      Next
                    </button>
                    <span className="ml-10">
                      Login <Link to="/login">here</Link>
                    </span>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="ml-24 mr-0 w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <h2>SIGN-UP 2/2</h2>
            </div>
            <div className="App-content">
              <p>Upload an icon image to complete your sign up.</p>

              {error && <div className="error-message">{error}</div>}

              <Formik
                initialValues={initialValuesStep2}
                validationSchema={validationSchemaStep2}
                onSubmit={handleStep2Submit}
              >
                {({ setFieldValue, isSubmitting }) => (
                  <Form className="file-upload-form">
                    <label htmlFor="file">File</label>
                    <input
                      name="file"
                      type="file"
                      id="file"
                      onChange={(event) =>
                        setFieldValue('file', event.currentTarget.files[0])
                      }
                    />
                    <ErrorMessage
                      name="file"
                      component="div"
                      className="error-message"
                    />
                    <button type="submit" disabled={isSubmitting}>
                      Upload File
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SignUp
