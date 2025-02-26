"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ROYALTY_PERCENTAGE = 2.5 // 2.5% royalty

interface NFTTradeProps {
  nftId: string
  onTrade: (tradeAmount: number) => void
}

export default function NFTTrade({ nftId, onTrade }: NFTTradeProps) {
  const [tradeAmount, setTradeAmount] = useState("")

  const handleTrade = () => {
    const amount = Number.parseFloat(tradeAmount)
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid trade amount")
      return
    }

    const royaltyAmount = (amount * ROYALTY_PERCENTAGE) / 100
    const netAmount = amount - royaltyAmount

    // In a real implementation, you would send this to the XAMAN SDK
    const payload = {
      TransactionType: "NFTSell",
      NFTokenID: nftId,
      Amount: `${amount}000000`, // Convert to drops
      Memos: [
        {
          Memo: {
            MemoData: Buffer.from(
              JSON.stringify({
                royaltyAmount: royaltyAmount,
                netAmount: netAmount,
              }),
            ).toString("hex"),
          },
        },
      ],
    }

    console.log("NFT Trade Payload:", payload)
    onTrade(amount)
  }

  return (
    <div className="flex space-x-2 items-center">
      <Input
        type="number"
        placeholder="Trade amount (XRP)"
        value={tradeAmount}
        onChange={(e) => setTradeAmount(e.target.value)}
        className="w-32"
      />
      <Button size="sm" onClick={handleTrade}>
        Trade NFT
      </Button>
    </div>
  )
}

