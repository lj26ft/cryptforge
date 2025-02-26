"use client"

import { useState, useEffect } from "react"
import { XummSdk } from "xumm-sdk"

export function useXumm() {
  const [sdk, setSdk] = useState<XummSdk | null>(null)
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    const initXumm = async () => {
      if (typeof window !== "undefined") {
        const xummSdk = new XummSdk(process.env.NEXT_PUBLIC_XUMM_API_KEY!, process.env.NEXT_PUBLIC_XUMM_API_SECRET!)
        setSdk(xummSdk)

        // Check if there's a stored account
        const storedAccount = localStorage.getItem("xumm_account")
        if (storedAccount) {
          setAccount(storedAccount)
        }
      }
    }

    initXumm()
  }, [])

  const login = async () => {
    if (sdk) {
      try {
        const authResult = await sdk.authorize()
        if (authResult.account) {
          setAccount(authResult.account)
          localStorage.setItem("xumm_account", authResult.account)
        }
      } catch (error) {
        console.error("Error during XUMM login:", error)
      }
    }
  }

  const logout = () => {
    setAccount(null)
    localStorage.removeItem("xumm_account")
  }

  return { sdk, account, login, logout }
}

