import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card as UICard, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Heart, Shield, Zap, RotateCcw, Play, Pause } from 'lucide-react'
import Card from './Card'
import GameZone from './GameZone'
import useGameEngine from './useGameEngine'
import DiceRollModal from './DiceRollModal'

const GameBoard = ({ selectedDeck, gameSettings }) => {
  const navigate = useNavigate()
  const {
    gameState,
    gameLog,
    selectedCard,
    aiThinking,
    diceRollResult,
    initializeGame,
    playCard,
    tapForMana,
    nextPhase,
    endTurn,
    selectCard,
    clearSelections,
    isPlayerTurn,
    getManaPoolDisplay,
    isGameOver,
    getWinner
  } = useGameEngine()

  const [manaPoolVisible, setManaPoolVisible] = useState(false)
  const [showDiceRoll, setShowDiceRoll] = useState(false)

  useEffect(() => {
    // Show dice roll modal when game starts
    if (diceRollResult && !showDiceRoll) {
      setShowDiceRoll(true)
    }
  }, [diceRollResult, showDiceRoll])

  const handleCloseDiceRoll = () => {
    setShowDiceRoll(false)
  }

  useEffect(() => {
    // Initialize game with selected deck
    if (selectedDeck && selectedDeck.cards) {
      console.log("Starting game with deck:", selectedDeck)
      
      initializeGame(selectedDeck.cards, [...selectedDeck.cards], gameSettings?.ai || {})
    } else {
      console.error("No selected deck or selected deck has no cards.", selectedDeck)
      // Optionally navigate back to main menu or show an error message
      navigate("/")
    }
  }, [selectedDeck, initializeGame])

  const handleCardClick = (card, index, zone) => {
    if (!isPlayerTurn()) return
    
    if (zone === 'hand') {
      // Try to play the card
      const success = playCard(0, index)
      if (!success) {
        selectCard(card, index, zone)
      }
    } else if (zone === 'battlefield') {
      // Try to tap for mana if it's a land
      if (card.type && card.type.includes('Land') && !card.tapped) {
        tapForMana(0, index)
      } else {
        selectCard(card, index, zone)
      }
    } else {
      selectCard(card, index, zone)
    }
  }

  const handleZoneAction = (action, zone) => {
    console.log('Zone action:', action, 'on', zone)
    // These will be handled by the game engine
  }

  const handleEndTurn = () => {
    if (isPlayerTurn()) {
      endTurn()
    }
  }

  const handleNextPhase = () => {
    if (isPlayerTurn()) {
      nextPhase()
    }
  }

  const getPhaseColor = () => {
    const phaseColors = {
      'untap': 'bg-blue-600',
      'upkeep': 'bg-green-600',
      'draw': 'bg-yellow-600',
      'main1': 'bg-purple-600',
      'main2': 'bg-purple-600',
      'combat': 'bg-red-600',
      'end': 'bg-gray-600'
    }
    return phaseColors[gameState?.phase] || 'bg-purple-600'
  }

  const getPhaseDisplayName = () => {
    const phaseNames = {
      'untap': 'Untap',
      'upkeep': 'Upkeep',
      'draw': 'Draw',
      'main1': 'Main Phase',
      'main2': 'Main Phase 2',
      'combat': 'Combat',
      'end': 'End Step'
    }
    return phaseNames[gameState?.phase] || 'Unknown'
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    )
  }

  const playerState = gameState.players[0]
  const aiState = gameState.players[1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="bg-black/40 border-gray-600 text-white hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Turn {gameState.turn}</h2>
          <Badge className={`${getPhaseColor()} text-white`}>
            {getPhaseDisplayName()}
          </Badge>
          <p className="text-sm text-purple-300 mt-1">
            {gameState.currentPlayer === 0 ? 'Your Turn' : aiThinking ? 'AI is thinking...' : 'AI Turn'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleNextPhase}
            disabled={!isPlayerTurn()}
            variant="outline"
            className="bg-blue-600/20 border-blue-500 text-blue-300 hover:bg-blue-600/40"
          >
            Next Phase
          </Button>
          <Button 
            onClick={handleEndTurn}
            disabled={!isPlayerTurn()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            End Turn
          </Button>
        </div>
      </div>

      {/* Mana Pool Display */}
      {manaPoolVisible && (
        <div className="mb-4 flex justify-center">
          <UICard className="bg-black/40 border-blue-500/30">
            <CardContent className="p-3">
              <div className="text-white text-sm">
                <strong>Your Mana Pool:</strong> {getManaPoolDisplay(0)}
              </div>
            </CardContent>
          </UICard>
        </div>
      )}

      {/* Main Game Area */}
      <div className="grid grid-rows-[auto_1fr_auto] gap-4 h-[calc(100vh-120px)]">
        {/* AI Area */}
        <div className="grid grid-cols-12 gap-4">
          {/* AI Info */}
          <div className="col-span-2">
            <UICard className="bg-black/20 border-red-500/30 h-full">
              <CardContent className="p-4 flex flex-col justify-center items-center">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span className="text-white font-semibold">AI</span>
                </div>
                <div className="flex items-center gap-2 text-red-400">
                  <Heart className="w-6 h-6" />
                  <span className="text-2xl font-bold">{aiState.life}</span>
                </div>
                <div className="text-xs text-gray-400 mt-2 text-center">
                  {getManaPoolDisplay(1)}
                </div>
              </CardContent>
            </UICard>
          </div>

          {/* AI Hand */}
          <div className="col-span-6">
            <GameZone
              title="AI Hand"
              cards={aiState.zones.hand.map(card => ({ ...card, hidden: true }))}
              type="hand"
              owner="ai"
              onCardClick={handleCardClick}
            />
          </div>

          {/* AI Zones */}
          <div className="col-span-4 grid grid-cols-3 gap-2">
            <GameZone
              title="Library"
              cards={aiState.zones.library.slice(0, 1).map(() => ({ name: 'Library Card', hidden: true }))}
              type="library"
              owner="ai"
              onZoneAction={handleZoneAction}
              maxVisible={1}
            />
            <GameZone
              title="Graveyard"
              cards={aiState.zones.graveyard}
              type="graveyard"
              owner="ai"
              onZoneAction={handleZoneAction}
              maxVisible={3}
            />
            <GameZone
              title="Exile"
              cards={aiState.zones.exile}
              type="exile"
              owner="ai"
              maxVisible={3}
            />
          </div>
        </div>

        {/* Battlefield */}
        <div className="grid grid-cols-2 gap-4">
          <GameZone
            title="AI Battlefield"
            cards={aiState.zones.battlefield}
            type="battlefield"
            owner="ai"
            onCardClick={handleCardClick}
            maxVisible={8}
          />
          <GameZone
            title="Your Battlefield"
            cards={playerState.zones.battlefield}
            type="battlefield"
            owner="player"
            onCardClick={handleCardClick}
            isActive={isPlayerTurn()}
            maxVisible={8}
          />
        </div>

        {/* Player Area */}
        <div className="grid grid-cols-12 gap-4">
          {/* Player Zones */}
          <div className="col-span-4 grid grid-cols-3 gap-2">
            <GameZone
              title="Library"
              cards={playerState.zones.library.slice(0, 1).map(() => ({ name: 'Library Card', hidden: true }))}
              type="library"
              owner="player"
              onZoneAction={handleZoneAction}
              maxVisible={1}
            />
            <GameZone
              title="Graveyard"
              cards={playerState.zones.graveyard}
              type="graveyard"
              owner="player"
              onZoneAction={handleZoneAction}
              maxVisible={3}
            />
            <GameZone
              title="Exile"
              cards={playerState.zones.exile}
              type="exile"
              owner="player"
              maxVisible={3}
            />
          </div>

          {/* Player Hand */}
          <div className="col-span-6">
            <GameZone
              title="Your Hand"
              cards={playerState.zones.hand}
              type="hand"
              owner="player"
              onCardClick={handleCardClick}
              isActive={isPlayerTurn()}
            />
          </div>

          {/* Player Info */}
          <div className="col-span-2">
            <UICard className="bg-black/20 border-blue-500/30 h-full">
              <CardContent className="p-4 flex flex-col justify-center items-center">
                <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Heart className="w-6 h-6" />
                  <span className="text-2xl font-bold">{playerState.life}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-semibold">You</span>
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setManaPoolVisible(!manaPoolVisible)}
                  className="text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Mana
                </Button>
              </CardContent>
            </UICard>
          </div>
        </div>
      </div>

      {/* Game Log */}
      <div className="mt-4">
        <UICard className="bg-black/20 border-gray-500/30">
          <CardContent className="p-3">
            <div className="text-white text-sm font-semibold mb-2">Game Log</div>
            <div className="text-gray-300 text-xs space-y-1 max-h-20 overflow-y-auto">
              {gameLog.map((entry, index) => (
                <div key={index}>{entry}</div>
              ))}
            </div>
          </CardContent>
        </UICard>
      </div>

      {/* Dice Roll Modal */}
      {showDiceRoll && (
        <DiceRollModal 
          diceRollResult={diceRollResult}
          onClose={handleCloseDiceRoll}
        />
      )}

      {/* Game Over Modal */}
      {isGameOver() && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <UICard className="bg-black/90 border-gray-500">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-gray-300 mb-4">
                {getWinner() === 0 ? 'You win!' : 'AI wins!'}
              </p>
              <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
                Return to Menu
              </Button>
            </CardContent>
          </UICard>
        </div>
      )}
    </div>
  )
}

export default GameBoard

