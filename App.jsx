import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'

// Import components
import MainMenu from './MainMenu'
import GameBoard from './GameBoard'
import DeckBuilder from './DeckBuilder'
import Rules from './Rules'
import Settings from './Settings'
import Login from './Login'
import AdminPanel from './AdminPanel'
import { AuthProvider, useAuth } from './AuthContext'


// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isPublicAccess } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }
  
  if (!isAuthenticated() && !isPublicAccess()) {
    return <Login onLogin={() => {}} />
  }
  
  return children
}

// Main App Content
const AppContent = () => {
  const { user, login, logout, isAuthenticated, isPublicAccess } = useAuth()
  const [selectedDeck, setSelectedDeck] = useState(null)
  const [gameSettings, setGameSettings] = useState(() => {
    // Load settings from localStorage or use defaults
    const saved = localStorage.getItem('gameSettings')
    return saved ? JSON.parse(saved) : {
      ai: {
        difficulty: 'medium',
        personality: 'strategic',
        huggingFaceUrl: 'https://huggingface.co/spaces/kirikir13/my_new_buddy_hermes',
        useHuggingFace: true,
        thinkingTime: 2000
      },
      audio: {
        enabled: true,
        volume: 0.7,
        soundEffects: true,
        music: true
      },
      visual: {
        animations: true,
        cardPreview: true,
        autoZoom: true,
        theme: 'dark'
      },
      gameplay: {
        autoPass: false,
        confirmActions: true,
        showHints: true,
        fastMode: false
      },
      // Legacy settings for backward compatibility
      aiDifficulty: 'medium',
      soundEnabled: true,
      animationsEnabled: true
    }
  })



  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings))
  }, [gameSettings])

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Routes>
          <Route 
            path="/" 
            element={
              isPublicAccess() ? (
                <MainMenu 
                  selectedDeck={selectedDeck}
                  setSelectedDeck={setSelectedDeck}
                  gameSettings={gameSettings}
                  setGameSettings={setGameSettings}
                  user={user}
                  onLogout={logout}
                />
              ) : (
                <Login onLogin={login} />
              )
            } 
          />
          <Route 
            path="/login" 
            element={<Login onLogin={login} />} 
          />
          <Route 
            path="/game" 
            element={
              <ProtectedRoute>
                <GameBoard 
                  selectedDeck={selectedDeck}
                  gameSettings={gameSettings}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/deck-builder" 
            element={
              <ProtectedRoute>
                <DeckBuilder 
                  selectedDeck={selectedDeck}
                  setSelectedDeck={setSelectedDeck}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rules" 
            element={
              <ProtectedRoute>
                <Rules />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings 
                  gameSettings={gameSettings}
                  setGameSettings={setGameSettings}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

