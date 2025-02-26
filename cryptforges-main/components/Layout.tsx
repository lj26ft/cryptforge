import type React from "react"
import { ConnectWallet } from "./ConnectWallet"
import { NFTMarketplaceButton } from "./NFTMarketplaceButton"
import { BattlefieldButton } from "./BattlefieldButton"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CryptForges</h1>
          <nav className="flex gap-4">
            <NFTMarketplaceButton />
            <BattlefieldButton />
            <ConnectWallet />
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

