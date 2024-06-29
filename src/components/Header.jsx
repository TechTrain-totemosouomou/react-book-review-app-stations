import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import './Header.css'

function Header({ userName }) {
  const location = useLocation()

  const renderLink = () => {
    if (location.pathname === '/login') {
      return <Link to="/signup">SIGN-UP</Link>
    } else if (location.pathname === '/signup') {
      return <Link to="/login">LOG-IN</Link>
    }
  }

  return (
    <header className="header">
      <p className='flex'>
        <Link to="/">Book Review</Link>：{renderLink()}
        {userName && (
          <span className='flex'>
            ようこそ、
            <Link to="/profile" className="user-link">
              {userName}
              <img
                src="/icon-profile.svg"
                alt="Profile"
                className="user-icon"
              />
            </Link>
          </span>
        )}
      </p>
    </header>
  )
}

export default Header
