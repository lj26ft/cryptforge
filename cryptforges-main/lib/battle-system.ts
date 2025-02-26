import type { NFT, Player, GameState } from "./types"

export function initializeBattle(player1: Player, player2: Player): GameState {
  return {
    players: {
      [player1.id]: {
        deck: shuffleDeck([...player1.selectedDeck]),
        hand: [],
        field: { front: [], back: [] },
        graveyard: [],
        leader: player1.selectedLeader,
        roundsWon: 0,
      },
      [player2.id]: {
        deck: shuffleDeck([...player2.selectedDeck]),
        hand: [],
        field: { front: [], back: [] },
        graveyard: [],
        leader: player2.selectedLeader,
        roundsWon: 0,
      },
    },
    currentPlayer: player1.id,
    round: 1,
    turn: 1,
    passed: { [player1.id]: false, [player2.id]: false },
  }
}

export function playCard(gameState: GameState, playerId: string, cardId: string, row: "front" | "back"): GameState {
  const player = gameState.players[playerId]
  const cardIndex = player.hand.findIndex((card) => card.id === cardId)
  if (cardIndex === -1) return gameState

  const [card] = player.hand.splice(cardIndex, 1)
  player.field[row].push(card)

  return {
    ...gameState,
    players: {
      ...gameState.players,
      [playerId]: player,
    },
    currentPlayer: Object.keys(gameState.players).find((id) => id !== playerId)!,
    turn: gameState.turn + 1,
  }
}

export function passTurn(gameState: GameState, playerId: string): GameState {
  const updatedGameState = {
    ...gameState,
    passed: { ...gameState.passed, [playerId]: true },
  }

  if (Object.values(updatedGameState.passed).every((passed) => passed)) {
    return endRound(updatedGameState)
  }

  return {
    ...updatedGameState,
    currentPlayer: Object.keys(gameState.players).find((id) => id !== playerId)!,
    turn: gameState.turn + 1,
  }
}

function endRound(gameState: GameState): GameState {
  const scores = calculateScores(gameState)
  const roundWinner = scores[0].score > scores[1].score ? scores[0].playerId : scores[1].playerId

  const updatedPlayers = Object.entries(gameState.players).reduce((acc, [playerId, playerState]) => {
    return {
      ...acc,
      [playerId]: {
        ...playerState,
        roundsWon: playerId === roundWinner ? playerState.roundsWon + 1 : playerState.roundsWon,
        field: { front: [], back: [] },
        graveyard: [...playerState.graveyard, ...playerState.field.front, ...playerState.field.back],
      },
    }
  }, {})

  const newRound = gameState.round + 1
  const gameOver = Object.values(updatedPlayers).some((player) => player.roundsWon === 2) || newRound > 3

  return {
    ...gameState,
    players: updatedPlayers,
    round: newRound,
    turn: 1,
    passed: Object.keys(gameState.players).reduce((acc, playerId) => ({ ...acc, [playerId]: false }), {}),
    currentPlayer: roundWinner,
    gameOver,
  }
}

function calculateScores(gameState: GameState): { playerId: string; score: number }[] {
  return Object.entries(gameState.players).map(([playerId, playerState]) => ({
    playerId,
    score: [...playerState.field.front, ...playerState.field.back].reduce((total, card) => total + card.power, 0),
  }))
}

function shuffleDeck(deck: NFT[]): NFT[] {
  return deck.sort(() => Math.random() - 0.5)
}

