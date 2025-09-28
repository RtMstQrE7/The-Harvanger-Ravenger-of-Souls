import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Upload, Download, Image, Palette, FileText, Save, Plus, Trash2 } from 'lucide-react'

const OfflineAssetEditor = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('cards')
  const fileInputRef = useRef(null)

  // Card Editor State
  const [cardData, setCardData] = useState({
    name: '',
    cost: '',
    type: '',
    text: '',
    power: '',
    toughness: '',
    image: null
  })

  // Background Editor State
  const [backgroundData, setBackgroundData] = useState({
    name: '',
    image: null,
    type: 'gameboard' // gameboard, table, deckbuilder
  })

  const showMessage = (msg) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === 'card') {
          setCardData(prev => ({ ...prev, image: e.target.result }))
        } else if (type === 'background') {
          setBackgroundData(prev => ({ ...prev, image: e.target.result }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const saveCard = () => {
    if (!cardData.name || !cardData.image) {
      showMessage('Please provide at least a card name and image')
      return
    }

    // In a real implementation, this would save to local storage or file system
    const cardJson = {
      name: cardData.name,
      manaCost: cardData.cost,
      type: cardData.type,
      text: cardData.text,
      power: cardData.power || undefined,
      toughness: cardData.toughness || undefined,
      image: cardData.image,
      custom: true,
      created: new Date().toISOString()
    }

    // Save to localStorage for demo purposes
    const customCards = JSON.parse(localStorage.getItem('customCards') || '[]')
    customCards.push(cardJson)
    localStorage.setItem('customCards', JSON.stringify(customCards))

    showMessage(`Card "${cardData.name}" saved successfully!`)
    
    // Reset form
    setCardData({
      name: '',
      cost: '',
      type: '',
      text: '',
      power: '',
      toughness: '',
      image: null
    })
  }

  const saveBackground = () => {
    if (!backgroundData.name || !backgroundData.image) {
      showMessage('Please provide a background name and image')
      return
    }

    // Save to localStorage for demo purposes
    const customBackgrounds = JSON.parse(localStorage.getItem('customBackgrounds') || '[]')
    customBackgrounds.push({
      name: backgroundData.name,
      type: backgroundData.type,
      image: backgroundData.image,
      created: new Date().toISOString()
    })
    localStorage.setItem('customBackgrounds', JSON.stringify(customBackgrounds))

    showMessage(`Background "${backgroundData.name}" saved successfully!`)
    
    // Reset form
    setBackgroundData({
      name: '',
      image: null,
      type: 'gameboard'
    })
  }

  const exportAssets = () => {
    const customCards = JSON.parse(localStorage.getItem('customCards') || '[]')
    const customBackgrounds = JSON.parse(localStorage.getItem('customBackgrounds') || '[]')
    
    const exportData = {
      cards: customCards,
      backgrounds: customBackgrounds,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = 'magic-custom-assets.json'
    link.click()
    
    URL.revokeObjectURL(url)
    showMessage('Assets exported successfully!')
  }

  const importAssets = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result)
          
          if (importData.cards) {
            const existingCards = JSON.parse(localStorage.getItem('customCards') || '[]')
            const mergedCards = [...existingCards, ...importData.cards]
            localStorage.setItem('customCards', JSON.stringify(mergedCards))
          }
          
          if (importData.backgrounds) {
            const existingBackgrounds = JSON.parse(localStorage.getItem('customBackgrounds') || '[]')
            const mergedBackgrounds = [...existingBackgrounds, ...importData.backgrounds]
            localStorage.setItem('customBackgrounds', JSON.stringify(mergedBackgrounds))
          }
          
          showMessage('Assets imported successfully!')
        } catch (error) {
          showMessage('Error importing assets: Invalid file format')
        }
      }
      reader.readAsText(file)
    }
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
            <h1 className="text-3xl font-bold text-white">Asset Editor</h1>
            <p className="text-gray-300">Create and customize game assets</p>
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

        {/* Export/Import Controls */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={exportAssets}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Assets
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Assets
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importAssets}
            className="hidden"
          />
        </div>

        {/* Editor Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-black/40">
            <TabsTrigger value="cards" className="text-white">
              <FileText className="w-4 h-4 mr-2" />
              Card Editor
            </TabsTrigger>
            <TabsTrigger value="backgrounds" className="text-white">
              <Image className="w-4 h-4 mr-2" />
              Background Editor
            </TabsTrigger>
            <TabsTrigger value="manager" className="text-white">
              <Palette className="w-4 h-4 mr-2" />
              Asset Manager
            </TabsTrigger>
          </TabsList>

          {/* Card Editor */}
          <TabsContent value="cards">
            <Card className="bg-black/40 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Create Custom Card</CardTitle>
                <CardDescription className="text-gray-300">
                  Design your own Magic cards with custom images and abilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName" className="text-white">Card Name</Label>
                      <Input
                        id="cardName"
                        value={cardData.name}
                        onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white"
                        placeholder="Enter card name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardCost" className="text-white">Mana Cost</Label>
                      <Input
                        id="cardCost"
                        value={cardData.cost}
                        onChange={(e) => setCardData(prev => ({ ...prev, cost: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white"
                        placeholder="e.g., 2R, 1UU, 3"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardType" className="text-white">Card Type</Label>
                      <Input
                        id="cardType"
                        value={cardData.type}
                        onChange={(e) => setCardData(prev => ({ ...prev, type: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white"
                        placeholder="e.g., Creature - Dragon, Instant, Artifact"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="cardPower" className="text-white">Power</Label>
                        <Input
                          id="cardPower"
                          value={cardData.power}
                          onChange={(e) => setCardData(prev => ({ ...prev, power: e.target.value }))}
                          className="bg-black/20 border-gray-600 text-white"
                          placeholder="Power"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardToughness" className="text-white">Toughness</Label>
                        <Input
                          id="cardToughness"
                          value={cardData.toughness}
                          onChange={(e) => setCardData(prev => ({ ...prev, toughness: e.target.value }))}
                          className="bg-black/20 border-gray-600 text-white"
                          placeholder="Toughness"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardText" className="text-white">Card Text</Label>
                      <Textarea
                        id="cardText"
                        value={cardData.text}
                        onChange={(e) => setCardData(prev => ({ ...prev, text: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white"
                        placeholder="Enter card abilities and flavor text"
                        rows={4}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Card Image</Label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                        {cardData.image ? (
                          <img
                            src={cardData.image}
                            alt="Card preview"
                            className="max-w-full h-48 object-contain mx-auto rounded"
                          />
                        ) : (
                          <div className="text-gray-400">
                            <Image className="w-12 h-12 mx-auto mb-2" />
                            <p>No image selected</p>
                          </div>
                        )}
                        <Button
                          onClick={() => document.getElementById('cardImageInput').click()}
                          className="mt-2 bg-purple-600 hover:bg-purple-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        <input
                          id="cardImageInput"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'card')}
                          className="hidden"
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={saveCard}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Card
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Background Editor */}
          <TabsContent value="backgrounds">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Background Editor</CardTitle>
                <CardDescription className="text-gray-300">
                  Customize game backgrounds and table textures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bgName" className="text-white">Background Name</Label>
                      <Input
                        id="bgName"
                        value={backgroundData.name}
                        onChange={(e) => setBackgroundData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-black/20 border-gray-600 text-white"
                        placeholder="Enter background name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bgType" className="text-white">Background Type</Label>
                      <select
                        id="bgType"
                        value={backgroundData.type}
                        onChange={(e) => setBackgroundData(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full p-2 bg-black/20 border border-gray-600 text-white rounded"
                      >
                        <option value="gameboard">Game Board</option>
                        <option value="table">Table Texture</option>
                        <option value="deckbuilder">Deck Builder Screen</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Background Image</Label>
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                        {backgroundData.image ? (
                          <img
                            src={backgroundData.image}
                            alt="Background preview"
                            className="max-w-full h-48 object-contain mx-auto rounded"
                          />
                        ) : (
                          <div className="text-gray-400">
                            <Image className="w-12 h-12 mx-auto mb-2" />
                            <p>No image selected</p>
                          </div>
                        )}
                        <Button
                          onClick={() => document.getElementById('bgImageInput').click()}
                          className="mt-2 bg-purple-600 hover:bg-purple-700"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        <input
                          id="bgImageInput"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'background')}
                          className="hidden"
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={saveBackground}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Background
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Asset Manager */}
          <TabsContent value="manager">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Custom Cards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {JSON.parse(localStorage.getItem('customCards') || '[]').map((card, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded">
                        <span className="text-white">{card.name}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/40 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Custom Backgrounds</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {JSON.parse(localStorage.getItem('customBackgrounds') || '[]').map((bg, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded">
                        <span className="text-white">{bg.name}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default OfflineAssetEditor

