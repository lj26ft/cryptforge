"use client"

import { XummSdk } from "xumm-sdk"
import { useState, useEffect } from "react"
import type React from "react" // Import React

interface XummButtonProps {
  onLogin: (auth: any) => void
  onTransaction: (payload: any) => void
}

const XummButton: React.FC<XummButtonProps> = ({ onLogin, onTransaction }) => {
  const [xumm, setXumm] = useState<XummSdk | null>(null)

  useEffect(() => {
    const initializeXumm = async () => {
      const sdk = new XummSdk(process.env.NEXT_PUBLIC_XUMM_API_KEY!, process.env.NEXT_PUBLIC_XUMM_API_SECRET!)
      setXumm(sdk)
    }
    initializeXumm()
  }, [])

  const handleLogin = async () => {
    if (xumm) {
      const auth = await xumm.authorize()
      onLogin(auth)
    }
  }

  const handleTransaction = async () => {
    if (xumm) {
      try {
        const payload = await xumm.payload.create({
          txjson: {
            TransactionType: "Payment",
            Account: "rUserAccountHere",
            Destination: "rDestinationAccountHere",
            Amount: "1000000", // 1 XRP in drops
          },
        })
        onTransaction(payload)
      } catch (error) {
        console.error("Error creating transaction payload", error)
      }
    }
  }

  return (
    <div>
      <button onClick={handleLogin}>Login with Xumm</button>
      <button onClick={handleTransaction}>Create Transaction</button>
    </div>
  )
}

export default XummButton

