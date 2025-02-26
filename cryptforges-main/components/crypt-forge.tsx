"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useXumm } from "@/lib/xumm-hook"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import ImageGenerator from "./image-generator"
import NFTTrade from "./nft-trade"
import { createAndMintURIToken } from "@/lib/uri-token"

const categories = ["Character", "Support", "Item"]
const rarities = [
  { name: "Common", chance: 50 },
  { name: "Uncommon", chance: 30 },
  { name: "Rare", chance: 15 },
  { name: "Epic", chance: 4 },
  { name: "Legendary", chance: 1 },
]

const BASE_PRICE = 1 // XRP
const MAX_PRICE = 30 // XRP
const PRICE_PER_DETAIL = 0.5 // XRP
const ROYALTY_PERCENTAGE = 2.5 // 2.5% royalty

interface CryptForgeProps {
  faction: string
  title: string
}

export default function CryptForge({ faction, title }: CryptForgeProps) {
  const [category, setCategory] = useState("")
  const [rarity, setRarity] = useState("")
  const [imageUri, setImageUri] = useState("")
  const [nftId, setNftId] = useState<string | null>(null)
  const [customDetails, setCustomDetails] = useState("")
  const [price, setPrice] = useState(BASE_PRICE)
  const [isForging, setIsForging] = useState(false)
  const [isBurning, setIsBurning] = useState(false)
  const { account, sdk } = useXumm()

  useEffect(() => {
    const detailCount = customDetails.split(",").filter((detail) => detail.trim() !== "").length
    const calculatedPrice = Math.min(BASE_PRICE + detailCount * PRICE_PER_DETAIL, MAX_PRICE)
    setPrice(calculatedPrice)
  }, [customDetails])

  const handleImageGenerated = (uri: string) => {
    setImageUri(uri)
  }

  const handleCustomizationChange = (customization: string) => {
    setCustomDetails(customization)
  }

  const determineRarity = () => {
    const detailCount = customDetails.split(",").filter((detail) => detail.trim() !== "").length
    const rarityChanceReduction = Math.min(detailCount * 0.1, 5) // 0.1% reduction per detail, max 5%

    const adjustedRarities = rarities.map((rarity) => ({
      ...rarity,
      chance: Math.max(rarity.chance - (rarity.chance * rarityChanceReduction) / 100, 0),
    }))

    const rand = Math.random() * 100
    let cumulativeChance = 0
    for (const r of adjustedRarities) {
      cumulativeChance += r.chance
      if (rand <= cumulativeChance) {
        return r.name
      }
    }
    return "Common" // Fallback
  }

  const calculateRoyalty = (amount: number) => {
    return (amount * ROYALTY_PERCENTAGE) / 100
  }

  const forgeNFTPayload = async () => {
    if (!account || !sdk) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your XUMM wallet to forge an NFT.",
        variant: "destructive",
      })
      return
    }

    setIsForging(true)
    try {
      const determinedRarity = determineRarity()
      const result = await createAndMintURIToken(faction, category, determinedRarity, customDetails, account, sdk)

      if (result.success) {
        setNftId(result.nftId!)
        setRarity(determinedRarity)
        setImageUri(result.imageUrl!)
        toast({
          title: "NFT Forged Successfully",
          description: `Your ${determinedRarity} ${faction} ${category} NFT has been minted.`,
        })
      } else {
        toast({
          title: "Forging Failed",
          description: "There was an error minting your NFT. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error forging NFT:", error)
      toast({
        title: "Forging Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsForging(false)
    }
  }

  const burnNFT = async () => {
    if (!account || !sdk || !imageUri) {
      toast({
        title: "Cannot Burn NFT",
        description: "Please ensure your wallet is connected and an NFT is selected.",
        variant: "destructive",
      })
      return
    }

    setIsBurning(true)
    try {
      const payload = await sdk.payload.create({
        txjson: {
          TransactionType: "URITokenBurn",
          Account: account,
          URI: imageUri,
        },
      })

      const result = await sdk.payload.createAndSubscribe(payload, (event) => {
        if (event.data.signed === true) {
          return true
        }
        return false
      })

      if (result.signed) {
        setNftId(null)
        setImageUri("")
        setRarity("")
        toast({
          title: "NFT Burned Successfully",
          description: "Your NFT has been burned and removed from the blockchain.",
        })
      } else {
        toast({
          title: "Burning Cancelled",
          description: "The NFT burning transaction was not signed.",
        })
      }
    } catch (error) {
      console.error("Error burning NFT:", error)
      toast({
        title: "Burning Error",
        description: "An unexpected error occurred while burning the NFT. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsBurning(false)
    }
  }

  const handleTrade = (tradeAmount: number) => {
    console.log(`NFT ${nftId} traded for ${tradeAmount} XRP`)
    // In a real implementation, you would update the NFT ownership here
  }

  return (
    <Card className="w-full max-w-md mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Select onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ImageGenerator
            faction={faction}
            category={category}
            rarity={rarity || "Common"}
            onImageGenerated={handleImageGenerated}
            onCustomizationChange={handleCustomizationChange}
          />
        </div>

        <div className="relative aspect-square w-full">
          {imageUri ? (
            <Image
              src={imageUri || "/placeholder.svg"}
              alt="Generated NFT"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center bg-muted rounded-lg cursor-pointer"
              onClick={() => {
                const pastedUri = prompt("Paste NFT URI to burn or preview:")
                if (pastedUri) {
                  setImageUri(pastedUri)
                }
              }}
            >
              <p className="text-muted-foreground">Click to paste URI or generate an image</p>
            </div>
          )}
        </div>

        {rarity && <p className="text-center font-semibold">Rarity: {rarity}</p>}
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm font-semibold">Price: {price.toFixed(2)} XRP</p>
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={forgeNFTPayload}
            disabled={!category || !account || !imageUri || nftId !== null || isForging}
          >
            {isForging ? "Forging..." : "Forge NFT"}
          </Button>
          <Button size="sm" onClick={burnNFT} disabled={!account || !imageUri || isBurning}>
            {isBurning ? "Burning..." : "Burn NFT"}
          </Button>
        </div>
        {nftId && <NFTTrade nftId={nftId} onTrade={handleTrade} />}
      </CardFooter>
    </Card>
  )
}

