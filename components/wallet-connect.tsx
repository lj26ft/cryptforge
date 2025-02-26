"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useXumm } from "@/lib/xumm-hook"

export default function WalletConnect() {
  const { account, login, logout, error } = useXumm()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentDestination, setPaymentDestination] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await login()
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

  const handlePayment = async () => {
    // Implementation of payment function (unchanged)
  }

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    })
  }

  return (
    <div>
      {account ? (
        <div className="flex flex-col items-start space-y-2">
          <span className="text-sm font-medium truncate max-w-[150px]">{account}</span>
          <Input
            placeholder="Destination Address"
            value={paymentDestination}
            onChange={(e) => setPaymentDestination(e.target.value)}
          />
          <Input placeholder="Amount (XRP)" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
          <Button variant="outline" size="sm" onClick={handlePayment}>
            Send Payment
          </Button>
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

