"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export function XummTest() {
  const [address, setAddress] = useState<string | null>(null)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [kycStatus, setKycStatus] = useState<any>(null)
  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [txInfo, setTxInfo] = useState<any>(null)
  const [txHash, setTxHash] = useState("")
  const [paymentDestination, setPaymentDestination] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentCurrency, setPaymentCurrency] = useState("XRP")
  const { toast } = useToast()

  const handleSignIn = async () => {
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
          setAddress(payloadStatus.response.account)
          setUserToken(payloadStatus.application.issued_user_token)
          toast({
            title: "Successfully connected",
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
      console.error("Error during XUMM sign-in:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect with XUMM. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const getKycStatus = async () => {
    if (!userToken) {
      toast({
        title: "Error",
        description: "User token not available. Please sign in first.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/xumm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getKycStatus", userToken }),
      })
      const { kycStatus } = await response.json()
      setKycStatus(kycStatus)
    } catch (error) {
      console.error("Error fetching KYC status:", error)
      toast({
        title: "Error",
        description: "Failed to fetch KYC status.",
        variant: "destructive",
      })
    }
  }

  const getAccountInfo = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Address not available. Please sign in first.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/xumm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getXrplAccount", account: address }),
      })
      const { accountInfo } = await response.json()
      setAccountInfo(accountInfo)
    } catch (error) {
      console.error("Error fetching account info:", error)
      toast({
        title: "Error",
        description: "Failed to fetch account information.",
        variant: "destructive",
      })
    }
  }

  const getTransactionInfo = async () => {
    if (!txHash) {
      toast({
        title: "Error",
        description: "Please enter a transaction hash.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/xumm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getXrplTransaction", txHash }),
      })
      const { txInfo } = await response.json()
      setTxInfo(txInfo)
    } catch (error) {
      console.error("Error fetching transaction info:", error)
      toast({
        title: "Error",
        description: "Failed to fetch transaction information.",
        variant: "destructive",
      })
    }
  }

  const createPayment = async () => {
    if (!address || !paymentDestination || !paymentAmount || !paymentCurrency) {
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
          currency: paymentCurrency,
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
    <div className="p-4 border rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-semibold mb-4">XUMM SDK Test</h2>
      {address ? (
        <p className="mb-4">Connected Address: {address}</p>
      ) : (
        <Button onClick={handleSignIn} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect with XUMM"}
        </Button>
      )}

      {address && (
        <>
          <Button onClick={getKycStatus}>Get KYC Status</Button>
          {kycStatus && (
            <div>
              <h3>KYC Status:</h3>
              <pre>{JSON.stringify(kycStatus, null, 2)}</pre>
            </div>
          )}

          <Button onClick={getAccountInfo}>Get Account Info</Button>
          {accountInfo && (
            <div>
              <h3>Account Info:</h3>
              <pre>{JSON.stringify(accountInfo, null, 2)}</pre>
            </div>
          )}

          <div>
            <Input placeholder="Transaction Hash" value={txHash} onChange={(e) => setTxHash(e.target.value)} />
            <Button onClick={getTransactionInfo}>Get Transaction Info</Button>
          </div>
          {txInfo && (
            <div>
              <h3>Transaction Info:</h3>
              <pre>{JSON.stringify(txInfo, null, 2)}</pre>
            </div>
          )}

          <div>
            <Input
              placeholder="Destination Address"
              value={paymentDestination}
              onChange={(e) => setPaymentDestination(e.target.value)}
            />
            <Input placeholder="Amount" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            <Input
              placeholder="Currency (default: XRP)"
              value={paymentCurrency}
              onChange={(e) => setPaymentCurrency(e.target.value)}
            />
            <Button onClick={createPayment}>Create Payment</Button>
          </div>
        </>
      )}
    </div>
  )
}

