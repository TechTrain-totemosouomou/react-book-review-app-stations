// AuthContext.jsx
import React, { createContext, useState, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState('')
  const [iconUrl, setIconUrl] = useState('')

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
      updateUserData(userData)
    } catch (error) {
      console.error('Error fetching user data:', error.message)
    }
  }

  const updateUserData = (userData) => {
    setUserName(userData.name)
    setIconUrl(userData.iconUrl)
  }

  return (
    <AuthContext.Provider
      value={{ fetchUserData, userName, setUserName, iconUrl, setIconUrl }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
