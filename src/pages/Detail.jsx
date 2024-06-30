// Detail.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const Detail = () => {
  const { id } = useParams()
  const [review, setReview] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const authToken = Cookies.get('authToken')

  const logSelectBook = useCallback(async () => {
    try {
      const response = await fetch(
        'https://railway.bookreview.techtrain.dev/logs',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ selectBookId: id }),
        }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.ErrorMessageJP || 'Network response was not ok'
        )
      }
    } catch (error) {
      console.error('Error logging selected book:', error.message)
    }
  }, [authToken, id])

  useEffect(() => {
    setError('')

    if (!authToken) {
      setError('認証トークンが見つかりません')
      return
    }

    const fetchReview = async () => {
      try {
        const response = await fetch(
          `https://railway.bookreview.techtrain.dev/books/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.ErrorMessageJP || 'Network response was not ok'
          )
        }
        const data = await response.json()
        setReview(data)

        // ローディングUIが表示された後にログを記録する
        console.log('aaa')
        logSelectBook()
      } catch (error) {
        console.error('Error fetching review:', error.message)
        setError(error.message)
      }
    }

    fetchReview()
  }, [id, authToken, logSelectBook]) // 依存配列に logSelectBook を追加

  if (error) return <div>Error: {error}</div>
  if (!review) return <div>Loading...</div>

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => navigate('/')}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 md:p-8 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">{review.title}</h2>
            <p className="mb-2">
              <strong>URL:</strong>{' '}
              <a
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                {review.url}
              </a>
            </p>
            <p className="mb-4">
              <strong>Details:</strong> {review.detail}
            </p>
            <p className="mb-4">
              <strong>Review:</strong> {review.review}
            </p>
            <p className="mb-2">
              <strong>Reviewer:</strong> {review.reviewer}
            </p>
            {review.isMine && (
              <p className="text-green-500">This is your review.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
