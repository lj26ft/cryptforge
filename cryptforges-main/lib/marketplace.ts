import type { NFT, Player } from "./types"
import { purchaseNFT } from "./xumm"

export async function listNFTForSale(nft: NFT, price: number, seller: Player): Promise<boolean> {
  try {
    const response = await fetch("/api/marketplace/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nftId: nft.id, price, sellerId: seller.id }),
    })

    if (!response.ok) {
      throw new Error("Failed to list NFT")
    }

    return true
  } catch (error) {
    console.error("Error listing NFT:", error)
    return false
  }
}

export async function buyNFTFromMarketplace(nftId: string, price: number, buyer: Player): Promise<boolean> {
  try {
    const success = await purchaseNFT(nftId, price)
    if (success) {
      const response = await fetch("/api/marketplace/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nftId, buyerId: buyer.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to complete NFT purchase")
      }

      return true
    }
    return false
  } catch (error) {
    console.error("Error buying NFT:", error)
    return false
  }
}

export async function cancelListing(nftId: string, seller: Player): Promise<boolean> {
  try {
    const response = await fetch("/api/marketplace/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nftId, sellerId: seller.id }),
    })

    if (!response.ok) {
      throw new Error("Failed to cancel listing")
    }

    return true
  } catch (error) {
    console.error("Error cancelling listing:", error)
    return false
  }
}

export async function getMarketListings(): Promise<{ nft: NFT; price: number; seller: string }[]> {
  try {
    const response = await fetch("/api/marketplace/listings")
    if (!response.ok) {
      throw new Error("Failed to fetch marketplace listings")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching marketplace listings:", error)
    return []
  }
}

