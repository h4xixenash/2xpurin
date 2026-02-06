"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Menu, X } from "lucide-react"

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:py-3">
        <button type="button" onClick={() => scrollTo("hero")} className="flex items-center gap-2">
          <img
            src="https://i.ibb.co/2zM651d/favicon.png"
            alt="Painel do Uriel"
            className="h-12 w-12 md:h-12 md:w-12"
          />
          <span className="text-sm font-bold text-foreground md:text-lg">
            Painel do <span className="text-primary">Uriel</span>
          </span>
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          {[
            { label: "Produtos", id: "products" },
            { label: "Depoimentos", id: "reviews" },
            { label: "Influencers", id: "influencers" },
            { label: "FAQ", id: "faq" },
          ].map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCartClick}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary transition-colors hover:bg-primary hover:text-primary-foreground md:h-10 md:w-10"
          >
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground md:-top-1.5 md:-right-1.5 md:h-5 md:w-5 md:text-xs">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-0.5 px-4 py-2">
            {[
              { label: "Produtos", id: "products" },
              { label: "Depoimentos", id: "reviews" },
              { label: "Influencers", id: "influencers" },
              { label: "FAQ", id: "faq" },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:bg-secondary"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
