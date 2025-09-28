import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Users, Shield, UserPlus, UserMinus, Clock, Settings, Check, X, User, Crown } from 'lucide-react'
import { useAuth } from './AuthContext'

const AdminPanel = () => {
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const [pendingRequests, setPendingRequests] = useState([])
  const [clanMembers, setClanMembers] = useState([])
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/') // Redirect if not admin
      return
    }

    // Mock data for pending requests and clan members
    const mockPendingRequests = [
      { id: 'req1', username: 'newplayer1', email: 'newplayer1@example.com', requestedAt: '2025-09-20T10:00:00Z' },
      { id: 'req2', username: 'magicrookie', email: 'magicrookie@example.com', requestedAt: '2025-09-21T14:30:00Z' },
    ]

    const mockClanMembers = [
      { id: 'mem1', username: 'george', role: 'admin', joinedAt: '2025-09-15T08:00:00Z', isAdmin: true },
      { id: 'mem2', username: 'testuser', role: 'member', joinedAt: '2025-09-16T11:00:00Z', isAdmin: false },
      { id: 'mem3', username: 'player1', role: 'member', joinedAt: '2025-09-17T13:00:00Z', isAdmin: false },
      { id: 'mem4', username: 'demo', role: 'member', joinedAt: '2025-09-18T15:00:00Z', isAdmin: false },
    ]

    setPendingRequests(mockPendingRequests)
    setClanMembers(mockClanMembers)
  }, [isAdmin, navigate])

  const handleAddUser = (e) => {
    e.preventDefault()
    if (!newUsername || !newPassword) {
      setMessage('Please fill in all fields')
      return
    }

    if (clanMembers.find(u => u.username === newUsername)) {
      setMessage('Username already exists')
      return
    }

    const newUser = {
      id: `mem${Date.now()}`,
      username: newUsername,
      role: isAdminUser ? 'admin' : 'member',
      joinedAt: new Date().toISOString(),
      isAdmin: isAdminUser
    }

    setClanMembers([...clanMembers, newUser])
    setMessage(`User "${newUsername}" added successfully`)
    setNewUsername('')
    setNewPassword('')
    setIsAdminUser(false)

    setTimeout(() => setMessage(''), 3000)
  }

  const resetPublicAccess = () => {
    localStorage.removeItem('publicAccessStart')
    setMessage('Public access period reset - 48 hours starting now')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleApproveRequest = (requestId) => {
    // Simulate approval logic
    console.log(`Approving request ${requestId}`)
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId))
    // In a real app, add to clanMembers via backend
    alert(`Request ${requestId} approved! (Mock action)`)
  }

  const handleDenyRequest = (requestId) => {
    // Simulate denial logic
    console.log(`Denying request ${requestId}`)
    setPendingRequests(pendingRequests.filter(req => req.id !== requestId))
    alert(`Request ${requestId} denied! (Mock action)`)
  }

  const handleRemoveMember = (memberId) => {
    // Simulate removal logic
    console.log(`Removing member ${memberId}`)
    setClanMembers(clanMembers.filter(member => member.id !== memberId))
    alert(`Member ${memberId} removed! (Mock action)`)
  }

  if (!isAdmin()) {
    return null; // Should be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            size="sm"
            className="bg-black/20 border-gray-600 text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-300">R&R Clan Management</p>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <Alert className="mb-6 bg-green-900/20 border-green-500/30">
            <AlertDescription className="text-green-300">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Add New User */}
          <Card className="bg-black/40 border-blue-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UserPlus className="w-5 h-5 text-blue-400" />
                Add New User
              </CardTitle>
              <CardDescription className="text-gray-300">
                Create a new clan member account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="bg-black/20 border-gray-600 text-white"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-black/20 border-gray-600 text-white"
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    checked={isAdminUser}
                    onChange={(e) => setIsAdminUser(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isAdmin" className="text-white">Admin privileges</Label>
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Add User
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="w-5 h-5 text-purple-400" />
                System Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage system-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Public Access Control</Label>
                <p className="text-sm text-gray-400 mb-2">
                  Reset the 48-hour free access period
                </p>
                <Button
                  onClick={resetPublicAccess}
                  variant="outline"
                  className="bg-black/20 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Reset Public Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Requests */}
          <Card className="bg-black/40 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-400" />
                Pending Access Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No pending requests.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">Username</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium text-white">{request.username}</TableCell>
                        <TableCell className="text-gray-300">{request.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApproveRequest(request.id)} className="bg-green-600 hover:bg-green-700">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleDenyRequest(request.id)} className="bg-red-600 hover:bg-red-700">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Clan Members */}
          <Card className="bg-black/40 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                R&R Clan Members ({clanMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clanMembers.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No clan members yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-gray-300">Username</TableHead>
                      <TableHead className="text-gray-300">Role</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clanMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium text-white flex items-center gap-2">
                          {member.isAdmin && <Crown className="w-4 h-4 text-yellow-500" />}
                          {member.username}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <Badge className={member.isAdmin ? 'bg-red-600' : 'bg-blue-600'}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.username !== user.username && (
                            <Button size="sm" onClick={() => handleRemoveMember(member.id)} className="bg-red-600 hover:bg-red-700">
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

