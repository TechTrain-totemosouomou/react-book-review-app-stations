// Header.jsx
import React from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useAuth } from '../AuthContext' // コンテキストをインポート
import './Header.css'

function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userName, setUserName } = useAuth() // コンテキストから取得

  const renderLink = () => {
    if (location.pathname === '/login') {
      return <Link to="/signup">SIGN-UP</Link>
    } else if (location.pathname === '/signup') {
      return <Link to="/login">LOG-IN</Link>
    }
  }

  const logout = () => {
    Cookies.remove('authToken')
    setUserName('') // ログアウト時にユーザー名を空に
    navigate('/login')
  }

  return (
    <header className="header">
      <p className="flex">
        <Link to="/">Book Review</Link>：{renderLink()}
        {userName && (
          <span className="flex">
            ようこそ、
            <Link to="/profile" className="user-link">
              {userName}さん
              <img
                src="/icon-profile.svg"
                alt="Profile"
                className="user-icon"
              />
            </Link>
            <button onClick={logout} className="logout-button">
              <img
                src="/icon-logout-button.svg"
                alt="Logout"
                className="logout-icon"
              />
            </button>
          </span>
        )}
      </p>
    </header>
  )
}

export default Header
