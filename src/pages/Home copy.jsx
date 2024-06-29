import React, { useEffect, useState } from 'react'

export default function Component() {
  const [books, setBooks] = useState([])
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBooks(offset) // 初回読み込み時にoffsetを指定してデータを取得
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

  const showPreviousButton = offset > 0
  const showNextButton = books.length === 10

  return (
    <div className="App">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Books</h1>
        {error && <div className="error-message">{error}</div>}{' '}
        {/* エラーメッセージを表示 */}
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
        </div>
      </div>
      {showPreviousButton && (
        <button className="page" onClick={() => setOffset(offset - 10)}>
          前の10件
        </button>
      )}
      {showNextButton && (
        <button className="page" onClick={() => setOffset(offset + 10)}>
          次の10件
        </button>
      )}
    </div>
  )
}
