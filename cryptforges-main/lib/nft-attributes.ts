import type { NFT, GameState } from "./types"

export function applyNFTAttributes(gameState: GameState, nft: NFT, playerId: string): GameState {
  let updatedGameState = { ...gameState }

  // Apply faction-specific effects
  if (nft.faction === "Angelic") {
    updatedGameState = applyAngelicEffect(updatedGameState, playerId)
  } else if (nft.faction === "Demonic") {
    updatedGameState = applyDemonicEffect(updatedGameState, playerId)
  }

  // Apply rarity-based power boost
  const rarityBoost = getRarityBoost(nft.rarity)
  updatedGameState.players[playerId].field.front = updatedGameState.players[playerId].field.front.map((card) =>
    card.id === nft.id ? { ...card, power: card.power + rarityBoost } : card,
  )
  updatedGameState.players[playerId].field.back = updatedGameState.players[playerId].field.back.map((card) =>
    card.id === nft.id ? { ...card, power: card.power + rarityBoost } : card,
  )

  return updatedGameState
}

function applyAngelicEffect(gameState: GameState, playerId: string): GameState {
  // Buff Human cards on the player's side
  const updatedPlayer = {
    ...gameState.players[playerId],
    field: {
      front: gameState.players[playerId].field.front.map((card) =>
        card.faction === "Human" ? { ...card, power: card.power + 1 } : card,
      ),
      back: gameState.players[playerId].field.back.map((card) =>
        card.faction === "Human" ? { ...card, power: card.power + 1 } : card,
      ),
    },
  }

  return {
    ...gameState,
    players: {
      ...gameState.players,
      [playerId]: updatedPlayer,
    },
  }
}

function applyDemonicEffect(gameState: GameState, playerId: string): GameState {
  // Debuff Human cards on the opponent's side
  const opponentId = Object.keys(gameState.players).find((id) => id !== playerId)!
  const updatedOpponent = {
    ...gameState.players[opponentId],
    field: {
      front: gameState.players[opponentId].field.front.map((card) =>
        card.faction === "Human" ? { ...card, power: Math.max(0, card.power - 1) } : card,
      ),
      back: gameState.players[opponentId].field.back.map((card) =>
        card.faction === "Human" ? { ...card, power: Math.max(0, card.power - 1) } : card,
      ),
    },
  }

  return {
    ...gameState,
    players: {
      ...gameState.players,
      [opponentId]: updatedOpponent,
    },
  }
}

function getRarityBoost(rarity: NFT["rarity"]): number {
  switch (rarity) {
    case "Common":
      return 0
    case "Uncommon":
      return 1
    case "Rare":
      return 2
    case "Epic":
      return 3
    case "Legendary":
      return 5
    default:
      return 0
  }
}

