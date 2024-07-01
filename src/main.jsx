// main.jsx
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './layout'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import NewReview from './pages/NewReview'
import Detail from './pages/Detail'
import EditReview from './pages/EditReview'
import { NotFound } from './pages/NotFound'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Layoutをルートコンポーネントとして設定
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <LogIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'new',
        element: <NewReview />,
      },
      {
        path: 'detail/:id',
        element: <Detail />,
      },
      {
        path: 'edit/:id',
        element: <EditReview />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  // 2回描画の原因
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
