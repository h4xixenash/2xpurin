"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "O que e o Painel do Uriel?",
    answer:
      "O Painel do Uriel e a ferramenta mais completa e poderosa do mercado, desenvolvida para oferecer funcionalidades exclusivas com atualizacoes constantes e suporte dedicado para Android e iPhone.",
  },
  {
    question: "Como recebo o produto apos a compra?",
    answer:
      "Apos a confirmacao do pagamento, voce recebera imediatamente o acesso ao painel por email, com todas as instrucoes de instalacao e ativacao.",
  },
  {
    question: "O painel funciona em qualquer dispositivo?",
    answer:
      "Sim! Temos versoes dedicadas para Android e iPhone. Basta escolher a versao compativel com o seu dispositivo no momento da compra.",
  },
  {
    question: "O pagamento via Pix e seguro?",
    answer:
      "Totalmente seguro! O pagamento via Pix e processado de forma instantanea e criptografada, garantindo total seguranca na sua transacao.",
  },
  {
    question: "Posso usar cupom de desconto?",
    answer:
      "Sim! Aceitamos cupons de desconto. Basta inserir o codigo no carrinho de compras antes de finalizar o pedido para o desconto ser aplicado automaticamente.",
  },
  {
    question: "O painel recebe atualizacoes?",
    answer:
      "Sim! O Painel do Uriel recebe atualizacoes constantes e automaticas, garantindo que voce sempre tenha acesso as funcionalidades mais recentes.",
  },
  {
    question: "Qual a politica de reembolso?",
    answer:
      "Oferecemos garantia de satisfacao de 7 dias. Se voce nao ficar satisfeito, devolvemos 100% do seu dinheiro, sem perguntas.",
  },
]

export function FaqSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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

  return (
    <section id="faq" className="relative py-12 md:py-20" ref={ref}>
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-2 text-2xl font-bold text-foreground md:mb-3 md:text-4xl">
            Perguntas <span className="text-primary">Frequentes</span>
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Tire suas duvidas sobre o Painel do Uriel
          </p>
        </div>

        <div className="flex flex-col gap-2 md:gap-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className={`overflow-hidden rounded-xl border border-border bg-card transition-all duration-700 ${
                openIndex === i ? "border-primary/50" : ""
              } ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center gap-2 p-3 text-left transition-colors hover:bg-secondary/50 md:gap-3 md:p-4"
              >
                <HelpCircle className="h-4 w-4 shrink-0 text-primary md:h-5 md:w-5" />
                <span className="flex-1 text-xs font-semibold text-foreground md:text-sm">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-300 md:h-4 md:w-4 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === i ? "max-h-48" : "max-h-0"
                }`}
              >
                <p className="px-3 pb-3 pl-9 text-xs leading-relaxed text-muted-foreground md:px-4 md:pb-4 md:pl-12 md:text-sm">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
