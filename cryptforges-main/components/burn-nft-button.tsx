"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"

interface BurnNFTButtonProps {
  onBurn: () => void
  disabled: boolean
}

export default function BurnNFTButton({ onBurn, disabled }: BurnNFTButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      onBurn()
    }, 1000) // Animation duration
  }

  return (
    <Button size="sm" onClick={handleClick} disabled={disabled || isAnimating} className="relative overflow-hidden">
      Burn
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={isAnimating ? { opacity: 1, scale: 1.5 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 1 }}
      >
        <Heart className="text-red-500 w-4 h-4" fill="currentColor" />
      </motion.div>
    </Button>
  )
}

