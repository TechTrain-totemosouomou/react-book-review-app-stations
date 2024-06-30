import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Cookies from 'js-cookie'

const Layout = () => {
  const [userName, setUserName] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const authToken = Cookies.get('authToken')
    // ログインページまたはサインアップページでない場合にのみリダイレクト
    if (
      !authToken &&
      location.pathname !== '/signup' &&
      location.pathname !== '/login'
    ) {
      navigate('/login')
    } else if (authToken) {
      fetchUserData(authToken)
    }
  }, [location])

  const fetchUserData = async (authToken) => {
    try {
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
      setUserName(userData.name)
    } catch (error) {
      console.error('ログイン状態の確認エラー:', error.message)
    }
  }

  return (
    <div>
      <Header userName={userName} setUserName={setUserName} />
      <main>
        <Outlet />
      </main>
      <footer>フッター</footer>
    </div>
  )
}

export default Layout
