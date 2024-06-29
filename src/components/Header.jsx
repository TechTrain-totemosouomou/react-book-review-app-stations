import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <p>
        <Link to="/">Book Review</Link>：<Link to="/login">LOG-IN</Link>：
        <Link to="/signup">SIGN-UP</Link>
      </p>
    </header>
  )
}

export default Header
