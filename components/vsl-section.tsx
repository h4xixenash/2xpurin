"use client"

import { useEffect, useRef, useState } from "react"

export function VslSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="vsl" className="relative py-10 md:py-16">
      <div ref={ref} className="mx-auto max-w-4xl px-4">
        <div className="mb-6 text-center md:mb-8">
          <h2 className="mb-2 text-xl font-bold text-foreground md:text-3xl">
            Veja o Painel em <span className="text-primary">Acao</span>
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Assista e descubra por que somos a escolha numero 1
          </p>
        </div>

        <div
          className={`overflow-hidden rounded-xl border border-border bg-card transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="relative aspect-video w-full">
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
            >
              <source
                src="https://r2.e-z.host/4a60e094-fe51-4af7-9cdf-73215f20d87e/ke9fb9uk.mov"
                type="video/quicktime"
              />
              <source
                src="https://r2.e-z.host/4a60e094-fe51-4af7-9cdf-73215f20d87e/ke9fb9uk.mov"
                type="video/mp4"
              />
              Seu navegador nao suporta este video.
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
