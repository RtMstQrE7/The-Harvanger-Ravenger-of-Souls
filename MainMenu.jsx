import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Settings, BookOpen, Hammer, Sparkles, Upload, Download, Plus } from 'lucide-react'
import { useAuth } from './AuthContext'
import DeckValidator from './DeckValidator'
import PublicAccessTimer from './PublicAccessTimer'

const MainMenu = ({ selectedDeck, setSelectedDeck, user, onLogout }) => {
  const navigate = useNavigate()
  const [availableDecks, setAvailableDecks] = useState([])
  const [customDecks, setCustomDecks] = useState([])
  const { isPublicAccess } = useAuth()
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Load available decks from the assets and custom decks from localStorage
    const loadDecks = async () => {
      try {
        // Load built-in deck names
        const deckNames = [
          'OfTheCoast1_J25',
          'Bloody1_J25',
          'Dragons1_J25',
          'Elves2_J25',
          'Goblins1_J25',
          'Vampires4_J25',
          'Wizards2_J25',
          'Beasts1_J25',
          'BlueBlack_FIN',
          'Chaos_J25',
          'Clerics1_J25',
          'Enchanted1_J25',
          'Encounter4_J25',
          'Explorers2_J25',
          'Goblins2_J25',
          'GraveRobbers4_J25',
          'Landfall1_J25',
          'RedWhite_FIN',
          'Treasures1_J25',
          'Zealots2_J25'
        ]
        
        setAvailableDecks(deckNames)
        
        // Load custom decks from localStorage
        const savedCustomDecks = JSON.parse(localStorage.getItem('customDecks') || '[]')
        setCustomDecks(savedCustomDecks)
        
        if (!selectedDeck && deckNames.length > 0) {
          const defaultDeckName = deckNames[0]
          const deckData = await import(`./assets/decks/${defaultDeckName}.json`)
          setSelectedDeck({ name: defaultDeckName, cards: deckData.data.mainBoard })
        }

        // Ensure selectedDeck is a full object with cards
        if (selectedDeck && typeof selectedDeck === 'string') {
          const deckData = await import(`./assets/decks/${selectedDeck}.json`)
          setSelectedDeck({ name: selectedDeck, cards: deckData.data.mainBoard })
        } else if (selectedDeck && selectedDeck.name && !selectedDeck.cards) {
          // If it's a custom deck name, try to find it in customDecks
          const customDeck = savedCustomDecks.find(d => d.name === selectedDeck.name)
          if (customDeck) {
            setSelectedDeck(customDeck)
          }
        }
      } catch (error) {
        console.error('Error loading decks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDecks()
  }, [selectedDeck, setSelectedDeck])

  // Import deck from JSON file
  const importDeckFromFile = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const deckData = JSON.parse(e.target.result)
        
        // Validate deck format
        if (!deckData.data || !deckData.data.cards || !Array.isArray(deckData.data.cards)) {
          alert('Invalid deck file format. Expected format: { "data": { "cards": [...] } }')
          return
        }

        const deckName = deckData.data.name || file.name.replace('.json', '')
        
        // Create deck object
        const newDeck = {
          name: deckName,
          cards: deckData.data.cards,
          cardCount: deckData.data.cards.length,
          imported: true,
          created: new Date().toISOString()
        }

        // Add to custom decks
        const updatedCustomDecks = [...customDecks, newDeck]
        setCustomDecks(updatedCustomDecks)
        localStorage.setItem('customDecks', JSON.stringify(updatedCustomDecks))
        
        // Select the imported deck
        setSelectedDeck(deckName)
        
        alert(`Successfully imported deck "${deckName}" with ${deckData.data.cards.length} cards!`)
      } catch (error) {
        console.error('Error importing deck:', error)
        alert('Error reading deck file. Please ensure it\'s a valid JSON file.')
      }
    }
    reader.readAsText(file)
    
    // Reset file input
    event.target.value = ''
  }

  // Export a deck as JSON
  const exportDeck = (deckName) => {
    // Find the deck in custom decks
    const deck = customDecks.find(d => d.name === deckName)
    if (!deck) {
      alert('Can only export custom decks')
      return
    }

    const deckData = {
      data: {
        name: deck.name,
        cards: deck.cards
      }
    }

    const dataStr = JSON.stringify(deckData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${deckName.replace(/\s+/g, '_')}.json`
    link.click()
    
    URL.revokeObjectURL(url)
  }

  // Delete a custom deck
  const deleteCustomDeck = (deckName) => {
    if (confirm(`Are you sure you want to delete the deck "${deckName}"?`)) {
      const updatedCustomDecks = customDecks.filter(d => d.name !== deckName)
      setCustomDecks(updatedCustomDecks)
      localStorage.setItem('customDecks', JSON.stringify(updatedCustomDecks))
      
      // If the deleted deck was selected, select another one
      if (selectedDeck === deckName) {
        const allDecks = [...availableDecks, ...updatedCustomDecks.map(d => d.name)]
        setSelectedDeck(allDecks[0] || null)
      }
    }
  }

  const handleStartGame = async () => {
    if (!selectedDeck) {
      alert('Please select a deck first!')
      return
    }
    
    try {
      let deckData
      
      // If selectedDeck is a string (deck name), load the deck data
      if (typeof selectedDeck === 'string') {
        // Check if it's a built-in deck
        if (availableDecks.includes(selectedDeck)) {
          const deckModule = await import(`./assets/decks/${selectedDeck}.json`)
          deckData = { name: selectedDeck, cards: deckModule.data.mainBoard }
        } else {
          // Check if it's a custom deck
          const customDeck = customDecks.find(d => d.name === selectedDeck)
          if (customDeck) {
            deckData = customDeck
          } else {
            alert('Selected deck not found!')
            return
          }
        }
      } else {
        // selectedDeck is already an object with cards
        deckData = selectedDeck
      }
      
      // Validate deck before starting game
      const validation = DeckValidator.validateDeck(deckData.cards)
      if (!validation.valid) {
        alert(`Deck validation failed: ${validation.error}`)
        return
      }
      
      // Show warning if deck composition is suboptimal
      if (validation.warning) {
        const proceed = confirm(`Deck Warning: ${validation.warning}\n\nDo you want to continue anyway?`)
        if (!proceed) return
      }
      
      // Expand deck (convert count properties to individual cards)
      const expandedCards = DeckValidator.expandDeck(deckData.cards)
      const finalDeckData = { ...deckData, cards: expandedCards }
      
      // Update selectedDeck to be the full object before navigating
      setSelectedDeck(finalDeckData)
      
      // Navigate to game
      navigate('/game')
    } catch (error) {
      console.error('Error loading deck for game:', error)
      alert('Error loading deck. Please try again.')
    }
  }

  const allDecks = [...availableDecks, ...customDecks.map(d => d.name)]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Public Access Timer */}
        {isPublicAccess() && <PublicAccessTimer />}
        
        {/* User Info Header */}
        {user && (
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">
              <span className="text-sm text-gray-300">Welcome back,</span>
              <span className="ml-2 font-semibold">{user.username}</span>
              {user.isAdmin && (
                <span className="ml-2 px-2 py-1 bg-purple-600 text-xs rounded">Admin</span>
              )}
            </div>
            <div className="flex gap-2">
              {user.isAdmin && (
                <Button
                  onClick={() => navigate('/admin')}
                  variant="outline"
                  size="sm"
                  className="bg-black/20 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                >
                  Admin Panel
                </Button>
              )}
              {!isPublicAccess() && (
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="bg-black/20 border-gray-600 text-white hover:bg-gray-700"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Public Access Banner */}
        {isPublicAccess() && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <div className="text-center">
              <h3 className="text-green-400 font-semibold mb-2">🎉 48-Hour Free Access Period!</h3>
              <p className="text-green-200 text-sm">
                Welcome! You have free access to the Magic: The Gathering Clone for the next 48 hours. 
                No login required - just jump in and play!
              </p>
              <p className="text-green-300 text-xs mt-2">
                After this period, you'll need to join the R&R Clan to continue playing.
              </p>
            </div>
          </div>
        )}
        
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Magic: The Gathering
          </h1>
          <p className="text-xl text-gray-300">Clone Game - R&R Clan</p>
        </div>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Play Game Card */}
          <Card className="bg-black/40 border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Play className="w-6 h-6 text-green-400" />
                Play Game
              </CardTitle>
              <CardDescription className="text-gray-300">
                Start a new game against the AI opponent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Select Deck:
                </label>
                <Select value={selectedDeck || ''} onValueChange={setSelectedDeck}>
                  <SelectTrigger className="bg-black/20 border-gray-600 text-white">
                    <SelectValue placeholder="Choose a deck..." />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-600">
                    {/* Built-in decks */}
                    {availableDecks.map((deckName) => (
                      <SelectItem key={deckName} value={deckName} className="text-white hover:bg-gray-700">
                        {deckName.replace("_J25", "").replace(/([A-Z])/g, " $1").trim()}
                      </SelectItem>
                    ))}
                    {/* Custom decks */}
                    {customDecks.length > 0 && (
                      <>
                        <div className="px-2 py-1 text-xs text-gray-400 border-t border-gray-600 mt-1">
                          Custom Decks
                        </div>
                        {customDecks.map((deck) => (
                          <SelectItem key={deck.name} value={deck.name} className="text-white hover:bg-gray-700">
                            {deck.name} ({deck.cardCount} cards)
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Import/Export Deck Buttons */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-black/20 border-gray-600 text-white hover:bg-gray-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Deck
                </Button>
                {customDecks.some(d => d.name === selectedDeck) && (
                  <Button 
                    onClick={() => exportDeck(selectedDeck)}
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-black/20 border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={importDeckFromFile}
                style={{ display: 'none' }}
              />
              <Button 
                onClick={handleStartGame}
                disabled={!selectedDeck || loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>

          {/* Deck Builder Card */}
          <Card className="bg-black/40 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Hammer className="w-6 h-6 text-blue-400" />
                Deck Builder
              </CardTitle>
              <CardDescription className="text-gray-300">
                Create and customize your own decks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/deck-builder')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Hammer className="w-4 h-4 mr-2" />
                Build Deck
              </Button>
            </CardContent>
          </Card>

          {/* Rules Card */}
          <Card className="bg-black/40 border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-6 h-6 text-yellow-400" />
                Rules & Guide
              </CardTitle>
              <CardDescription className="text-gray-300">
                Learn how to play and understand card mechanics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/rules')}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Rules
              </Button>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="bg-black/40 border-gray-500/30 hover:border-gray-400/50 transition-all duration-300 hover:scale-105">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="w-6 h-6 text-gray-400" />
                Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure game preferences and AI difficulty
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/settings')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Integration Notice */}
        <Card className="mt-8 bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-400/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">AI-Powered Opponent</h3>
                <p className="text-gray-300">
                  Experience challenging gameplay against an advanced AI model powered by Hugging Face
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MainMenu

