"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useInView } from "react-intersection-observer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useXumm } from "@/lib/mock-xumm-sdk"
import { toast } from "@/components/ui/use-toast"

interface NFT {
  id: string
  name: string
  image: string
  description: string
  price: number
  owner: string
}

export default function NFTMarketplace() {
  const [nfts, setNfts] = useState<NFT[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isListingNFT, setIsListingNFT] = useState(false)
  const [newNFT, setNewNFT] = useState<Partial<NFT>>({})
  const { account } = useXumm()
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const fetchNFTs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/marketplace/listings")
      const data = await response.json()
      setNfts((prevNfts) => [...prevNfts, ...data])
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.error("Error fetching NFTs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch NFTs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (inView) {
      fetchNFTs()
    }
  }, [inView, fetchNFTs])

  const handleBuyNFT = async (nft: NFT) => {
    try {
      const response = await fetch("/api/marketplace/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nftId: nft.id, buyerId: account }),
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Purchase Successful",
          description: `You have successfully purchased ${nft.name}`,
        })
        setNfts((prevNfts) => prevNfts.map((n) => (n.id === nft.id ? { ...n, owner: account! } : n)))
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error("Error buying NFT:", error)
      toast({
        title: "Purchase Failed",
        description: "There was an error purchasing the NFT. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleListNFT = () => {
    setIsListingNFT(true)
  }

  const handleSubmitNFT = async () => {
    if (newNFT.name && newNFT.image && newNFT.description && newNFT.price && account) {
      try {
        const response = await fetch("/api/marketplace/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newNFT,
            sellerId: account,
          }),
        })
        const data = await response.json()
        if (response.ok) {
          setNfts((prevNfts) => [data, ...prevNfts])
          setIsListingNFT(false)
          setNewNFT({})
          toast({
            title: "NFT Listed",
            description: "Your NFT has been successfully listed on the marketplace.",
          })
        } else {
          throw new Error(data.message)
        }
      } catch (error) {
        console.error("Error listing NFT:", error)
        toast({
          title: "Listing Failed",
          description: "There was an error listing your NFT. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">NFT Marketplace</h1>
      <Button onClick={handleListNFT} className="mb-4">
        List Your NFT
      </Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <Card key={nft.id} className="cursor-pointer" onClick={() => setSelectedNFT(nft)}>
            <CardContent className="p-4">
              <Image
                src={nft.image || "/placeholder.svg"}
                alt={nft.name}
                width={300}
                height={300}
                className="rounded-lg"
              />
              <h2 className="text-lg font-semibold mt-2">{nft.name}</h2>
              <p className="text-sm text-gray-500">{nft.price} XRP</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {loading && <p className="text-center mt-4">Loading more NFTs...</p>}
      <div ref={ref} style={{ height: "10px" }} />

      <Dialog open={!!selectedNFT} onOpenChange={() => setSelectedNFT(null)}>
        <DialogContent>
          {selectedNFT && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedNFT.name}</DialogTitle>
              </DialogHeader>
              <Image
                src={selectedNFT.image || "/placeholder.svg"}
                alt={selectedNFT.name}
                width={300}
                height={300}
                className="rounded-lg mx-auto"
              />
              <DialogDescription>{selectedNFT.description}</DialogDescription>
              <p className="font-semibold">Price: {selectedNFT.price} XRP</p>
              <p>Owner: {selectedNFT.owner}</p>
              <DialogFooter>
                {account && account !== selectedNFT.owner && (
                  <Button onClick={() => handleBuyNFT(selectedNFT)}>Buy NFT</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isListingNFT} onOpenChange={setIsListingNFT}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List Your NFT</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="NFT Name"
            value={newNFT.name || ""}
            onChange={(e) => setNewNFT({ ...newNFT, name: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={newNFT.image || ""}
            onChange={(e) => setNewNFT({ ...newNFT, image: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newNFT.description || ""}
            onChange={(e) => setNewNFT({ ...newNFT, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price (XRP)"
            value={newNFT.price || ""}
            onChange={(e) => setNewNFT({ ...newNFT, price: Number(e.target.value) })}
          />
          <DialogFooter>
            <Button onClick={handleSubmitNFT}>List NFT</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

