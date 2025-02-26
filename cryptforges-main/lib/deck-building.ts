import type { NFT, Deck, Faction } from "./types"

const MAX_DECK_SIZE = 40
const MIN_DECK_SIZE = 25
const MAX_COPIES = 2

export function buildDeck(name: string, faction: Faction, leader: NFT, cards: NFT[]): Deck | { error: string } {
  if (cards.length < MIN_DECK_SIZE || cards.length > MAX_DECK_SIZE) {
    return { error: `Deck must contain between ${MIN_DECK_SIZE} and ${MAX_DECK_SIZE} cards.` }
  }

  if (leader.faction !== faction) {
    return { error: "Leader must be of the same faction as the deck." }
  }

  const cardCounts = cards.reduce(
    (acc, card) => {
      acc[card.id] = (acc[card.id] || 0) + 1
      return acc
    },
    {} as { [key: string]: number },
  )

  const invalidCards = Object.entries(cardCounts).filter(([_, count]) => count > MAX_COPIES)
  if (invalidCards.length > 0) {
    return { error: `You can only have up to ${MAX_COPIES} copies of each card in your deck.` }
  }

  const factionCards = cards.filter((card) => card.faction === faction || card.faction === "Human")
  if (factionCards.length < cards.length * 0.6) {
    return { error: `At least 60% of your deck must be ${faction} or Human faction cards.` }
  }

  return {
    id: generateDeckId(),
    name,
    faction,
    leader,
    cards,
  }
}

function generateDeckId(): string {
  return Math.random().toString(36).substr(2, 9)
}

