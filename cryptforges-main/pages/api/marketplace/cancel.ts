import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { nftId, sellerId } = req.body

  try {
    const cancelledListing = await prisma.marketplaceListing.delete({
      where: {
        nftId_sellerId: {
          nftId,
          sellerId,
        },
      },
    })

    res.status(200).json({ message: "Listing cancelled successfully", listing: cancelledListing })
  } catch (error) {
    console.error("Error cancelling listing:", error)
    res.status(500).json({ message: "Error cancelling listing" })
  }
}

