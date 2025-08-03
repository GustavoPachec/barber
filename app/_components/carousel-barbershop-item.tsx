"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/app/_components/ui/carousel"
import { Barbershop } from "@prisma/client"
import BarbershopItem from "./barbershop-item"
import { useEffect, useState, useCallback } from "react"
import Autoplay from "embla-carousel-autoplay"

interface CarouselBarbershopItemProps {
  barbershops: Barbershop[]
  className?: string
}

export function CarouselBarbershopItem({
  barbershops,
  className,
}: CarouselBarbershopItemProps) {
  const [api, setApi] = useState<CarouselApi | null>(null)
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [visibleItems, setVisibleItems] = useState(1) // Estado para itens visíveis

  const autoplayPlugin = Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  })

  const handleSelect = useCallback(() => {
    if (api) {
      setCurrent(api.selectedScrollSnap() + 1)
    }
  }, [api])

  const handleDotClick = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  // Atualiza o número de itens visíveis com base no tamanho da tela
  const updateVisibleItems = useCallback(() => {
    const width = window.innerWidth
    if (width >= 1024) {
      setVisibleItems(3) // lg: 3 itens visíveis
    } else if (width >= 768) {
      setVisibleItems(3) // md: 3 itens visíveis
    } else if (width >= 640) {
      setVisibleItems(2) // sm: 2 itens visíveis
    } else if (width >= 475) {
      setVisibleItems(1) // xs: 1 item visível
    } else {
      setVisibleItems(1) // Menor que xs: 1 item visível
    }
  }, [])

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api, handleSelect])

  useEffect(() => {
    updateVisibleItems() // Define itens visíveis inicialmente
    const handleResize = () => {
      if (api) {
        setCount(api.scrollSnapList().length)
      }
      updateVisibleItems() // Atualiza itens visíveis no redimensionamento
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [api, updateVisibleItems])

  if (!barbershops?.length) {
    return (
      <div className="flex items-center justify-center px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground sm:text-base">
          Nenhuma barbearia encontrada
        </p>
      </div>
    )
  }

  return (
    <div className="group relative w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: false,
        }}
        plugins={[autoplayPlugin]}
        className="w-full"
      >
        <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-3 lg:-ml-4">
          {barbershops.map((barbershop) => (
            <CarouselItem
              key={barbershop.id}
              className={`pl-1 sm:pl-2 md:pl-3 lg:pl-4 ${className ?? ""}`}
            >
              <BarbershopItem barbershop={barbershop} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Setas de navegação */}
        {count > visibleItems && (
          <>
            <CarouselPrevious
              aria-label="Voltar slide"
              className="absolute left-[-12px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition hover:scale-105 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:left-[-16px] sm:flex md:left-[-20px] lg:left-[-24px]"
            />

            <CarouselNext
              aria-label="Avançar slide"
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition hover:scale-105 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </>
        )}
      </Carousel>

      {/* Indicadores (bolinhas) */}
      {count > visibleItems && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              aria-label={`Ir para slide ${index + 1}`}
              aria-current={current === index + 1 ? "true" : "false"}
              className={`h-2 w-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                current === index + 1
                  ? "scale-110 bg-primary"
                  : "bg-muted hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
