# Bug Fixes Summary for The Harvenger: Ravenger of Souls

Based on the user's detailed feedback, here are the critical bugs that need to be addressed:

## Critical Game-Breaking Issues

### 1. Combat Phase Non-Functional
- **Problem**: Combat phase does not work at all. Creatures cannot attack, tapping them has no effect.
- **Impact**: Game is unplayable as a TCG without combat.
- **Fix Required**: Implement proper combat mechanics with attack declaration and damage resolution.

### 2. Cheating Exploit via Game Log
- **Problem**: Clicking on opponent's face-down cards reveals their name and type in the game log.
- **Impact**: Provides unfair advantage to players.
- **Fix Required**: Prevent revealing hidden information when clicking opponent's cards.

### 3. Tapping/Untapping Logic Flaws
- **Problem**: No visual indication when lands are tapped, inconsistent log feedback, lands may remain tapped across turns.
- **Impact**: Mana system is unreliable.
- **Fix Required**: Add visual tapping indicators, fix untap logic, improve log messages.

### 4. Card Play Failures
- **Problem**: Players cannot play cards even with correct mana available.
- **Impact**: Game becomes boring and unplayable.
- **Fix Required**: Fix mana calculation and card playing logic.

## UI/UX Issues

### 5. Game Log and Phase Indicator Visibility
- **Problem**: Game log and turn/phase indicator are hard to see on PC.
- **Fix Required**: Implement floating, resizable, movable windows for these elements.

### 6. Card Inspection Insufficient
- **Problem**: Clicking cards doesn't show full card details, text is unreadable.
- **Fix Required**: Implement full card expansion with image, rules text, and mana cost.

### 7. Missing Log Feedback
- **Problem**: Game doesn't explain why actions are disallowed.
- **Fix Required**: Add detailed error messages explaining why cards can't be played.

### 8. Missing Draw Notifications
- **Problem**: No notification when system automatically draws cards.
- **Fix Required**: Add clear notifications for automatic actions.

## Gameplay Logic Issues

### 9. Mana Cost Notation Confusion
- **Problem**: "1W" notation is unclear - should mean 1 generic + 1 white mana.
- **Fix Required**: Clarify mana cost display and calculation.

### 10. Phase Violation
- **Problem**: Cards can be played in wrong phases (e.g., creatures in draw phase).
- **Fix Required**: Enforce proper phase restrictions.

### 11. Card Abilities Non-Functional
- **Problem**: Instant/artifact abilities don't work, no feedback when activated.
- **Fix Required**: Implement card ability system.

### 12. Missing Card Options
- **Problem**: Cards on battlefield need clear interaction options.
- **Fix Required**: Add buttons for "Tap for Mana", "Declare as Attacker", "Activate Ability".

## Technical Issues

### 13. Title Persistence Bug
- **Problem**: Changes to game title don't save.
- **Fix Required**: Fix title saving mechanism.

### 14. Deck Management Issues
- **Problem**: Pre-constructed decks don't indicate if incomplete/invalid.
- **Fix Required**: Add deck validation indicators.

### 15. Hand Management
- **Problem**: Players can't rearrange cards in hand.
- **Fix Required**: Add drag-and-drop card reordering.

## Priority Order
1. Combat Phase (Critical)
2. Cheating Exploit (Critical) 
3. Tapping/Untapping Logic (Critical)
4. Card Play Failures (High)
5. UI Visibility Issues (High)
6. All other issues (Medium)

