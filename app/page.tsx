"use client"

import { useState, useCallback, useMemo } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { VslSection } from "@/components/vsl-section"
import { ProductsSection } from "@/components/products-section"
import { InfluencersSection } from "@/components/influencers-section"
import { ReviewsSection } from "@/components/reviews-section"
import { FaqSection } from "@/components/faq-section"
import { CartDrawer } from "@/components/cart-drawer"
import { CheckoutModal } from "@/components/checkout-modal"
import { PurchaseNotifications } from "@/components/purchase-notifications"
import { Footer } from "@/components/footer"
import type { CartItem } from "@/components/products-section"

const COUPONS: Record<string, number> = {
  URIEL10: 10,
}

export default function Page() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    setCartOpen(true)
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const discount = appliedCoupon
    ? (subtotal * COUPONS[appliedCoupon]) / 100
    : 0
  const checkoutTotal = subtotal - discount

  const productName = useMemo(() => {
    if (cartItems.length === 0) return "Painel do Uriel"
    if (cartItems.length === 1) return cartItems[0].name
    return cartItems.map((i) => i.name).join(" + ")
  }, [cartItems])

  const handleOpenCheckout = useCallback(() => {
    setCartOpen(false)
    setTimeout(() => setCheckoutOpen(true), 200)
  }, [])

  const handleCheckoutSuccess = useCallback(() => {
    setCartItems([])
    setAppliedCoupon(null)
  }, [])

  return (
    <div className="grid-bg relative min-h-screen">
      <Header cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <main>
        <HeroSection />
        <VslSection />

        <div className="mx-auto max-w-6xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <ProductsSection onAddToCart={addToCart} />

        <div className="mx-auto max-w-6xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <InfluencersSection />

        <div className="mx-auto max-w-6xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <ReviewsSection />

        <div className="mx-auto max-w-6xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <FaqSection />
      </main>

      <Footer />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onCheckout={handleOpenCheckout}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        totalAmount={checkoutTotal}
        productName={productName}
        onSuccess={handleCheckoutSuccess}
      />

      <PurchaseNotifications />
    </div>
  )
}
