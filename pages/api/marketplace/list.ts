import type { NextApiRequest, NextApiResponse } from "next"

// Mock data
const mockListings = [
  { id: "1", nftId: "1", price: 100, sellerId: "seller1" },
  { id: "2", nftId: "2", price: 200, sellerId: "seller2" },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { nftId, price, sellerId } = req.body

  try {
    const newListing = {
      id: String(mockListings.length + 1),
      nftId,
      price,
      sellerId,
    }

    mockListings.push(newListing)

    res.status(200).json(newListing)
  } catch (error) {
    console.error("Error listing NFT:", error)
    res.status(500).json({ message: "Error listing NFT" })
  }
}

