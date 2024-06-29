import React, { useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './Header.css'

function Header({ userName, setUserName }) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const authToken = Cookies.get('authToken')
    if (authToken) {
      fetch('https://railway.bookreview.techtrain.dev/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          setUserName(data.name)
        })
        .catch((error) => {
          console.error('Error fetching user data:', error)
        })
    } else {
      setUserName('') // 認証トークンがない場合はユーザー名を空に
    }
  }, [location, setUserName])

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
              {userName}
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
