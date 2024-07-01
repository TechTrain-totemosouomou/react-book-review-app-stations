// Home.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../components/Pagination'
import { useAuth } from '../AuthContext.jsx' // useAuth フックをインポートする
import Cookies from 'js-cookie'

export default function Home() {
  const [books, setBooks] = useState([])
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState('')
  const { fetchUserData, userName, iconUrl } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const authToken = Cookies.get('authToken')
    if (!authToken) {
      setError('認証トークンが見つかりません')
      return
    }

    fetchUserData(authToken)
    fetchBooks(offset)
  }, [offset, userName, iconUrl])

  const fetchBooks = async (newOffset) => {
    try {
      const response = await fetch(
        `https://railway.bookreview.techtrain.dev/public/books?offset=${newOffset}`
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.ErrorMessageJP || 'Network response was not ok'
        )
      }
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.error('Error fetching books:', error.message)
      setError(error.message)
    }
  }

  const handleReviewClick = (book) => {
    navigate('/detail/' + book.id)
  }

  const handleClick = () => {
    navigate('/new')
  }

  return (
    <div className="App">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end w-72 mb-6">
          <h1 className="text-3xl font-bold">Books</h1>
          <Pagination offset={offset} setOffset={setOffset} books={books} />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <button
              key={book.id}
              className="bg-pink-50 bg-opacity-80 shadow-md rounded-lg overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg h-40"
              onClick={() => handleReviewClick(book)}
            >
              <div className="p-2">
                <h2 className="text-2xl font-bold border-b border-gray-300 w-60 mx-auto">
                  {book.title}
                </h2>
                <a
                  href={book.url}
                  className="text-xs hover:underline pt-1 block"
                >
                  {book.url}
                </a>
                <p className="pb-1">{book.detail}</p>
                <p className="p-2 border-l-2 border-gray-300">
                  "{book.review}" - {book.reviewer}
                </p>
              </div>
            </button>
          ))}
          {iconUrl && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <img
                src={iconUrl}
                alt="User Icon"
                style={{ maxHeight: '500px' }}
              />
            </div>
          )}
          <button
            onClick={handleClick}
            className="bg-pink-50 bg-opacity-80 shadow-md rounded-lg overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg"
          >
            <div className="text-2xl font-bold border-b border-gray-300 w-60 mx-auto">
              Create New Review
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
