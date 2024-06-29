import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Compressor from 'compressorjs';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './SignUp.css';

const Profile = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({ name: '', iconUrl: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = Cookies.get('authToken');
        if (!authToken) {
          throw new Error('認証トークンが見つかりません');
        }

        const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.ErrorMessageJP || 'Network response was not ok');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  const validationSchemaStep1 = Yup.object({
    name: Yup.string().required('Required'),
  });

  const validationSchemaStep2 = Yup.object({
    file: Yup.mixed().required('File is required'),
  });

  const handleStep1Submit = async (values, { setSubmitting }) => {
    setError('');

    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch('https://railway.bookreview.techtrain.dev/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name: values.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.ErrorMessageJP || 'Network response was not ok');
      }

      setStep(2);
    } catch (error) {
      setError(error.message);
    }

    setSubmitting(false);
  };

  const handleStep2Submit = async (values, { setSubmitting }) => {
    setError('');

    new Compressor(values.file, {
      quality: 0.6,
      success(compressedFile) {
        const formData = new FormData();
        formData.append('icon', compressedFile);

        const authToken = Cookies.get('authToken');

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
                throw new Error(errorData.ErrorMessageJP || 'Network response was not ok');
              });
            }
            console.log('File upload successful!');
            navigate('/');
          })
          .catch((error) => {
            console.error('Error uploading file:', error.message);
            setError(error.message);
          });
      },
      error(err) {
        console.error('Error compressing file:', err.message);
        setError(err.message);
      },
    });

    setSubmitting(false);
  };

  return (
    <div className="App">
      {step === 1 ? (
        <>
          <div className="App-header">
            <h2>PROFILE EDIT 1/2</h2>
          </div>
          <div className="App-content">
            <p>Update your name.</p>

            {error && <div className="error-message">{error}</div>}

            <Formik
              initialValues={{ name: userData.name }}
              validationSchema={validationSchemaStep1}
              onSubmit={handleStep1Submit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="signup-form">
                  <label htmlFor="name">Name</label>
                  <ErrorMessage name="name" component="div" className="error-message" />
                  <Field name="name" type="text" id="name" placeholder="Your Name" />
                  <button type="submit" disabled={isSubmitting}>
                    Next
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </>
      ) : (
        <>
          <div className="App-header">
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
                    onChange={(event) => setFieldValue('file', event.currentTarget.files[0])}
                  />
                  <ErrorMessage name="file" component="div" className="error-message" />
                  <button type="submit" disabled={isSubmitting}>
                    Upload File
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
