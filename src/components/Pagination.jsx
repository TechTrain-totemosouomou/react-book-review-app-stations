// Pagination.jsx
import React from 'react'

const Pagination = ({ offset, setOffset, books }) => {
  const showPreviousButton = offset > 0
  const showNextButton = books.length === 10

  return (
    <div className="flex justify-between items-end w-36">
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

export default Pagination
