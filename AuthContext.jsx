import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if 48-hour public access period is still active
    const publicAccessStart = localStorage.getItem('publicAccessStart')
    const now = new Date().getTime()
    
    if (!publicAccessStart) {
      // First time - set the start time for 48-hour public access
      localStorage.setItem('publicAccessStart', now.toString())
    }
    
    const startTime = parseInt(publicAccessStart || now.toString())
    const fortyEightHours = 48 * 60 * 60 * 1000 // 48 hours in milliseconds
    const isPublicAccessActive = (now - startTime) < fortyEightHours
    
    // Debug logging (remove in production)
    console.log("AuthContext Debug: isPublicAccessActive", isPublicAccessActive)
    console.log("AuthContext Debug: Time Left (ms)", fortyEightHours - (now - startTime))
    
    if (isPublicAccessActive) {
      // Auto-login as guest user during public access period
      const guestUser = {
        username: 'guest',
        isAdmin: false,
        clanMember: true,
        publicAccess: true,
        loginTime: new Date().toISOString()
      }
      setUser(guestUser)
    } else {
      // Check for existing user session after public access period
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          if (!userData.publicAccess) { // Don't restore guest sessions
            setUser(userData)
          }
        } catch (error) {
          console.error('Error parsing saved user data:', error)
          localStorage.removeItem('currentUser')
        }
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    if (!userData.publicAccess) {
      localStorage.setItem('currentUser', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentGameState')
    localStorage.removeItem('customDecks')
  }

  const isAuthenticated = () => {
    return user && user.clanMember
  }

  const isAdmin = () => {
    return user && user.isAdmin
  }

  const isPublicAccess = () => {
    return user && user.publicAccess
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isPublicAccess,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

