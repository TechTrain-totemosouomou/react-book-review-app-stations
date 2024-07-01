// Profile.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Compressor from 'compressorjs'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../AuthContext.jsx' // useAuth フックをインポートする
import '../styles/forms.scss'

const Profile = () => {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const { userName, setUserName } = useAuth() // useAuth から userName と setUserName を取得
  const navigate = useNavigate()

  const validationSchemaStep1 = Yup.object({
    name: Yup.string().required('Required'),
  })

  const validationSchemaStep2 = Yup.object({
    file: Yup.mixed().required('File is required'),
  })

  const handleStep1Submit = async (values, { setSubmitting }) => {
    setError('')

    try {
      const authToken = Cookies.get('authToken')
      const response = await fetch(
        'https://railway.bookreview.techtrain.dev/users',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ name: values.name }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.ErrorMessageJP || 'Network response was not ok'
        )
      }

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
              <h2>PROFILE EDIT 1/2</h2>
            </div>
            <div className="App-content">
              <p>Update your name.</p>

              {error && <div className="error-message">{error}</div>}

              <Formik
                initialValues={{ name: userName }}
                validationSchema={validationSchemaStep1}
                onSubmit={handleStep1Submit}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form className="profile-form">
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
                    <button type="submit" disabled={isSubmitting}>
                      Next
                    </button>
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
              <h2>PROFILE EDIT 2/2</h2>
            </div>
            <div className="App-content">
              <p>Upload a new icon image to update your profile.</p>

              {error && <div className="error-message">{error}</div>}

              <Formik
                initialValues={{ file: null }}
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

export default Profile
