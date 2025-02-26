import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { NFT } from "@/lib/types"
import { checkEvolutionEligibility, evolveNFT } from "@/lib/nft-evolution"
import getEvolvedImage from "@/lib/getEvolvedImage" // Import the function

interface NFTEvolutionModalProps {
  nft: NFT
  isOpen: boolean
  onClose: () => void
  onEvolve: (evolvedNFT: NFT) => void
}

export function NFTEvolutionModal({ nft, isOpen, onClose, onEvolve }: NFTEvolutionModalProps) {
  const canEvolve = checkEvolutionEligibility(nft)

  const handleEvolve = () => {
    const evolvedNFT = evolveNFT(nft)
    onEvolve(evolvedNFT)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Evolve {nft.name}</DialogTitle>
          <DialogDescription>
            Evolving your NFT will increase its power and potentially unlock new abilities.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-32 h-32 object-cover rounded" />
            <p>Current Power: {nft.power}</p>
          </div>
          <div className="text-2xl">→</div>
          <div>
            <img
              src={getEvolvedImage(nft) || "/placeholder.svg"}
              alt={`Evolved ${nft.name}`}
              className="w-32 h-32 object-cover rounded"
            />
            <p>New Power: {Math.floor(nft.power * 1.5)}</p>
          </div>
        </div>
        <Button onClick={handleEvolve} disabled={!canEvolve}>
          {canEvolve ? "Evolve NFT" : "Not Eligible for Evolution"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

