"use client"

import { useState } from "react"
import { useXumm } from "@/lib/xumm-hook"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function WalletConnect() {
  const { account, login, logout } = useXumm()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await login()
      toast({
        title: "Wallet Connected",
        description: "Your XUMM wallet has been successfully connected.",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Connection Failed",
        description: "There was an error connecting your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Wallet Disconnected",
      description: "Your XUMM wallet has been disconnected.",
    })
  }

  return (
    <div>
      {account ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium truncate max-w-[150px]">{account}</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Disconnect
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  )
}

