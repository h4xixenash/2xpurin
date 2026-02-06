"use client"

import { useEffect, useRef, useState } from "react"
import { ShoppingCart, Check, Sparkles } from "lucide-react"

export interface CartItem {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  quantity: number
}

interface ProductsSectionProps {
  onAddToCart: (item: Omit<CartItem, "quantity">) => void
}

const products = [
  {
    id: "painel-android",
    name: "Painel Uriel - Android",
    price: 12.9,
    originalPrice: 79.9,
    image: "https://i.ibb.co/vMG8xRc/Natal-android.jpg",
    features: [
      "Compativel com todos Android",
      "Atualizacoes automaticas",
      "Suporte 24/7",
      "Funcionalidades exclusivas",
      "Anti-ban integrado",
    ],
    badge: "Mais Vendido",
  },
  {
    id: "painel-iphone",
    name: "Painel Uriel - iPhone",
    price: 19.9,
    originalPrice: 89.9,
    image: "https://i.ibb.co/nN1Rcsx0/Natal-iphone-rage.jpg",
    features: [
      "Compativel com todos iPhone",
      "Atualizacoes automaticas",
      "Suporte 24/7",
      "Funcionalidades premium",
      "Anti-ban integrado",
    ],
    badge: "Exclusivo",
  },
]

export function ProductsSection({ onAddToCart }: ProductsSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleAdd = (product: (typeof products)[0]) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
    })
    setAddedIds((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, 2000)
  }

  const discount = Math.round(((99.9 - 19.9) / 99.9) * 100)

  return (
    <section id="products" className="relative py-12 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center md:mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary md:mb-4 md:px-4 md:py-1.5 md:text-sm">
            <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span>{discount}% de desconto</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground md:mb-3 md:text-4xl">
            Escolha seu <span className="text-primary">Painel</span>
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Selecione a versao ideal para o seu dispositivo
          </p>
        </div>

        <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-6">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-700 hover:border-primary/50 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Badge */}
              <div className="absolute top-3 right-3 z-10 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground md:top-4 md:right-4 md:px-3 md:py-1 md:text-xs">
                {product.badge}
              </div>

              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 md:p-6">
                <h3 className="mb-2 text-lg font-bold text-foreground md:mb-3 md:text-xl">{product.name}</h3>

                {/* Price */}
                <div className="mb-3 flex items-baseline gap-2 md:mb-4 md:gap-3">
                  <span className="text-2xl font-bold text-primary md:text-3xl">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-sm text-muted-foreground line-through md:text-lg">
                    R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-4 flex flex-col gap-1.5 md:mb-6 md:gap-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-muted-foreground md:text-sm">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary md:h-4 md:w-4" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all active:scale-[0.97] ${
                    addedIds.has(product.id)
                      ? "bg-green-600 text-foreground"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {addedIds.has(product.id) ? (
                    <>
                      <Check className="h-4 w-4" />
                      Adicionado ao Carrinho
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
