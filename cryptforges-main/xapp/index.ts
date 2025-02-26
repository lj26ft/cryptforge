import { XummSdk } from "xumm-sdk"
import type { Player, NFT, Deck } from "@/lib/types"

const xumm = new XummSdk(process.env.XUMM_API_KEY!, process.env.XUMM_API_SECRET!)

export async function getPlayerInfo(xrpAddress: string): Promise<Player> {
  // Fetch player info from your backend
  const response = await fetch(`/api/player/${xrpAddress}`)
  return response.json()
}

export async function getDeckList(playerId: string): Promise<Deck[]> {
  // Fetch deck list from your backend
  const response = await fetch(`/api/decks/${playerId}`)
  return response.json()
}

export async function getNFTCollection(playerId: string): Promise<NFT[]> {
  // Fetch NFT collection from your backend
  const response = await fetch(`/api/nfts/${playerId}`)
  return response.json()
}

export async function signInWithXumm(): Promise<string> {
  const request = await xumm.payload.create({
    TransactionType: "SignIn",
  })

  // Open the XUMM app for signing
  const result = await xumm.payload.subscribe(request.uuid)

  if (result.signed) {
    return result.account!
  } else {
    throw new Error("Sign-in cancelled")
  }
}

export async function purchaseNFT(nftId: string, price: number): Promise<boolean> {
  const request = await xumm.payload.create({
    TransactionType: "Payment",
    Destination: process.env.MARKETPLACE_ADDRESS,
    Amount: String(price),
    Memos: [
      {
        Memo: {
          MemoType: "text/plain",
          MemoData: Buffer.from(`Purchase NFT: ${nftId}`).toString("hex"),
        },
      },
    ],
  })

  // Open the XUMM app for signing
  const result = await xumm.payload.subscribe(request.uuid)

  return result.signed === true
}

