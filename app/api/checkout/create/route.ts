import { NextResponse } from "next/server"

const BUCKPAY_API = "https://nashapi-buckpay.squareweb.app"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, buyer, product, offer, tracking } = body

    // ✅ agora só exige amount + nome + email
    if (!amount || !buyer?.name || !buyer?.email) {
      return NextResponse.json(
        { error: "Campos obrigatorios ausentes" },
        { status: 400 }
      )
    }

    // Nome e sobrenome (igual sua regra no Express)
    const nameParts = String(buyer.name).trim().split(/\s+/)
    if (nameParts.length < 2) {
      return NextResponse.json(
        { error: "buyer.name precisa ser Nome e Sobrenome." },
        { status: 400 }
      )
    }

    // ✅ BuckPay/UTMify pelo seu erro: offer.id precisa ser string
    const safeOffer = {
      id: String(offer?.id || "oferta_promocional"),
      name: String(offer?.name || "Oferta Promocional"),
      quantity:
        typeof offer?.quantity === "number" && Number.isFinite(offer.quantity)
          ? offer.quantity
          : 1,
    }

    // ✅ tracking obrigatório (pelos erros anteriores)
    const safeTracking = {
      ref: tracking?.ref ?? "direct",
      src: tracking?.src ?? "site",
      sck: tracking?.sck ?? "organic",
      utm_source: tracking?.utm_source ?? "direct",
      utm_medium: tracking?.utm_medium ?? "none",
      utm_campaign: tracking?.utm_campaign ?? "checkout",
      utm_id: tracking?.utm_id ?? "",
      utm_term: tracking?.utm_term ?? "",
      utm_content: tracking?.utm_content ?? "",
    }

    const payload = {
      amount,
      buyer: {
        name: String(buyer.name).trim(),
        email: String(buyer.email).trim(),

        // ✅ opcionais: só manda se existirem
        ...(buyer?.document ? { document: String(buyer.document) } : {}),
        ...(buyer?.phone ? { phone: String(buyer.phone) } : {}),
      },
      product: product || { id: "painel_uriel", name: "Painel do Uriel" },
      offer: safeOffer,
      tracking: safeTracking,
    }

    const response = await fetch(`${BUCKPAY_API}/checkout/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const msg =
        data?.error ||
        data?.message ||
        data?.detail?.message ||
        data?.errors?.[0]?.message ||
        "Erro ao criar checkout"

      return NextResponse.json(
        { error: msg, details: data, sent: payload },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Checkout create error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
