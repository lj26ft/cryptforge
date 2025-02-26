import CombinedForges from "@/components/combined-forges"
import WalletConnect from "@/components/wallet-connect"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="container mx-auto py-10 relative">
      <div className="flex justify-between items-center mb-6 absolute top-4 left-4 right-4">
        <Link href="/marketplace">
          <Button variant="outline">NFT Marketplace</Button>
        </Link>
        <WalletConnect />
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center pt-16">CryptForges</h1>
      <CombinedForges />
    </main>
  )
}

