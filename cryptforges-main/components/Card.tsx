import type React from "react"
import { CardContent } from "@/components/ui/card"

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      <CardContent>{children}</CardContent>
    </div>
  )
}

