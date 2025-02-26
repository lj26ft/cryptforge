"use client"

import { useState, useEffect, useCallback } from "react"
import { XummSdk } from "xumm-sdk"

export function useXumm() {
  const [sdk, setSdk] = useState<XummSdk | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initXumm = async () => {
      if (typeof window !== "undefined") {
        try {
          const xummSdk = new XummSdk(process.env.NEXT_PUBLIC_XUMM_API_KEY!, process.env.NEXT_PUBLIC_XUMM_API_SECRET!)
          setSdk(xummSdk)

          // Check if there's a stored account
          const storedAccount = localStorage.getItem("xumm_account")
          if (storedAccount) {
            setAccount(storedAccount)
          }
        } catch (err) {
          console.error("Error initializing XUMM SDK:", err)
          setError("Failed to initialize XUMM SDK")
        }
      }
    }

    initXumm()
  }, [])

  const login = useCallback(async () => {
    if (sdk) {
      try {
        const payload = await sdk.payload.create({
          TransactionType: "SignIn",
          options: {
            return_url: {
              app: "https://cryptforges.app/xumm-callback",
              web: "https://cryptforges.app/xumm-callback",
            },
          },
        })

        // Open XUMM app for signing
        window.open(payload.next.always, "_blank")

        // Poll for payload status
        const result = await sdk.payload.createAndSubscribe(payload, (event) => {
          if (event.data.signed === true) {
            return event.data
          }
          if (event.data.signed === false) {
            throw new Error("User rejected the sign request")
          }
        })

        if (result.signed) {
          setAccount(result.account!)
          localStorage.setItem("xumm_account", result.account!)
        }
      } catch (err) {
        console.error("Error during XUMM login:", err)
        setError("Failed to login with XUMM")
      }
    }
  }, [sdk])

  const logout = useCallback(() => {
    setAccount(null)
    localStorage.removeItem("xumm_account")
  }, [])

  const getPayloadDetails = useCallback(
    async (payloadId: string) => {
      if (sdk) {
        try {
          return await sdk.payload.get(payloadId)
        } catch (err) {
          console.error("Error fetching payload details:", err)
          throw new Error("Failed to fetch payload details")
        }
      }
      throw new Error("XUMM SDK not initialized")
    },
    [sdk],
  )

  return { sdk, account, login, logout, error, getPayloadDetails }
}

