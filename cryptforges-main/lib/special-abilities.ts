import type { GameState, Ability } from "./types"
import { updateCardPower } from "./power-system"

export const specialAbilities: { [key: string]: Ability } = {
  heal: {
    name: "Heal",
    description: "Restore 2 power to a friendly unit",
    effect: (gameState: GameState, playerId: string, targetId?: string) => {
      if (!targetId) return gameState
      return updateCardPower(gameState, targetId, 2)
    },
  },
  damage: {
    name: "Damage",
    description: "Deal 2 damage to an enemy unit",
    effect: (gameState: GameState, playerId: string, targetId?: string) => {
      if (!targetId) return gameState
      return updateCardPower(gameState, targetId, -2)
    },
  },
  boost: {
    name: "Boost",
    description: "Boost a friendly unit by 3",
    effect: (gameState: GameState, playerId: string, targetId?: string) => {
      if (!targetId) return gameState
      return updateCardPower(gameState, targetId, 3)
    },
  },
  // Add more special abilities as needed
}

export function useSpecialAbility(
  gameState: GameState,
  playerId: string,
  cardId: string,
  targetId?: string,
): GameState {
  const playerState = gameState.players[playerId]
  const card = [...playerState.field.front, ...playerState.field.back].find((c) => c.id === cardId)

  if (!card || !card.ability) return gameState

  return card.ability.effect(gameState, playerId, targetId)
}

