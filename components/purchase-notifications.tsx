"use client"

import { useEffect, useState, useCallback } from "react"
import { ShoppingBag, MapPin } from "lucide-react"

const firstNames = [
  "Lucas", "Gabriel", "Pedro", "Rafael", "Mateus",
  "Felipe", "Gustavo", "Bruno", "Leonardo", "Diego",
  "Joao", "Arthur", "Henrique", "Vitor", "Enzo",
  "Thiago", "Caio", "Guilherme", "Bernardo", "Nicolas",
  "Miguel", "Daniel", "Igor", "Samuel", "Eduardo",
]

const locations = [
  "Sao Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG",
  "Curitiba, PR", "Porto Alegre, RS", "Salvador, BA",
  "Brasilia, DF", "Fortaleza, CE", "Recife, PE",
  "Manaus, AM", "Goiania, GO", "Campinas, SP",
  "Florianopolis, SC", "Vitoria, ES", "Natal, RN",
  "Campo Grande, MS", "Macae, RJ", "Uberlandia, MG",
]

const productNames = ["Painel Uriel - Android", "Painel Uriel - iPhone"]

interface Notification {
  id: number
  name: string
  product: string
  location: string
  visible: boolean
}

export function PurchaseNotifications() {
  const [notification, setNotification] = useState<Notification | null>(null)

  const showNotification = useCallback(() => {
    const name = firstNames[Math.floor(Math.random() * firstNames.length)]
    const product = productNames[Math.floor(Math.random() * productNames.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]

    const newNotification: Notification = {
      id: Date.now(),
      name,
      product,
      location,
      visible: true,
    }

    setNotification(newNotification)

    setTimeout(() => {
      setNotification((prev) => (prev ? { ...prev, visible: false } : null))
    }, 4000)

    setTimeout(() => {
      setNotification(null)
    }, 4500)
  }, [])

  useEffect(() => {
    const initialDelay = setTimeout(() => {
      showNotification()
    }, 5000)

    const interval = setInterval(() => {
      showNotification()
    }, 8000 + Math.random() * 7000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [showNotification])

  if (!notification) return null

  return (
    <div className="pointer-events-none fixed bottom-3 left-3 right-3 z-40 md:right-auto md:bottom-6 md:left-6">
      <div
        className={`pointer-events-auto flex w-full items-start gap-2.5 rounded-xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-xl md:max-w-xs md:gap-3 md:p-3.5 ${
          notification.visible ? "animate-slide-in-right" : "animate-slide-out-right"
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 md:h-10 md:w-10">
          <ShoppingBag className="h-4 w-4 text-primary md:h-5 md:w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground md:text-sm">
            {notification.name}{" "}
            <span className="font-normal text-muted-foreground">comprou</span>
          </p>
          <p className="truncate text-xs text-primary md:text-sm">{notification.product}</p>
          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground md:mt-1 md:text-xs">
            <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3" />
            <span>{notification.location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
