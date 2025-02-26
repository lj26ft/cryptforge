import type { NextApiRequest, NextApiResponse } from "next"

// Mock data
const mockNFTs = [
  { id: "1", name: "NFT 1", ownerId: "seller1" },
  { id: "2", name: "NFT 2", ownerId: "seller2" },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { nftId, buyerId } = req.body

  try {
    // Find the NFT and update its ownership
    const nftIndex = mockNFTs.findIndex((nft) => nft.id === nftId)
    if (nftIndex === -1) {
      return res.status(404).json({ message: "NFT not found" })
    }

    mockNFTs[nftIndex] = { ...mockNFTs[nftIndex], ownerId: buyerId }

    res.status(200).json({ message: "Purchase successful", nft: mockNFTs[nftIndex] })
  } catch (error) {
    console.error("Error completing NFT purchase:", error)
    res.status(500).json({ message: "Error completing NFT purchase" })
  }
}

