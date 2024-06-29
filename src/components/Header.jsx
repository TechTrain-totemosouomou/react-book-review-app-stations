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
      <p>
        <Link to="/">Book Review</Link>：{renderLink()}
        {userName && <span>ようこそ、{userName}さん</span>}
      </p>
    </header>
  )
}

export default Header
