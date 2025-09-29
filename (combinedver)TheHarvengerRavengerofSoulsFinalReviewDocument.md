Players should have the option to 

click and arrange cards in their hand in their preferred order. Pre-constructed decks should have a clear 

indicator if they are incomplete or invalid. 


Export to Sheets
III. Gameplay Logic and Mechanics
Issue	Description and Analysis
Mana Cost Ambiguity 

The notation for mana costs (e.g., "

1W") needs clearer definition and display. The current implementation confuses colorless vs. colored mana requirements. The display should clearly denote the number of generic mana (e.g., '1') and the number of specific colored mana (e.g., 'W'). 

Action Options for Cards 

Cards on the battlefield need clear, visible options for interaction, such as: 

"Tap for Mana," "Declare as Attacker," or "Activate [Special Ability]." 

Phase Violation 

A creature was successfully played during the 

Draw Phase, which is a violation of fundamental TCG rules. 

Ability Usage 

Activating card abilities (Instants/Artifacts) is not functional and gives 

no feedback in the log, even when mana is tapped. 


Export to Sheets
IV. Technical/Administrative Issues

Title Persistence Bug: Changes made to the game's title in the menu do not save or stick. 


Public Access: The 48-hour access limit and expiration timer should be removed, as the game is now publicly accessible. 

Suggested Solutions for Core Issues
1. Mana Cost Notation (Conceptual Fix)
To solve the confusion around 1W (one generic, one white) vs. W (one white, zero generic):

Current (Confusing)	Suggested Visual Display	Magic: The Gathering Equivalent
1W 


1W	One generic mana + One White mana
W 

W	One White mana only
2WW 

2WW	Two generic mana + Two White mana

Export to Sheets
2. The Final Title Display
The requested title is formatted below for the final release.

<span style="color:red; font-family: 'Times New Roman', serif; font-size: 2.5em; font-weight: bold; font-style: italic;">The Harvenger: Ravenger of Souls</span>
3. Professional Bug Report Structure


