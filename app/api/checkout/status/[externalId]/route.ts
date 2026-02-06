import { NextResponse } from "next/server"

const BUCKPAY_API = "https://nashapi-buckpay.squareweb.app"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ externalId: string }> }
) {
  try {
    const { externalId } = await params

    if (!externalId) {
      return NextResponse.json(
        { error: "external_id ausente" },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${BUCKPAY_API}/checkout/status/${externalId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Erro ao consultar status" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Checkout status error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
