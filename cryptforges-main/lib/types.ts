export type Faction = "Angelic" | "Demonic" | "Human"

export interface NFT {
  id: string
  name: string
  faction: Faction
  category: "Character" | "Support" | "Item"
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary"
  power: number
  ability: Ability
  image: string
  level: number
  experience: number
}

export interface Ability {
  name: string
  description: string
  effect: (gameState: GameState, playerId: string, targetId?: string) => GameState
}

export interface Player {
  id: string
  username: string
  xrpAddress: string
  ownedNFTs: NFT[]
  decks: Deck[]
  selectedDeck: NFT[]
  selectedLeader: NFT
}

export interface Deck {
  id: string
  name: string
  faction: Faction
  leader: NFT
  cards: NFT[]
}

export interface GameState {
  players: {
    [playerId: string]: {
      deck: NFT[]
      hand: NFT[]
      field: {
        front: NFT[]
        back: NFT[]
      }
      graveyard: NFT[]
      leader: NFT
      roundsWon: number
    }
  }
  currentPlayer: string
  round: number
  turn: number
  passed: { [playerId: string]: boolean }
  gameOver?: boolean
}

