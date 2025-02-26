import { XummSdk } from "xumm-sdk"
import { createAndMintURIToken } from "../lib/uri-token"
import { jest } from "@jest/globals" // Import jest

// Mock the XummSdk
jest.mock("xumm-sdk")

describe("Xumm SDK Integration", () => {
  let mockSdk: jest.Mocked<XummSdk>

  beforeEach(() => {
    mockSdk = new XummSdk() as jest.Mocked<XummSdk>
    mockSdk.payload.create = jest.fn().mockResolvedValue({
      uuid: "mock-uuid",
      next: {
        always: "https://xumm.app/sign/mock-uuid",
      },
    })
    mockSdk.payload.createAndSubscribe = jest.fn().mockResolvedValue({
      signed: true,
      txid: "mock-txid",
    })
  })

  it("should successfully create and mint a URIToken", async () => {
    const result = await createAndMintURIToken(
      "Angelic",
      "Character",
      "Rare",
      "Custom details",
      "rUserAccountHere",
      mockSdk,
    )

    expect(result.success).toBe(true)
    expect(result.nftId).toBe("mock-txid")
    expect(mockSdk.payload.create).toHaveBeenCalledWith(
      expect.objectContaining({
        txjson: expect.objectContaining({
          TransactionType: "URITokenMint",
          Account: "rUserAccountHere",
        }),
      }),
    )
    expect(mockSdk.payload.createAndSubscribe).toHaveBeenCalled()
  })

  it("should handle unsuccessful minting", async () => {
    mockSdk.payload.createAndSubscribe = jest.fn().mockResolvedValue({
      signed: false,
    })

    const result = await createAndMintURIToken("Demonic", "Item", "Epic", "Custom details", "rUserAccountHere", mockSdk)

    expect(result.success).toBe(false)
  })

  it("should handle errors during minting process", async () => {
    mockSdk.payload.create = jest.fn().mockRejectedValue(new Error("API Error"))

    const result = await createAndMintURIToken(
      "Human",
      "Support",
      "Legendary",
      "Custom details",
      "rUserAccountHere",
      mockSdk,
    )

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})

