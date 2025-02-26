"use client"

import { useState, useEffect } from "react"
import type { NFT, GameState, Player } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { initializeBattle, playCard, passTurn } from "@/lib/battle-system"
import { useToast } from "@/components/ui/use-toast"

interface BattlefieldProps {
  player: Player
  opponent: Player
}

export function Battlefield({ player, opponent }: BattlefieldProps) {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const initialState = initializeBattle(player, opponent)
    setGameState(initialState)
  }, [player, opponent])

  const handlePlayCard = (cardId: string, row: "front" | "back") => {
    if (!gameState) return

    const updatedState = playCard(gameState, player.id, cardId, row)
    setGameState(updatedState)

    if (updatedState.currentPlayer !== player.id) {
      // Simulate opponent's turn
      setTimeout(() => {
        const opponentMove = simulateOpponentMove(updatedState)
        setGameState(opponentMove)
      }, 1000)
    }
  }

  const handlePassTurn = () => {
    if (!gameState) return

    const updatedState = passTurn(gameState, player.id)
    setGameState(updatedState)

    if (updatedState.gameOver) {
      const winner =
        updatedState.players[player.id].roundsWon > updatedState.players[opponent.id].roundsWon
          ? player.username
          : opponent.username
      toast({
        title: "Game Over",
        description: `${winner} wins the game!`,
      })
    } else if (updatedState.currentPlayer !== player.id) {
      // Simulate opponent's turn
      setTimeout(() => {
        const opponentMove = simulateOpponentMove(updatedState)
        setGameState(opponentMove)
      }, 1000)
    }
  }

  const simulateOpponentMove = (state: GameState): GameState => {
    // Simple AI: play a random card or pass
    const opponentHand = state.players[opponent.id].hand
    if (opponentHand.length > 0 && Math.random() > 0.3) {
      const randomCard = opponentHand[Math.floor(Math.random() * opponentHand.length)]
      const row = randomCard.category === "Character" ? "front" : "back"
      return playCard(state, opponent.id, randomCard.id, row)
    } else {
      return passTurn(state, opponent.id)
    }
  }

  if (!gameState) {
    return <div>Loading...</div>
  }

  return (
    <div className="battlefield">
      <div className="opponent-field">
        <FieldRow cards={gameState.players[opponent.id].field.back} isOpponent />
        <FieldRow cards={gameState.players[opponent.id].field.front} isOpponent />
      </div>
      <div className="player-field">
        <FieldRow cards={gameState.players[player.id].field.front} />
        <FieldRow cards={gameState.players[player.id].field.back} />
      </div>
      <div className="player-hand">
        {gameState.players[player.id].hand.map((card) => (
          <Card
            key={card.id}
            className="nft-card"
            onClick={() => handlePlayCard(card.id, card.category === "Character" ? "front" : "back")}
          >
            <img src={card.image || "/placeholder.svg"} alt={card.name} className="w-full h-32 object-cover" />
            <div className="p-2">
              <h3 className="text-sm font-bold">{card.name}</h3>
              <p className="text-xs">Power: {card.power}</p>
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={handlePassTurn} disabled={gameState.currentPlayer !== player.id}>
        Pass Turn
      </Button>
    </div>
  )
}

interface FieldRowProps {
  cards: NFT[]
  isOpponent?: boolean
}

function FieldRow({ cards, isOpponent }: FieldRowProps) {
  return (
    <div className="field-row">
      {cards.map((card) => (
        <Card key={card.id} className={`nft-card ${isOpponent ? "opponent" : ""}`}>
          <img src={card.image || "/placeholder.svg"} alt={card.name} className="w-full h-24 object-cover" />
          <div className="p-2">
            <h3 className="text-xs font-bold">{card.name}</h3>
            <p className="text-xs">Power: {card.power}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

