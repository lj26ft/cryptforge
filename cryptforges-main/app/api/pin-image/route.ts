import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { imageUri } = await request.json()

  // In a real implementation, this would pin the image to IPFS
  // For now, we'll return a mock IPFS URI
  const ipfsUri = `ipfs://QmMock${Math.random().toString(36).substring(7)}`

  return NextResponse.json({ ipfsUri })
}

