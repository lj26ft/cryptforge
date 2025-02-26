import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { nftId, price, sellerId } = req.body

  try {
    const listing = await prisma.marketplaceListing.create({
      data: {
        nftId,
        price,
        sellerId,
      },
    })

    res.status(200).json(listing)
  } catch (error) {
    console.error("Error listing NFT:", error)
    res.status(500).json({ message: "Error listing NFT" })
  }
}

