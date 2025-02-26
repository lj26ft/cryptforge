import CombinedForges from "@/components/combined-forges"
import WalletConnect from "@/components/wallet-connect"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6 relative min-h-screen flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <Link href="/marketplace">
          <Button variant="outline" size="sm">
            NFT Marketplace
          </Button>
        </Link>
        <WalletConnect />
      </header>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">CryptForges</h1>
      <div className="flex-grow">
        <CombinedForges />
      </div>
    </main>
  )
}

