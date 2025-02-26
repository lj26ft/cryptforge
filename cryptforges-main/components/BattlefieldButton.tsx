import { Button } from "@/components/ui/button"
import { Swords } from "lucide-react"
import Link from "next/link"

export function BattlefieldButton() {
  return (
    <Link href="/battlefield" passHref>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Swords className="mr-2 h-4 w-4" />
        Battlefield
      </Button>
    </Link>
  )
}

