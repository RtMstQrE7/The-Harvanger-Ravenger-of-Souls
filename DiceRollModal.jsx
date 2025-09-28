import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dice6 } from 'lucide-react'

const DiceRollModal = ({ diceRollResult, onClose }) => {
  const [showAnimation, setShowAnimation] = useState(true)

  useEffect(() => {
    if (diceRollResult) {
      // Show animation for 3 seconds, then allow closing
      const timer = setTimeout(() => {
        setShowAnimation(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [diceRollResult])

  if (!diceRollResult) return null

  const { playerRoll, aiRoll, startingPlayer } = diceRollResult
  const playerWins = startingPlayer === 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-black/90 border-gray-500 max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Dice6 className="w-6 h-6 text-yellow-400" />
            Starting Player Roll
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dice Roll Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`text-center p-4 rounded-lg border-2 ${
              playerWins ? 'border-green-500 bg-green-500/20' : 'border-gray-500 bg-gray-500/20'
            }`}>
              <div className="text-white font-semibold mb-2">Player</div>
              <div className={`text-4xl font-bold ${
                showAnimation ? 'animate-bounce' : ''
              } ${playerWins ? 'text-green-400' : 'text-gray-300'}`}>
                {playerRoll}
              </div>
            </div>
            
            <div className={`text-center p-4 rounded-lg border-2 ${
              !playerWins ? 'border-green-500 bg-green-500/20' : 'border-gray-500 bg-gray-500/20'
            }`}>
              <div className="text-white font-semibold mb-2">AI</div>
              <div className={`text-4xl font-bold ${
                showAnimation ? 'animate-bounce' : ''
              } ${!playerWins ? 'text-green-400' : 'text-gray-300'}`}>
                {aiRoll}
              </div>
            </div>
          </div>

          {/* Winner Announcement */}
          <div className="text-center">
            <div className="text-lg text-white mb-2">
              {playerWins ? 'You' : 'AI'} rolled higher!
            </div>
            <div className="text-xl font-bold text-yellow-400">
              {playerWins ? 'You' : 'AI'} go{playerWins ? '' : 'es'} first
            </div>
          </div>

          {/* Close Button */}
          {!showAnimation && (
            <div className="text-center">
              <Button 
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue to Game
              </Button>
            </div>
          )}
          
          {showAnimation && (
            <div className="text-center text-gray-400 text-sm">
              Rolling dice...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DiceRollModal

