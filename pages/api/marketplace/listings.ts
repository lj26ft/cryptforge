import type { NextApiRequest, NextApiResponse } from "next"

// Mock data
const mockListings = [
  {
    id: "1",
    nftId: "1",
    price: 100,
    sellerId: "seller1",
    nft: { id: "1", name: "NFT 1", image: "https://example.com/nft1.jpg" },
    seller: { id: "seller1", username: "Seller One" },
  },
  {
    id: "2",
    nftId: "2",
    price: 200,
    sellerId: "seller2",
    nft: { id: "2", name: "NFT 2", image: "https://example.com/nft2.jpg" },
    seller: { id: "seller2", username: "Seller Two" },
  },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    res.status(200).json(mockListings)
  } catch (error) {
    console.error("Error fetching marketplace listings:", error)
    res.status(500).json({ message: "Error fetching marketplace listings" })
  }
}

