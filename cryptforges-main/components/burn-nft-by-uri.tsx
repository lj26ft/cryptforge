"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useXumm } from "@/lib/mock-xumm-sdk"

export default function BurnNFTByURI() {
  const [uriCid, setUriCid] = useState("")
  const [isBurning, setIsBurning] = useState(false)
  const { account, sdk } = useXumm()

  const handleBurn = async () => {
    if (!account || !uriCid) {
      console.error("No account connected or URI CID provided")
      return
    }

    setIsBurning(true)
    try {
      // Create the URITokenBurn payload
      const payload = {
        TransactionType: "URITokenBurn",
        Account: account,
        URI: uriCid,
      }

      // Send payload to XUMM SDK for signing
      const result = await sdk.payload.create(payload)
      console.log("URITokenBurn transaction created. Scan the QR code to sign:", result.next.always)

      // Wait for user to sign the transaction
      const signResult = await result.resolve()
      if (signResult.signed) {
        console.log("Transaction signed and submitted. URIToken burned!")
        setUriCid("")
      } else {
        console.log("Transaction was not signed.")
      }
    } catch (error) {
      console.error("Error burning NFT:", error)
    } finally {
      setIsBurning(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Burn NFT by URI</h3>
      <div className="flex space-x-2">
        <Input placeholder="Paste URI CID here" value={uriCid} onChange={(e) => setUriCid(e.target.value)} />
        <Button onClick={handleBurn} disabled={!account || !uriCid || isBurning}>
          {isBurning ? "Burning..." : "Burn NFT"}
        </Button>
      </div>
    </div>
  )
}

