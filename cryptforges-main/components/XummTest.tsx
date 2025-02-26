import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signInWithXumm } from "@/lib/xumm"
import { useToast } from "@/components/ui/use-toast"

export function XummTest() {
  const [address, setAddress] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSignIn = async () => {
    try {
      const userAddress = await signInWithXumm()
      setAddress(userAddress)
      toast({
        title: "Successfully connected",
        description: `Connected to address: ${userAddress}`,
      })
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Failed to connect with XUMM. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">XUMM SDK Test</h2>
      {address ? (
        <p className="mb-4">Connected Address: {address}</p>
      ) : (
        <Button onClick={handleSignIn}>Connect with XUMM</Button>
      )}
    </div>
  )
}

