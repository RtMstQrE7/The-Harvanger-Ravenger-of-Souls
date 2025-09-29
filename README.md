# The-Harvanger-Ravenger-of-Souls
is inspired or partial clone of the concept of the card game:  "Magic The Gathering" And this is the offline version both version still in early release beta form And still under debugging and review - Created by George Roby @ RnR Productions - Intial coding by Manus Ai

A standalone, offline version of: "The Harvanger Ravenger of Souls" card game clone with full asset editing capabilities and no internet requirements.

## 🎮 Quick Start

### Option 1: Simple HTTP Server (Recommended)
1. Open a terminal/command prompt in this folder
2. Run one of these commands:
   - **Python 3**: `python -m http.server 8000`
   - **Python 2**: `python -m SimpleHTTPServer 8000`
   - **Node.js**: `npx serve .`
   - **PHP**: `php -S localhost:8000`
3. Open your web browser and go to `http://localhost:8000`

### Option 2: Direct File Opening
1. Double-click on `index.html`
2. The game should open in your default web browser

## ✨ Features

### 🎯 Complete Offline Gameplay
- Full The Harvanger Ravenger of Souls game mechanics
- AI opponent with strategic decision-making
- No authentication required - instant play
- All game rules implemented (mulligan, dice rolls, phases)
- Deck validation and building tools

### 🎨 Asset Editing Capabilities
- **Card Editor**: Create custom cards with images, stats, and abilities
- **Background Editor**: Change game backgrounds and table textures  
- **Deck Builder**: Build and save custom decks
- **Image Manager**: Import and organize custom artwork
- **Export/Import**: Share creations with other players

## 🔧 Customizing the Game

### Editing Card Images and Backgrounds
- Navigate to the `assets-editable` folder
- Replace any image files with your own custom images
- Keep the same file names to maintain compatibility
- Supported formats: JPG, PNG, WEBP, SVG

### Card Image Guidelines
- **Card backs**: Replace `backofmagiccad.jpg` with your custom card back design
- **Card templates**: Replace `blanks.webp` and `blanksallcolors.jpg` with your custom card templates
- **Game board**: Replace `magicgameboard.png` with your custom game board background
- **Deck building screen**: Replace `deckbuildingscreen.jpg` for custom deck builder background
- **Game table**: Replace `coolergametable.jpg` or `simpletable.avif` for different table textures

### Adding New Card Images
1. Add your new card images to the `assets-editable` folder
2. Update the card data files in `src/assets/decks/` to reference new images
3. Refresh the game in your browser to see the changes

### Creating Custom Decks
1. Copy an existing deck JSON file from `src/assets/decks/`
2. Modify the card list, keeping the same structure
3. Update card images and properties as needed
4. Save with a new filename and restart the game

## 📁 File Structure

```
magic-game-offline/
├── index.html              # Main game file - open this to play
├── assets/                 # Default game assets
├── assets-editable/        # Your custom content goes here
│   ├── custom-cards/      # Custom card images
│   ├── custom-backgrounds/ # Custom backgrounds
│   └── custom-decks/      # User-built decks
├── src/                   # Game source code
│   ├── assets/decks/      # Deck configuration files
│   └── components/        # Game components
└── dist/                  # Built game files
```

## 🎯 Gameplay Features

### Game Rules Implemented
- **Mulligan System**: Automatic re-deal if opening hand has >5 lands
- **Dice Roll**: 20-sided dice determines starting player
- **Deck Validation**: Enforces 40-60 card limit
- **Phase Management**: Proper turn structure and timing
- **AI Opponent**: Strategic computer player

### Deck Building
- Minimum 40 cards, maximum 60 cards
- Maximum 4 copies of any non-basic land card
- Real-time deck validation
- Import/export deck functionality
- Custom deck creation tools

## 🔄 Making Changes
- All your edits are local to your computer
- The game automatically uses your custom assets
- You can always restore original files by re-downloading
- Changes persist between game sessions

## 🚀 Advanced Customization

### Modifying Game Rules
- Edit files in `src/gameLogic.js` for rule changes
- Modify `src/useGameEngine.js` for game flow
- Update `src/aiPlayer.js` for AI behavior
- Restart the game to apply changes

### Creating Card Abilities
- Follow the existing card format in deck JSON files
- Add new ability keywords in the game logic
- Test thoroughly with AI opponent
- Document custom mechanics for other players

## 🔧 Technical Notes
- Static build of React application
- All game logic runs in your browser
- No internet connection required once downloaded
- Compatible with modern web browsers (Chrome, Firefox, Safari, Edge)
- Local storage saves game preferences and custom content

## 🐛 Troubleshooting
- **Images don't load**: Check file paths and formats in assets-editable folder
- **Game won't start**: Use HTTP server method instead of direct file opening
- **Changes don't appear**: Clear browser cache and refresh
- **Custom cards missing**: Verify JSON syntax in deck files
- **Performance issues**: Reduce image file sizes, use optimized formats

## 🔄 Future Updates & Integration
- Save this folder as your master copy
- Track modifications for easy merging with online version
- Use Git or version control for change management
- Export custom content for sharing with community
- Import updates while preserving customizations

## 📋 Version History

### v1.0.0 - Offline Edition
- Complete offline functionality
- Asset editing system
- Custom card creation
- Background customization
- Deck building tools
- Export/import capabilities
- No authentication required
- Full game rules implementation

---

**Enjoy creating and playing your custom Magic: The Gathering experience offline!**

