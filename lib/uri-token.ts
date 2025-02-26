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
  try {
    const payload = await sdk.payload.create({
      txjson: {
        TransactionType: "URITokenMint",
        Account: account,
        URI: ipfsCid,
        Flags: 8, // tfTransferable flag
        TokenTaxon: 0, // Optional: you can use this for categorization
      },
      options: {
        return_url: {
          app: "https://cryptforges.app/xumm-callback",
          web: "https://cryptforges.app/xumm-callback",
        },
      },
    })

    // Open XUMM app for signing
    window.open(payload.next.always, "_blank")

    const result = await sdk.payload.createAndSubscribe(payload, (event) => {
      if (event.data.signed === true) {
        return event.data
      }
      if (event.data.signed === false) {
        throw new Error("User rejected the sign request")
      }
    })

    if (result.signed) {
      return { success: true, txid: result.txid }
    } else {
      throw new Error("Transaction was not signed")
    }
  } catch (error) {
    console.error("Error minting URI token:", error)
    throw error
  }
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

    if (result.success) {
      console.log("Transaction signed and submitted. URIToken minted!")
      return { success: true, imageUrl, ipfsCid, nftId: result.txid }
    } else {
      throw new Error("Failed to mint URIToken")
    }
  } catch (error) {
    console.error("Error:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

