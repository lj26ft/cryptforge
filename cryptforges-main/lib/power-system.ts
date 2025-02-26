import type { GameState, NFT } from "./types"

export function calculateTotalPower(gameState: GameState, playerId: string): number {
  const playerState = gameState.players[playerId]
  const fieldCards = [...playerState.field.front, ...playerState.field.back]
  return fieldCards.reduce((total, card) => total + card.power, 0)
}

export function updateCardPower(gameState: GameState, cardId: string, powerChange: number): GameState {
  const updatedPlayers = Object.entries(gameState.players).reduce((acc, [playerId, playerState]) => {
    const updateField = (row: NFT[]) =>
      row.map((card) => (card.id === cardId ? { ...card, power: Math.max(0, card.power + powerChange) } : card))

    return {
      ...acc,
      [playerId]: {
        ...playerState,
        field: {
          front: updateField(playerState.field.front),
          back: updateField(playerState.field.back),
        },
      },
    }
  }, {})

  return {
    ...gameState,
    players: updatedPlayers,
  }
}

