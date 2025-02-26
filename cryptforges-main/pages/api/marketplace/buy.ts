import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { nftId, buyerId } = req.body

  try {
    // Remove the listing and update NFT ownership
    const [removedListing, updatedNFT] = await prisma.$transaction([
      prisma.marketplaceListing.delete({
        where: { nftId },
      }),
      prisma.nFT.update({
        where: { id: nftId },
        data: { ownerId: buyerId },
      }),
    ])

    res.status(200).json({ message: "Purchase successful", nft: updatedNFT })
  } catch (error) {
    console.error("Error completing NFT purchase:", error)
    res.status(500).json({ message: "Error completing NFT purchase" })
  }
}

