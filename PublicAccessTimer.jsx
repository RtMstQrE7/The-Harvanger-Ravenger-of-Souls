import { useState, useEffect } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const PublicAccessTimer = () => {
  const [timeLeft, setTimeLeft] = useState(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const publicAccessStart = localStorage.getItem('publicAccessStart')
      if (!publicAccessStart) return

      const startTime = parseInt(publicAccessStart)
      const now = new Date().getTime()
      const fortyEightHours = 48 * 60 * 60 * 1000 // 48 hours in milliseconds
      const remaining = fortyEightHours - (now - startTime)

      if (remaining <= 0) {
        setIsExpired(true)
        setTimeLeft(null)
      } else {
        setIsExpired(false)
        setTimeLeft(remaining)
      }
    }

    // Update immediately
    updateTimer()

    // Update every minute
    const interval = setInterval(updateTimer, 60000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  if (isExpired) {
    return (
      <Alert className="bg-red-900/20 border-red-500/30 mb-4">
        <AlertTriangle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-red-300">
          Free access period has expired. Please log in to continue playing.
        </AlertDescription>
      </Alert>
    )
  }

  if (timeLeft === null) return null

  const isLowTime = timeLeft < 2 * 60 * 60 * 1000 // Less than 2 hours

  return (
    <Alert className={`mb-4 ${
      isLowTime 
        ? 'bg-yellow-900/20 border-yellow-500/30' 
        : 'bg-blue-900/20 border-blue-500/30'
    }`}>
      <Clock className={`h-4 w-4 ${
        isLowTime ? 'text-yellow-400' : 'text-blue-400'
      }`} />
      <AlertDescription className={`${
        isLowTime ? 'text-yellow-300' : 'text-blue-300'
      }`}>
        Free access expires in {formatTime(timeLeft)}. 
        {isLowTime && ' Consider creating an account to continue playing!'}
      </AlertDescription>
    </Alert>
  )
}

export default PublicAccessTimer

