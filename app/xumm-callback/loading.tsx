import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="mt-4 text-lg">Processing XUMM callback...</p>
    </div>
  )
}

