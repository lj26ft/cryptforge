"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { InfoCircledIcon } from "@radix-ui/react-icons"

interface ImageGeneratorProps {
  faction: string
  category: string
  rarity: string
  onImageGenerated: (imageUri: string) => void
  onCustomizationChange: (customization: string) => void
}

const detailSuggestions: Record<string, Record<string, string[]>> = {
  Angelic: {
    Character: ["halo type", "wing design", "divine weapon", "celestial armor", "holy symbol"],
    Item: ["divine material", "ethereal glow", "angelic script", "heavenly aura", "blessed runes"],
    Support: ["divine blessing", "holy light", "celestial harmony", "angelic choir", "sacred protection"],
  },
  Human: {
    Character: ["armor style", "weapon choice", "cultural attire", "distinctive feature", "personal emblem"],
    Item: [
      "craftsmanship style",
      "material origin",
      "historical significance",
      "magical enhancement",
      "personal inscription",
    ],
    Support: [
      "tactical advantage",
      "technological innovation",
      "strategic buff",
      "morale boost",
      "resource management",
    ],
  },
  Demonic: {
    Character: ["horn design", "demonic markings", "infernal weapon", "corrupted armor", "unholy symbol"],
    Item: ["infernal material", "soul-bound essence", "demonic script", "corrupting aura", "cursed runes"],
    Support: ["dark blessing", "hellfire manifestation", "chaotic disruption", "soul drain", "infernal pact"],
  },
}

export default function ImageGenerator({
  faction,
  category,
  rarity,
  onImageGenerated,
  onCustomizationChange,
}: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [customization, setCustomization] = useState("")

  const handleCustomizationChange = (value: string) => {
    setCustomization(value)
    onCustomizationChange(value)
  }

  const generateImage = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ faction, category, rarity, customization }),
      })
      const data = await response.json()
      if (data.imageUri) {
        onImageGenerated(data.imageUri)
      } else {
        console.error("Error generating image:", data.error)
      }
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const detailCount = customization.split(",").filter((detail) => detail.trim() !== "").length
  const rarityChanceReduction = Math.min(detailCount * 0.1, 5) // 0.1% reduction per detail, max 5%

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Add custom details (optional)"
          value={customization}
          onChange={(e) => handleCustomizationChange(e.target.value)}
          className="flex-grow"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <InfoCircledIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">
                Custom Detail Suggestions for {faction} {category}:
              </h4>
              <ul className="list-disc pl-4">
                {(faction in detailSuggestions && category in detailSuggestions[faction]
                  ? detailSuggestions[faction][category]
                  : detailSuggestions.Human.Character
                ) // Default to Human Character if faction or category is not set
                  .map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Note: Adding more details slightly reduces the chance of generating higher rarities. Current reduction:{" "}
                {rarityChanceReduction.toFixed(2)}%
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Button onClick={generateImage} disabled={isGenerating || !faction || !category || !rarity} className="w-full">
        {isGenerating ? "Generating..." : "Generate Image"}
      </Button>
    </div>
  )
}

