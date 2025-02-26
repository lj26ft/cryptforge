import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { Redis } from "@upstash/redis"
import { generateImagePrompt } from "@/lib/prompt-generator"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const redis = Redis.fromEnv()

export async function POST(request: NextRequest) {
  const { faction, category, rarity, customization } = await request.json()

  // Generate the prompt
  const prompt = generateImagePrompt(
    faction as "Angelic" | "Human" | "Demonic",
    category as "Character" | "Item" | "Support",
    rarity as "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary",
    customization,
  )

  // Check cache first
  const cachedImage = await redis.get(`image:${prompt}`)
  if (cachedImage) {
    return NextResponse.json({ imageUri: cachedImage })
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    })

    const imageUri = response.data[0].url

    // Cache the result
    await redis.set(`image:${prompt}`, imageUri, { ex: 3600 }) // Cache for 1 hour

    return NextResponse.json({ imageUri })
  } catch (error) {
    console.error("Error generating image:", error)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}

