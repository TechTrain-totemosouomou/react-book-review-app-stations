import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import Pagination from '../components/Pagination'

export default function Home() {
  const [books, setBooks] = useState([])
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState('')
  const [userIconUrl, setUserIconUrl] = useState('')

  useEffect(() => {
    fetchBooks(offset) // 初回読み込み時にoffsetを指定してデータを取得
    checkLoginState() // ログイン状態を確認
  }, [offset])

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

  const checkLoginState = async () => {
    try {
      const authToken = Cookies.get('authToken')
      if (!authToken) {
        throw new Error('認証トークンが見つかりません')
      }

      const response = await fetch(
        'https://railway.bookreview.techtrain.dev/users',
        {
          method: 'GET',
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

      const userData = await response.json()
      setUserIconUrl(userData.iconUrl) // ユーザーアイコンURLを保存
    } catch (error) {
      console.error('ログイン状態の確認エラー:', error.message)
    }
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
            <div
              key={book.id}
              className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg"
            >
              <div className="p-4">
                <h2 className="text-lg font-medium mb-2">{book.title}</h2>
                <a
                  href={book.url}
                  className="text-blue-600 hover:underline mb-2 block"
                >
                  {book.url}
                </a>
                <p className="text-gray-600 mb-4">{book.detail}</p>
                <p className="text-gray-600">
                  "{book.review}" - {book.reviewer}
                </p>
              </div>
            </div>
          ))}
          {userIconUrl && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <img
                src={userIconUrl}
                alt="User Icon"
                style={{ maxHeight: '500px' }}
              />
            </div>
          )}
          <button className="bg-pink-50 bg-opacity-80 shadow-md rounded-lg overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
            <div className="text-2xl font-bold border-b border-gray-300 w-60 mx-auto">
              Create New Review
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
