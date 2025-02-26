import type { NFT } from "./types"

export function fuseNFTs(nft1: NFT, nft2: NFT): NFT {
  const newRarity = calculateNewRarity(nft1.rarity, nft2.rarity)
  const newPower = Math.floor((nft1.power + nft2.power) * 1.2) // 20% power boost

  return {
    id: generateNFTId(),
    name: `Fused ${nft1.name}`,
    faction: nft1.faction,
    category: nft1.category,
    rarity: newRarity,
    power: newPower,
    ability: combineAbilities(nft1.ability, nft2.ability),
    image: generateFusedImage(nft1.image, nft2.image),
    level: Math.max(nft1.level, nft2.level),
    experience: 0,
  }
}

function calculateNewRarity(rarity1: NFT["rarity"], rarity2: NFT["rarity"]): NFT["rarity"] {
  const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
  const highestRarityIndex = Math.max(rarityOrder.indexOf(rarity1), rarityOrder.indexOf(rarity2))
  return rarityOrder[Math.min(highestRarityIndex + 1, rarityOrder.length - 1)] as NFT["rarity"]
}

function combineAbilities(ability1: NFT["ability"], ability2: NFT["ability"]): NFT["ability"] {
  // Implement logic to combine or choose the best ability
  return ability1 // Placeholder
}

function generateFusedImage(image1: string, image2: string): string {
  // Implement logic to generate a new image for the fused NFT
  return image1 // Placeholder
}

function generateNFTId(): string {
  return Math.random().toString(36).substr(2, 9)
}

