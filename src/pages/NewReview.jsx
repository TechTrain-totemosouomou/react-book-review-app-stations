// NewReview.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import '../styles/forms.scss'

const NewReview = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const validationSchema = Yup.object({
    title: Yup.string().required('Required'),
    url: Yup.string().url('Invalid URL').required('Required'),
    detail: Yup.string().required('Required'),
    review: Yup.string().required('Required'),
  })

  const handleSubmit = async (values, { setSubmitting }) => {
    setError('')
    const authToken = Cookies.get('authToken')

    try {
      const response = await fetch(
        'https://railway.bookreview.techtrain.dev/books',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
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

      console.log('Create New Review successful!')
      navigate('/')
    } catch (error) {
      console.error('Error submitting review:', error.message)
      setError('Error submitting review: ' + error.message)
    } finally {
      setSubmitting(false)
    }
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
          <h2>Create New Review</h2>
        </div>
        <div className="App-content">
          <p>Share your thoughts on your favorite books or products.</p>

          {error && <div className="error-message">{error}</div>}

          <Formik
            initialValues={{ title: '', url: '', detail: '', review: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="new-form">
                <label htmlFor="title">Title</label>
                <ErrorMessage
                  name="title"
                  component="div"
                  className="error-message"
                />
                <Field name="title" type="text" id="title" />
                <label htmlFor="url">URL</label>
                <ErrorMessage
                  name="url"
                  component="div"
                  className="error-message"
                />
                <Field name="url" type="text" id="url" />
                <label htmlFor="detail">Detail</label>
                <ErrorMessage
                  name="detail"
                  component="div"
                  className="error-message"
                />
                <Field name="detail" type="text" id="detail" />
                <label htmlFor="review">Review</label>
                <ErrorMessage
                  name="review"
                  component="div"
                  className="error-message"
                />
                <Field name="review" type="text" id="review" />
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default NewReview
