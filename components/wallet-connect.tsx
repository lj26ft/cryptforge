"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentDestination, setPaymentDestination] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const createResponse = await fetch("/api/xumm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "createPayload" }),
      })
      const { payload } = await createResponse.json()

      window.open(payload.next.always, "_blank")

      const maxAttempts = 60
      let attempts = 0
      const pollInterval = setInterval(async () => {
        attempts++
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval)
          setIsLoading(false)
          toast({
            title: "Sign-in timeout",
            description: "The sign-in process timed out. Please try again.",
            variant: "destructive",
          })
          return
        }

        const statusResponse = await fetch("/api/xumm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getPayloadStatus", payloadId: payload.uuid }),
        })
        const { payloadStatus } = await statusResponse.json()

        if (payloadStatus.meta.signed) {
          clearInterval(pollInterval)
          setAccount(payloadStatus.response.account)
          toast({
            title: "Wallet Connected",
            description: `Connected to address: ${payloadStatus.response.account}`,
          })
          setIsLoading(false)
        } else if (payloadStatus.meta.expired) {
          clearInterval(pollInterval)
          setIsLoading(false)
          toast({
            title: "Sign-in expired",
            description: "The sign-in request has expired. Please try again.",
            variant: "destructive",
          })
        }
      }, 2000)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Connection Failed",
        description: "There was an error connecting your wallet. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setAccount(null)
    toast({
      title: "Wallet Disconnected",
      description: "Your XUMM wallet has been disconnected.",
    })
  }

  const handlePayment = async () => {
    if (!account || !paymentDestination || !paymentAmount) {
      toast({
        title: "Error",
        description: "Please fill in all payment details.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/xumm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createPayment",
          destination: paymentDestination,
          amount: paymentAmount,
          currency: "XRP",
        }),
      })
      const { paymentPayload } = await response.json()
      window.open(paymentPayload.next.always, "_blank")
      toast({
        title: "Payment Created",
        description: "Please sign the payment in your XUMM app.",
      })
    } catch (error) {
      console.error("Error creating payment:", error)
      toast({
        title: "Error",
        description: "Failed to create payment.",
        variant: "destructive",
      })
    }
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

