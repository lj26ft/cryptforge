import { type NextRequest, NextResponse } from "next/server"
import pinataSDK from "@pinata/sdk"

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { imageUri, json } = body

  try {
    let result
    if (imageUri) {
      // Pin image file
      const response = await fetch(imageUri)
      const buffer = await response.arrayBuffer()
      result = await pinata.pinFileToIPFS(buffer, {
        pinataMetadata: { name: "NFT Image" },
      })
    } else if (json) {
      // Pin JSON metadata
      result = await pinata.pinJSONToIPFS(json, {
        pinataMetadata: { name: "NFT Metadata" },
      })
    } else {
      throw new Error("Invalid request: must provide either imageUri or json")
    }

    return NextResponse.json({ ipfsUri: `ipfs://${result.IpfsHash}` })
  } catch (error) {
    console.error("Error pinning to IPFS:", error)
    return NextResponse.error()
  }
}

