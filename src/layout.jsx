import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from './components/Header.jsx'
import { AuthProvider } from './AuthContext.jsx' // コンテキストプロバイダーをインポート

const Layout = () => {
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
    }
  }, [location])

  return (
    <AuthProvider>
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
        <footer>フッター</footer>
      </div>
    </AuthProvider>
  )
}

export default Layout
