import { generateImagePrompt } from "./prompt-generator"
import type { XummSdk } from "xumm-sdk"

async function generateImage(prompt: string): Promise<string> {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })
  const data = await response.json()
  return data.imageUri
}

async function uploadToIPFS(imageUrl: string): Promise<string> {
  const response = await fetch("/api/pin-to-ipfs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUri: imageUrl }),
  })
  const data = await response.json()
  return data.ipfsUri
}

async function mintURIToken(account: string, ipfsCid: string, sdk: XummSdk) {
  const payload = await sdk.payload.create({
    txjson: {
      TransactionType: "URITokenMint",
      Account: account,
      URI: ipfsCid,
      Flags: 8,
      TokenTaxon: 0,
    },
  })

  const result = await sdk.payload.createAndSubscribe(payload, (event) => {
    if (event.data.signed === true) {
      return true
    }
    return false
  })

  return result
}

export async function createAndMintURIToken(
  faction: string,
  category: string,
  rarity: string,
  customDetails: string,
  account: string,
  sdk: XummSdk,
) {
  try {
    const prompt = generateImagePrompt(
      faction as "Angelic" | "Human" | "Demonic",
      category as "Character" | "Item" | "Support",
      rarity as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary",
      customDetails,
    )
    const imageUrl = await generateImage(prompt)
    console.log("Image generated:", imageUrl)

    const ipfsCid = await uploadToIPFS(imageUrl)
    console.log("Image uploaded to IPFS:", ipfsCid)

    const result = await mintURIToken(account, ipfsCid, sdk)

    if (result.signed) {
      console.log("Transaction signed and submitted. URIToken minted!")
      return { success: true, imageUrl, ipfsCid, nftId: result.txid }
    } else {
      console.log("Transaction was not signed.")
      return { success: false }
    }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, error }
  }
}

