"use client"

import { useEffect, useState } from "react"
import { ArrowDown, Shield, Zap, Users } from "lucide-react"

export function HeroSection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <section id="hero" className="relative overflow-hidden pt-16 md:pt-20">
      {/* Red gradient top glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[300px] w-[400px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px] md:h-[500px] md:w-[800px] md:blur-[120px]" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-10 pb-8 text-center md:pt-16 md:pb-12">
        <div
          className={`transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary md:mb-6 md:px-4 md:py-1.5 md:text-sm">
            <Zap className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span>Oferta por tempo limitado</span>
          </div>

          <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight text-foreground md:mb-4 md:text-5xl lg:text-7xl">
            <span className="text-balance">
              O Painel Mais{" "}
              <span className="text-primary">Poderoso</span> do Mercado
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-md text-base leading-relaxed text-muted-foreground md:mb-8 md:max-w-2xl md:text-xl">
            Domine com o Painel do Uriel. Funcionalidades exclusivas, atualizacoes constantes e suporte dedicado.
          </p>

          <div className="mb-8 flex flex-col items-center gap-3 md:mb-12 md:flex-row md:justify-center md:gap-4">
            <button
              type="button"
              onClick={() =>
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
              }
              className="animate-pulse-red w-full rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 md:w-auto md:text-base"
            >
              Comprar Agora
            </button>
            <button
              type="button"
              onClick={() =>
                document.getElementById("vsl")?.scrollIntoView({ behavior: "smooth" })
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-secondary/80 md:w-auto md:text-base"
            >
              Ver Video
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className={`flex w-full flex-col gap-4 transition-all delay-300 duration-700 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-8 lg:gap-12 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {[
            { icon: Shield, label: "Seguro", desc: "100% indetectavel" },
            { icon: Zap, label: "Rapido", desc: "Ativacao instantanea" },
            { icon: Users, label: "+5.000", desc: "Usuarios ativos" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3 md:border-0 md:bg-transparent md:p-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
