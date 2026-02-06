"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"

const influencers = [
  {
    name: "JordanX",
    image: "https://i.ibb.co/wZJDXSsx/jordan-X.jpg",
    role: "Content Creator",
    followers: "500K+",
    quote: "O Painel do Uriel e simplesmente o melhor que ja usei. Recomendo de olhos fechados!",
  },
  {
    name: "Marechal",
    image: "https://i.ibb.co/Q70V5Vg1/marechal.jpg",
    role: "Pro Player",
    followers: "1M+",
    quote: "Desde que comecei a usar, meu desempenho mudou completamente. Indispensavel!",
  },
  {
    name: "Fantasma FF",
    image: "https://i.ibb.co/W4pwrhVn/fantasmaff.jpg",
    role: "Streamer",
    followers: "800K+",
    quote: "Qualidade premium por um preco acessivel. O suporte tambem e incrivel!",
  },
]

export function InfluencersSection() {
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

  return (
    <section id="influencers" className="relative py-12 md:py-20" ref={ref}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-2 text-2xl font-bold text-foreground md:mb-3 md:text-4xl">
            Recomendado por <span className="text-primary">Gigantes</span>
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Veja o que os maiores influenciadores dizem sobre o Painel do Uriel
          </p>
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
          {influencers.map((influencer, i) => (
            <div
              key={influencer.name}
              className={`group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-700 hover:border-primary/50 md:p-6 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Top red accent line */}
              <div className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="mb-3 flex items-center gap-3 md:mb-4 md:gap-4">
                <div className="relative">
                  <img
                    src={influencer.image || "/placeholder.svg"}
                    alt={influencer.name}
                    className="h-12 w-12 rounded-full border-2 border-primary/50 object-cover md:h-16 md:w-16"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground md:h-5 md:w-5 md:text-[10px]">
                    <Star className="h-2.5 w-2.5 fill-current md:h-3 md:w-3" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground md:text-base">{influencer.name}</h3>
                  <p className="text-[10px] text-muted-foreground md:text-xs">{influencer.role}</p>
                  <p className="text-[10px] text-primary md:text-xs">{influencer.followers} seguidores</p>
                </div>
              </div>

              <p className="mb-3 text-xs leading-relaxed text-muted-foreground italic md:mb-4 md:text-sm">
                {'"'}{influencer.quote}{'"'}
              </p>

              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={`star-${influencer.name}-${j}`}
                    className="h-3.5 w-3.5 fill-primary text-primary md:h-4 md:w-4"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
