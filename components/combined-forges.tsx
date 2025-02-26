"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import CryptForge from "./crypt-forge"

interface Forge {
  faction: string
  title: string
}

const forges: Forge[] = [
  { faction: "Angelic", title: "Angelic Sepulcher" },
  { faction: "Human", title: "Human Forge" },
  { faction: "Demonic", title: "Demonic Crypt" },
]

export default function CombinedForges() {
  const [currentForgeIndex, setCurrentForgeIndex] = useState(0)

  const nextForge = () => {
    setCurrentForgeIndex((prevIndex) => (prevIndex + 1) % forges.length)
  }

  const prevForge = () => {
    setCurrentForgeIndex((prevIndex) => (prevIndex - 1 + forges.length) % forges.length)
  }

  const currentForge = forges[currentForgeIndex]

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button variant="outline" size="icon" onClick={prevForge}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button variant="outline" size="icon" onClick={nextForge}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <CryptForge key={currentForge.faction} faction={currentForge.faction} title={currentForge.title} />
    </div>
  )
}

