import { NextResponse } from "next/server"
import { XummSdk } from "xumm-sdk"

export async function GET() {
  const xumm = new XummSdk(process.env.XUMM_API_KEY!, process.env.XUMM_API_SECRET!)

  try {
    const pong = await xumm.ping()
    return NextResponse.json({ message: "XUMM API ping successful", pong })
  } catch (error) {
    console.error("Failed to ping XUMM API:", error)
    return NextResponse.json({ error: "Failed to ping XUMM API" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const xumm = new XummSdk(process.env.XUMM_API_KEY!, process.env.XUMM_API_SECRET!)
  const { action, ...params } = await request.json()

  try {
    switch (action) {
      case "createPayload":
        const payload = await xumm.payload.create({
          TransactionType: "SignIn",
        })
        return NextResponse.json({ payload })

      case "getPayloadStatus":
        const { payloadId } = params
        const payloadStatus = await xumm.payload.get(payloadId)
        return NextResponse.json({ payloadStatus })

      case "getKycStatus":
        const { userToken } = params
        const kycStatus = await xumm.kyc.get(userToken)
        return NextResponse.json({ kycStatus })

      case "getXrplAccount":
        const { account } = params
        const accountInfo = await xumm.xrpl.getAccount(account)
        return NextResponse.json({ accountInfo })

      case "getXrplTransaction":
        const { txHash } = params
        const txInfo = await xumm.xrpl.getTransaction(txHash)
        return NextResponse.json({ txInfo })

      case "createPayment":
        const { destination, amount, currency } = params
        const paymentPayload = await xumm.payload.create({
          TransactionType: "Payment",
          Destination: destination,
          Amount: {
            currency: currency,
            value: amount,
            issuer: currency === "XRP" ? undefined : destination,
          },
        })
        return NextResponse.json({ paymentPayload })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("XUMM API error:", error)
    return NextResponse.json({ error: "XUMM API error" }, { status: 500 })
  }
}

