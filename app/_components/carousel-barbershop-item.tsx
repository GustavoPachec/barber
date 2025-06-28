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
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)

  // Memoize the autoplay plugin to prevent unnecessary re-renders
  const autoplayPlugin = Autoplay({
    delay: 4000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  })

  const handleSelect = useCallback(() => {
    if (!api) return
    setCurrent(api.selectedScrollSnap() + 1)
  }, [api])

  const handleDotClick = useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  useEffect(() => {
    if (!api) return

    // Get the actual number of scroll snaps (pages/slides)
    const scrollSnapList = api.scrollSnapList()
    setCount(scrollSnapList.length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api, handleSelect])

  // Recalculate dots when window resizes (screen size changes)
  useEffect(() => {
    const handleResize = () => {
      if (api) {
        const scrollSnapList = api.scrollSnapList()
        setCount(scrollSnapList.length)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [api])

  // Early return for empty state
  if (!barbershops?.length) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <p>Nenhuma barbearia encontrada</p>
      </div>
    )
  }

  return (
    <div
      className={`relative ${className || ""}`}
      onMouseEnter={() => setIsAutoplayPaused(true)}
      onMouseLeave={() => setIsAutoplayPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: false,
        }}
        plugins={[autoplayPlugin]}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {barbershops.map((barbershop) => (
            <CarouselItem
              key={barbershop.id}
              className="xl: m-1 basis-1/2 pl-2 lg:basis-1/3 xl:basis-1/5"
            >
              <div className="p-2">
                <BarbershopItem barbershop={barbershop} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation buttons - only show if there are multiple items */}
        {count > 1 && (
          <>
            <CarouselPrevious className="left-2 top-1/2 hidden -translate-y-1/2 bg-primary shadow-md transition-colors hover:bg-primary/90 md:flex md:h-10 md:w-10 lg:h-12 lg:w-12" />
            <CarouselNext className="right-2 top-1/2 hidden -translate-y-1/2 bg-primary shadow-md transition-colors hover:bg-primary/90 md:flex md:h-10 md:w-10 lg:h-12 lg:w-12" />
          </>
        )}
      </Carousel>

      {/* Indicator dots - only show if there are multiple items */}
      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-200 hover:scale-110 ${
                current === index + 1
                  ? "scale-110 bg-primary"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Ir para slide ${index + 1} de ${count}`}
              aria-current={current === index + 1 ? "true" : "false"}
            />
          ))}
        </div>
      )}
    </div>
  )
}
