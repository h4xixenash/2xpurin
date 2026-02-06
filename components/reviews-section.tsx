"use client"

import { useEffect, useRef, useState } from "react"
import { Star, ThumbsUp, ShieldCheck } from "lucide-react"

const reviews = [
  {
    name: "Lucas S.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    date: "3 dias atrás",
    verified: true,
    text: "Comprei e em poucos minutos já estava tudo funcionando. No meu Android rodou liso.",
    helpful: 24,
  },
  {
    name: "Gabriel M.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5,
    date: "1 semana atrás",
    verified: true,
    text: "Interface bonita, simples e muito bem organizada. Dá pra ver que foi bem feito.",
    helpful: 38,
  },
  {
    name: "Pedro H.",
    avatar: "https://randomuser.me/api/portraits/men/18.jpg",
    rating: 5,
    date: "2 semanas atrás",
    verified: true,
    text: "No iPhone funcionou certinho. Tudo rápido e sem bugs.",
    helpful: 15,
  },
  {
    name: "Rafael C.",
    avatar: "https://randomuser.me/api/portraits/men/61.jpg",
    rating: 4,
    date: "3 semanas atrás",
    verified: true,
    text: "Entrega muito pelo preço. Funcionamento excelente.",
    helpful: 42,
  },
  {
    name: "Mateus L.",
    avatar: "https://randomuser.me/api/portraits/men/72.jpg",
    rating: 5,
    date: "1 mês atrás",
    verified: true,
    text: "Suporte rápido e educado. Produto bem redondo.",
    helpful: 31,
  },
  {
    name: "Felipe R.",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    rating: 5,
    date: "1 mês atrás",
    verified: true,
    text: "Indiquei pra amigos e todos curtiram. Muito confiável.",
    helpful: 19,
  },
]

export function ReviewsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)

  return (
    <section id="reviews" className="relative py-12 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-2 text-2xl font-bold text-foreground md:mb-3 md:text-4xl">
            O que nossos <span className="text-primary">clientes</span> dizem
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={`avg-star-${i}`} className="h-4 w-4 fill-primary text-primary md:h-5 md:w-5" />
              ))}
            </div>
            <span className="text-base font-bold text-foreground md:text-lg">{avgRating}</span>
            <span className="text-xs text-muted-foreground md:text-base">({reviews.length} avaliações)</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={review.name}
              className={`rounded-xl border border-border bg-card p-4 transition-all duration-700 hover:border-primary/30 md:p-5 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-2 flex items-center justify-between md:mb-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative h-8 w-8 md:h-10 md:w-10">
  <img
    src={review.avatar}
    alt={review.name}
    className="h-full w-full rounded-full object-cover border border-border"
    loading="lazy"
  />
</div>

                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-semibold text-foreground md:text-sm">{review.name}</p>
                      {review.verified && (
                        <ShieldCheck className="h-3 w-3 text-primary md:h-3.5 md:w-3.5" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground md:text-xs">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star
                      key={`review-star-${review.name}-${j}`}
                      className="h-3 w-3 fill-primary text-primary md:h-3.5 md:w-3.5"
                    />
                  ))}
                </div>
              </div>

              <p className="mb-2 text-xs leading-relaxed text-muted-foreground md:mb-3 md:text-sm">
                {review.text}
              </p>

              <div className="flex items-center gap-1 text-[10px] text-muted-foreground md:text-xs">
                <ThumbsUp className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span>{review.helpful} acharam útil</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
