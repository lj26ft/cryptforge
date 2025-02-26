"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { GameBoard } from "@/components/GameBoard"
import { Button } from "@/components/ui/button"
import { useXumm } from "@/lib/xumm-hook"
import type { NFT } from "@/lib/types"
import { Card } from "@/components/Card" // Import the Card component

export default function GamePage() {
  const router = useRouter()
  const { gameId } = router.query
  const { account } = useXumm()
  const [gameState, setGameState] = useState<any>(null)

  useEffect(() => {
    if (gameId) {
      fetchGameState()
    }
  }, [gameId])

  const fetchGameState = async () => {
    const response = await fetch(`/api/game/${gameId}`)
    const data = await response.json()
    setGameState(data.gameState)
  }

  const playCard = async (nft: NFT, row: "front" | "back") => {
    const response = await fetch(`/api/game/${gameId}/play-card`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: account, nftId: nft.id, row }),
    })
    const data = await response.json()
    setGameState(data.gameState)

    if (data.gameStatus.isOver) {
      alert(`Game Over! Winner: ${data.gameStatus.winner}`)
      router.push("/dashboard")
    }
  }

  const endTurn = async () => {
    const response = await fetch(`/api/game/${gameId}/end-turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: account }),
    })
    const data = await response.json()
    setGameState(data.gameState)
  }

  if (!gameState) {
    return <div>Loading...</div>
  }

  return (
    <div className="game-page">
      <h1>Game {gameId}</h1>
      <GameBoard
        playerField={gameState.players[account].field}
        opponentField={
          gameState.players[
            gameState.currentPlayer === account
              ? Object.keys(gameState.players).find((id) => id !== account)!
              : gameState.currentPlayer
          ].field
        }
        onPlayCard={playCard}
      />
      <div className="player-hand">
        {gameState.players[account].hand.map((nft: NFT) => (
          <Card key={nft.id} className="nft-card" onClick={() => playCard(nft, "back")}>
            <img src={nft.image || "/placeholder.svg"} alt={nft.name} />
            <div className="nft-info">
              <h3>{nft.name}</h3>
              <p>Power: {nft.power}</p>
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={endTurn} disabled={gameState.currentPlayer !== account}>
        End Turn
      </Button>
    </div>
  )
}

