"use client"

import { Shield, Lock, RefreshCw } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      {/* Trust badges */}
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="mb-6 flex flex-col items-center gap-4 md:mb-8 md:flex-row md:justify-center md:gap-8">
          {[
            { icon: Shield, label: "Compra Segura" },
            { icon: Lock, label: "Dados Protegidos" },
            { icon: RefreshCw, label: "7 Dias de Garantia" },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-muted-foreground">
              <badge.icon className="h-4 w-4 text-primary md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">{badge.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-border pt-6 md:gap-4 md:pt-8">
          <div className="flex items-center gap-2">
            <img
              src="https://i.ibb.co/2zM651d/favicon.png"
              alt="Painel do Uriel"
              className="h-5 w-5 md:h-6 md:w-6"
            />
            <span className="text-xs font-bold text-foreground md:text-sm">
              Painel do <span className="text-primary">Uriel</span>
            </span>
          </div>
          <p className="max-w-sm text-center text-[10px] leading-relaxed text-muted-foreground md:text-xs">
            Todos os direitos reservados. Este site nao possui afiliacao com nenhuma empresa de jogos.
          </p>
        </div>
      </div>
    </footer>
  )
}
