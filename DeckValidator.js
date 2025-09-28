// Deck validation utilities for Magic: The Gathering Clone

export class DeckValidator {
  // Validate deck size (40-60 cards)
  static validateDeckSize(deck) {
    if (!deck || !Array.isArray(deck)) {
      return { valid: false, error: 'Invalid deck format' }
    }
    
    const totalCards = deck.reduce((sum, card) => sum + (card.count || 1), 0)
    
    if (totalCards < 40) {
      return { 
        valid: false, 
        error: `Deck too small: ${totalCards} cards (minimum 40 required)` 
      }
    }
    
    if (totalCards > 60) {
      return { 
        valid: false, 
        error: `Deck too large: ${totalCards} cards (maximum 60 allowed)` 
      }
    }
    
    return { valid: true, totalCards }
  }
  
  // Validate card counts (max 4 of any non-basic land)
  static validateCardCounts(deck) {
    const cardCounts = {}
    
    for (const card of deck) {
      const cardName = card.name
      const count = card.count || 1
      
      if (cardCounts[cardName]) {
        cardCounts[cardName] += count
      } else {
        cardCounts[cardName] = count
      }
      
      // Check if it's a basic land
      const isBasicLand = card.supertypes && card.supertypes.includes('Basic')
      
      // Non-basic lands and other cards limited to 4 copies
      if (!isBasicLand && cardCounts[cardName] > 4) {
        return {
          valid: false,
          error: `Too many copies of "${cardName}": ${cardCounts[cardName]} (maximum 4 allowed)`
        }
      }
    }
    
    return { valid: true }
  }
  
  // Validate deck composition (reasonable land/spell ratio)
  static validateDeckComposition(deck) {
    let landCount = 0
    let spellCount = 0
    
    for (const card of deck) {
      const count = card.count || 1
      
      if (card.type && card.type.includes('Land')) {
        landCount += count
      } else {
        spellCount += count
      }
    }
    
    const totalCards = landCount + spellCount
    const landRatio = landCount / totalCards
    
    // Warn if land ratio is too low or too high
    if (landRatio < 0.3) {
      return {
        valid: true,
        warning: `Low land count: ${landCount}/${totalCards} (${Math.round(landRatio * 100)}%). Consider adding more lands.`
      }
    }
    
    if (landRatio > 0.6) {
      return {
        valid: true,
        warning: `High land count: ${landCount}/${totalCards} (${Math.round(landRatio * 100)}%). Consider adding more spells.`
      }
    }
    
    return { valid: true }
  }
  
  // Full deck validation
  static validateDeck(deck) {
    const sizeValidation = this.validateDeckSize(deck)
    if (!sizeValidation.valid) {
      return sizeValidation
    }
    
    const countValidation = this.validateCardCounts(deck)
    if (!countValidation.valid) {
      return countValidation
    }
    
    const compositionValidation = this.validateDeckComposition(deck)
    
    return {
      valid: true,
      totalCards: sizeValidation.totalCards,
      warning: compositionValidation.warning
    }
  }
  
  // Convert deck format for game engine (expand cards with count > 1)
  static expandDeck(deck) {
    const expandedDeck = []
    
    for (const card of deck) {
      const count = card.count || 1
      for (let i = 0; i < count; i++) {
        expandedDeck.push({ ...card })
      }
    }
    
    return expandedDeck
  }
}

export default DeckValidator

