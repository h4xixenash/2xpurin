"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  X,
  Loader2,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

type CheckoutStep = "form" | "qrcode" | "success" | "error"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  productName: string
  onSuccess: () => void
}

interface BuyerForm {
  name: string
  email: string
}

export function CheckoutModal({
  isOpen,
  onClose,
  totalAmount,
  productName,
  onSuccess,
}: CheckoutModalProps) {
  const [step, setStep] = useState<CheckoutStep>("form")
  const [form, setForm] = useState<BuyerForm>({
    name: "",
    email: "",
  })
  const [errors, setErrors] = useState<Partial<BuyerForm>>({})
  const [loading, setLoading] = useState(false)
  const [pixCode, setPixCode] = useState("")
  const [qrBase64, setQrBase64] = useState("")
  const [externalId, setExternalId] = useState("")
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const createdRef = useRef(false)

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setStep("form")
      setErrors({})
      setLoading(false)
      setPixCode("")
      setQrBase64("")
      setExternalId("")
      setCopied(false)
      setErrorMessage("")
      createdRef.current = false
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [isOpen])

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleChange = (field: keyof BuyerForm, value: string) => {
  setForm((prev) => ({ ...prev, [field]: value }))
  setErrors((prev) => ({ ...prev, [field]: undefined }))
}

  const validate = (): boolean => {
  const newErrors: Partial<BuyerForm> = {}

  const nameParts = form.name.trim().split(/\s+/)
  if (!form.name.trim()) newErrors.name = "Nome obrigatorio"
  else if (nameParts.length < 2) newErrors.name = "Informe nome e sobrenome"

  if (!form.email.trim()) newErrors.email = "Email obrigatorio"
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    newErrors.email = "Email invalido"

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
  const pollStatus = useCallback(
    (extId: string) => {
      if (pollingRef.current) clearInterval(pollingRef.current)

      pollingRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/checkout/status/${extId}`)
          const data = await res.json()

          if (data?.data?.status === "paid") {
            if (pollingRef.current) {
              clearInterval(pollingRef.current)
              pollingRef.current = null
            }
            setStep("success")
            onSuccess()
          } else if (data?.data?.status === "failed") {
            if (pollingRef.current) {
              clearInterval(pollingRef.current)
              pollingRef.current = null
            }
            setErrorMessage("Pagamento falhou ou expirou. Tente novamente.")
            setStep("error")
          }
        } catch {
          // silently retry on network issues
        }
      }, 7000)
    },
    [onSuccess]
  )

  const handleSubmit = async () => {
    if (!validate()) return
    if (createdRef.current) return

    setLoading(true)
    try {
      const amountInCents = Math.round(totalAmount * 100)

      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInCents,
          buyer: {
            name: form.name.trim(),
            email: form.email.trim(),
          },
          product: {
            id: "painel_uriel",
            name: productName,
          },
          offer: {
            name: "Oferta Promocional - Painel do Uriel",
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
  console.error("create checkout failed:", data)
  setErrorMessage(data.error || "Erro ao gerar pagamento")
  setStep("error")
  return
}


      if (data?.data?.pix) {
        createdRef.current = true
        setPixCode(data.data.pix.code)
        setQrBase64(data.data.pix.qrcode_base64)
        setExternalId(data.data.external_id)
        setStep("qrcode")
        pollStatus(data.data.external_id)
      } else {
        setErrorMessage("Resposta inesperada do servidor")
        setStep("error")
      }
    } catch {
      setErrorMessage("Erro de conexao. Verifique sua internet.")
      setStep("error")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = pixCode
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const handleRetry = () => {
    createdRef.current = false
    setErrorMessage("")
    setStep("form")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Fechar checkout"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-card sm:max-w-lg sm:rounded-2xl">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              {step === "qrcode" && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              <div>
                <h2 className="text-sm font-bold text-foreground sm:text-base">
                  {step === "form" && "Dados para Pagamento"}
                  {step === "qrcode" && "Pagamento via Pix"}
                  {step === "success" && "Pagamento Confirmado"}
                  {step === "error" && "Erro no Pagamento"}
                </h2>
                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  {step === "form" && "Preencha seus dados para gerar o Pix"}
                  {step === "qrcode" && "Escaneie o QR Code ou copie o codigo"}
                  {step === "success" && "Seu acesso foi liberado"}
                  {step === "error" && "Algo deu errado"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
            {/* STEP: Form */}
            {step === "form" && (
              <div className="flex flex-col gap-4">
                {/* Amount display */}
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-center sm:p-4">
                  <p className="mb-0.5 text-[10px] text-muted-foreground sm:text-xs">
                    Total a pagar
                  </p>
                  <p className="text-2xl font-bold text-primary sm:text-3xl">
                    R$ {totalAmount.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                    {productName}
                  </p>
                </div>

                {/* Form fields */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label
                      htmlFor="checkout-name"
                      className="mb-1 block text-xs font-medium text-foreground sm:text-sm"
                    >
                      Nome completo
                    </label>
                    <input
                      id="checkout-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Seu nome e sobrenome"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:px-4 sm:py-3"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-[10px] text-destructive sm:text-xs">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-email"
                      className="mb-1 block text-xs font-medium text-foreground sm:text-sm"
                    >
                      Email
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:px-4 sm:py-3"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-[10px] text-destructive sm:text-xs">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Security badge */}
                <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-green-400" />
                  <p className="text-[10px] text-muted-foreground sm:text-xs">
                    Seus dados estao protegidos com criptografia de ponta a ponta
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gerando Pix...
                    </>
                  ) : (
                    <>
                      Gerar QR Code Pix
                    </>
                  )}
                </button>
              </div>
            )}

            {/* STEP: QR Code */}
            {step === "qrcode" && (
              <div className="flex flex-col items-center gap-4">
                {/* Amount */}
                <div className="w-full rounded-xl border border-primary/30 bg-primary/5 p-3 text-center sm:p-4">
                  <p className="mb-0.5 text-[10px] text-muted-foreground sm:text-xs">
                    Valor do Pix
                  </p>
                  <p className="text-2xl font-bold text-primary sm:text-3xl">
                    R$ {totalAmount.toFixed(2).replace(".", ",")}
                  </p>
                </div>

                {/* QR Code */}
                <div className="rounded-2xl border border-border bg-white p-3 sm:p-4">
                  {qrBase64 ? (
                    <img
                      src={`data:image/png;base64,${qrBase64}`}
                      alt="QR Code Pix"
                      className="h-48 w-48 sm:h-56 sm:w-56"
                    />
                  ) : (
                    <div className="flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Copy code */}
                <div className="w-full">
                  <p className="mb-2 text-center text-xs text-muted-foreground">
                    Ou copie o codigo Pix abaixo:
                  </p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all active:scale-[0.98] ${
                      copied
                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                        : "border-border bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Codigo copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copiar codigo Pix
                      </>
                    )}
                  </button>
                </div>

                {/* Waiting indicator */}
                <div className="flex w-full items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2.5 sm:px-4 sm:py-3">
                  <Clock className="h-4 w-4 shrink-0 animate-pulse text-amber-400" />
                  <div>
                    <p className="text-xs font-medium text-amber-400 sm:text-sm">
                      Aguardando pagamento...
                    </p>
                    <p className="text-[10px] text-muted-foreground sm:text-xs">
                      O pagamento sera confirmado automaticamente
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="w-full rounded-lg bg-secondary/50 p-3 sm:p-4">
                  <p className="mb-2 text-xs font-semibold text-foreground sm:text-sm">
                    Como pagar:
                  </p>
                  <ol className="flex flex-col gap-1.5 text-[10px] text-muted-foreground sm:text-xs">
                    <li>1. Abra o app do seu banco</li>
                    <li>2. Escolha pagar com Pix</li>
                    <li>3. Escaneie o QR Code ou cole o codigo</li>
                    <li>4. Confirme o pagamento</li>
                  </ol>
                </div>
              </div>
            )}

            {/* STEP: Success */}
            {step === "success" && (
              <div className="flex flex-col items-center gap-4 py-6 text-center sm:py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 sm:h-20 sm:w-20">
                  <CheckCircle2 className="h-8 w-8 text-green-400 sm:h-10 sm:w-10" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-foreground sm:text-xl">
                    Pagamento Confirmado!
                  </h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Seu acesso ao {productName} foi liberado com sucesso.
                  </p>
                </div>
                <div className="w-full rounded-lg border border-green-500/30 bg-green-500/5 p-3 sm:p-4">
                  <p className="text-xs text-green-400 sm:text-sm">
                    Voce recebera as instrucoes de acesso no email{" "}
                    <strong>{form.email}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-lg bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                >
                  Fechar
                </button>
              </div>
            )}

            {/* STEP: Error */}
            {step === "error" && (
              <div className="flex flex-col items-center gap-4 py-6 text-center sm:py-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 sm:h-20 sm:w-20">
                  <AlertCircle className="h-8 w-8 text-destructive sm:h-10 sm:w-10" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold text-foreground sm:text-xl">
                    Ops, algo deu errado
                  </h3>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {errorMessage}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="w-full rounded-lg bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                >
                  Tentar Novamente
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
