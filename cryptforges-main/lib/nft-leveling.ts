import type { NFT } from "./types"

const XP_PER_LEVEL = 100
const MAX_LEVEL = 10

export function gainExperience(nft: NFT, xpGained: number): NFT {
  let updatedNFT = { ...nft, experience: nft.experience + xpGained }

  while (updatedNFT.experience >= XP_PER_LEVEL && updatedNFT.level < MAX_LEVEL) {
    updatedNFT = levelUp(updatedNFT)
  }

  return updatedNFT
}

function levelUp(nft: NFT): NFT {
  return {
    ...nft,
    level: nft.level + 1,
    experience: nft.experience - XP_PER_LEVEL,
    power: Math.floor(nft.power * 1.1), // 10% power increase per level
  }
}

