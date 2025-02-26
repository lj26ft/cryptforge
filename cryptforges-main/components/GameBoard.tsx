import type { NFT } from "@/lib/types"
import { Card } from "@/components/ui/card"

interface GameBoardProps {
  playerField: {
    front: NFT[]
    back: NFT[]
  }
  opponentField: {
    front: NFT[]
    back: NFT[]
  }
  onPlayCard: (nft: NFT, row: "front" | "back") => void
}

export function GameBoard({ playerField, opponentField, onPlayCard }: GameBoardProps) {
  return (
    <div className="game-board">
      <div className="opponent-field">
        <Row nfts={opponentField.back} />
        <Row nfts={opponentField.front} />
      </div>
      <div className="player-field">
        <Row nfts={playerField.front} isPlayable onPlayCard={(nft) => onPlayCard(nft, "front")} />
        <Row nfts={playerField.back} isPlayable onPlayCard={(nft) => onPlayCard(nft, "back")} />
      </div>
    </div>
  )
}

interface RowProps {
  nfts: NFT[]
  isPlayable?: boolean
  onPlayCard?: (nft: NFT) => void
}

function Row({ nfts, isPlayable, onPlayCard }: RowProps) {
  return (
    <div className="row">
      {nfts.map((nft) => (
        <Card
          key={nft.id}
          className={`nft-card ${isPlayable ? "playable" : ""}`}
          onClick={() => isPlayable && onPlayCard && onPlayCard(nft)}
        >
          <img src={nft.image || "/placeholder.svg"} alt={nft.name} />
          <div className="nft-info">
            <h3>{nft.name}</h3>
            <p>Power: {nft.power}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

