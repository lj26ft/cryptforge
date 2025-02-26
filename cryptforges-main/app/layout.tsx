import { XummProvider } from "@/lib/mock-xumm-sdk"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CryptForges",
  description: "Forge and trade unique NFTs on the XRP Ledger",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <XummProvider>
        <body className={inter.className}>{children}</body>
      </XummProvider>
    </html>
  )
}

