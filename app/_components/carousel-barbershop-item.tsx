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
    const handleResize = () => {
      if (api) {
        setCount(api.scrollSnapList().length)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [api])

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

        {/* Setas - apenas em telas maiores, aparecem no hover */}
        {count > 1 && (
          <>
            <CarouselPrevious
              aria-label="Voltar slide"
              className="absolute left-[-12px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition hover:scale-105 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:left-[-16px] sm:flex md:left-[-20px] lg:left-[-24px]"
            />

            <CarouselNext
              aria-label="Avançar slide"
              className="absolute right-[-12px] top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-md transition hover:scale-105 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:right-[-16px] sm:flex md:right-[-20px] lg:right-[-24px]"
            />
          </>
        )}
      </Carousel>

      {/* Indicadores */}
      {count > 1 && (
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
