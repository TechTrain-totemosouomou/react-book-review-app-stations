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

  const handleEditClick = () => {
    navigate(`/edit/${id}`)
  }

  const handleDeleteClick = async () => {
    const authToken = Cookies.get('authToken')

    try {
      const response = await fetch(
        `https://railway.bookreview.techtrain.dev/books/${id}`,
        {
          method: 'DELETE',
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

      console.log('Delete Review successful!')
      navigate('/')
    } catch (error) {
      console.error('Error deleting review:', error.message)
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
          <div>
            <h2 className="text-2xl font-bold mb-4">{review.title}</h2>
            <p className="mb-2">
              <strong>URL = </strong>
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
              <strong>Details = </strong> {review.detail}
            </p>
            <p className="mb-4">
              <strong>Review = </strong> {review.review}
            </p>
            <p className="mb-2">
              <strong>Reviewer = </strong> {review.reviewer}
            </p>
            {review.isMine && (
              <div className="flex justify-between w-64">
                <p
                  onClick={handleEditClick}
                  className="text-green-500 hover:underline cursor-pointer"
                >
                  Edit this review
                </p>
                <p
                  onClick={handleDeleteClick}
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  Delete this review
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
