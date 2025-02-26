"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useXumm } from "@/lib/xumm-hook"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function XummCallback() {
  const router = useRouter()
  const { sdk, login } = useXumm()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const payloadId = urlParams.get("payloadId")

      if (payloadId && sdk) {
        try {
          const payload = await sdk.payload.get(payloadId)
          if (payload.meta.signed) {
            if (payload.payload.tx_type === "SignIn") {
              await login()
              toast({
                title: "Success",
                description: "You have successfully signed in with XUMM!",
              })
            } else {
              toast({
                title: "Success",
                description: "Transaction signed successfully!",
              })
            }
            // Handle successful sign-in or transaction
            // Update application state as needed
          } else {
            setError("Transaction was not signed.")
            toast({
              title: "Cancelled",
              description: "Transaction was not signed.",
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Error processing XUMM callback:", error)
          setError("Failed to process XUMM callback.")
          toast({
            title: "Error",
            description: "Failed to process XUMM callback.",
            variant: "destructive",
          })
        }
      } else {
        setError("Invalid callback: Missing payload ID.")
      }

      setIsProcessing(false)
    }

    handleCallback()
  }, [sdk, toast, login])

  const handleReturn = () => {
    router.push("/")
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4 text-lg">Processing XUMM callback...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">XUMM Callback</h1>
      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <p className="text-green-500 mb-4">Transaction processed successfully!</p>
      )}
      <Button onClick={handleReturn}>Return to Home</Button>
    </div>
  )
}

