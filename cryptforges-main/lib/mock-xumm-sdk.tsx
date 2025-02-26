"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface XummContextType {
  login: () => void
  logout: () => void
  account: string | null
  balance: number | null
  sdk: {
    payload: {
      create: (payload: any) => Promise<{
        uuid: string
        next: {
          always: string
        }
        resolve: () => Promise<{ signed: boolean }>
      }>
    }
    getAccountBalance: () => Promise<number>
  }
}

const XummContext = createContext<XummContextType | undefined>(undefined)

export function XummProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(() => {
    const savedAccount = localStorage.getItem("xumm_account")
    if (savedAccount) {
      setAccount(savedAccount)
      updateBalance(savedAccount)
    }
  }, [])

  const updateBalance = async (accountAddress: string) => {
    // In a real implementation, this would fetch the actual balance from the blockchain
    const mockBalance = Math.floor(Math.random() * 10000) / 100
    setBalance(mockBalance)
  }

  const login = () => {
    const mockAccount = "rMockXummAccount123456"
    setAccount(mockAccount)
    localStorage.setItem("xumm_account", mockAccount)
    updateBalance(mockAccount)
  }

  const logout = () => {
    setAccount(null)
    setBalance(null)
    localStorage.removeItem("xumm_account")
  }

  const sdk = {
    payload: {
      create: async (payload: any) => {
        console.log("Creating payload:", payload)
        return {
          uuid: `mock-uuid-${Math.random().toString(36).substring(7)}`,
          next: {
            always: "https://xumm.app/sign/mock-qr-code",
          },
          resolve: async () => {
            // Simulating user signing the transaction
            return { signed: Math.random() > 0.5 }
          },
        }
      },
    },
    getAccountBalance: async () => {
      if (!account) throw new Error("No account connected")
      return balance || 0
    },
  }

  return <XummContext.Provider value={{ login, logout, account, balance, sdk }}>{children}</XummContext.Provider>
}

export function useXumm() {
  const context = useContext(XummContext)
  if (context === undefined) {
    throw new Error("useXumm must be used within a XummProvider")
  }
  return context
}

