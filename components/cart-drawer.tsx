"use client"

import { useState, useEffect } from "react"
import { X, Minus, Plus, Trash2, Tag, CreditCard } from "lucide-react"
import type { CartItem } from "./products-section"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
  appliedCoupon: string | null
  onApplyCoupon: (code: string | null) => void
}

const COUPONS: Record<string, number> = {
  URIEL10: 10,
  URIEL20: 20,
  DESCONTO50: 50,
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  appliedCoupon,
  onApplyCoupon,
}: CartDrawerProps) {
  const [coupon, setCoupon] = useState("")
  const [couponError, setCouponError] = useState("")

  // Lock body scroll when drawer is open
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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedCoupon ? (subtotal * COUPONS[appliedCoupon]) / 100 : 0
  const total = subtotal - discount

  const applyCouponHandler = () => {
    const code = coupon.trim().toUpperCase()
    if (COUPONS[code]) {
      onApplyCoupon(code)
      setCouponError("")
    } else {
      setCouponError("Cupom invalido")
      onApplyCoupon(null)
    }
  }

  const removeCoupon = () => {
    onApplyCoupon(null)
    setCoupon("")
    setCouponError("")
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    onCheckout()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Fechar carrinho"
        />
      )}

      {/* Drawer - full width on mobile, max-w-md on desktop */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full flex-col border-l border-border bg-card transition-transform duration-300 sm:max-w-md ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-base font-bold text-foreground md:text-lg">Carrinho</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary md:h-16 md:w-16">
                <CreditCard className="h-6 w-6 text-muted-foreground md:h-7 md:w-7" />
              </div>
              <p className="mb-1 text-sm font-semibold text-foreground md:text-base">Carrinho vazio</p>
              <p className="text-xs text-muted-foreground md:text-sm">
                Adicione produtos para continuar
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-lg border border-border bg-secondary/50 p-3"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover md:h-16 md:w-16"
                    crossOrigin="anonymous"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="text-xs font-semibold text-foreground md:text-sm">{item.name}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-primary md:text-sm">
                        R$ {item.price.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-[10px] text-muted-foreground line-through md:text-xs">
                        R$ {item.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-medium text-foreground md:text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-foreground transition-colors hover:bg-secondary"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="ml-auto flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-4">
            {/* Coupon */}
            <div className="mb-3 md:mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg bg-green-900/30 px-3 py-2 text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <Tag className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span>
                      Cupom {appliedCoupon} ({COUPONS[appliedCoupon]}% off)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="flex h-6 w-6 items-center justify-center text-green-400 hover:text-green-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value)
                      setCouponError("")
                    }}
                    placeholder="Cupom de desconto"
                    className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none md:text-sm"
                  />
                  <button
                    type="button"
                    onClick={applyCouponHandler}
                    className="shrink-0 rounded-lg bg-secondary px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary/80 md:text-sm"
                  >
                    Aplicar
                  </button>
                </div>
              )}
              {couponError && (
                <p className="mt-1 text-[10px] text-destructive md:text-xs">{couponError}</p>
              )}
            </div>

            {/* Summary */}
            <div className="mb-3 flex flex-col gap-1.5 text-xs md:mb-4 md:gap-2 md:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Desconto</span>
                  <span>-R$ {discount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-sm font-bold text-foreground md:text-base">
                <span>Total</span>
                <span className="text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-lg bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Finalizar Compra
            </button>
          </div>
        )}


      </div>
    </>
  )
}
