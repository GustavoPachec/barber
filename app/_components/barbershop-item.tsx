import { Barbershop } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { StarIcon } from "lucide-react"
import Link from "next/link"

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="w-full min-w-[160px] max-w-[280px] rounded-2xl border shadow-md transition-shadow duration-200 hover:shadow-lg sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] xl:min-w-[200px] 2xl:min-w-[180px]">
      <CardContent className="p-0 px-1 pt-1 sm:px-2 sm:pt-2">
        {/* IMAGEM */}
        <div className="relative h-[140px] w-full sm:h-[160px] md:h-[180px] lg:h-[200px] xl:h-[160px] 2xl:h-[140px]">
          <Image
            alt={barbershop.name}
            fill
            className="rounded-2xl object-cover"
            src={barbershop.imageUrl}
            sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 200px, (max-width: 1280px) 220px, 200px"
          />

          <Badge
            className="absolute left-2 top-2 space-x-1 text-xs"
            variant="secondary"
          >
            <StarIcon size={10} className="fill-primary text-primary" />
            <span className="text-xs font-semibold">5,0</span>
          </Badge>
        </div>

        {/* TEXTO */}
        <div className="px-1 py-2 sm:px-2 sm:py-3">
          <h3 className="truncate text-sm font-semibold sm:text-base lg:text-lg">
            {barbershop.name}
          </h3>
          <p className="truncate text-xs text-gray-400 sm:text-sm md:text-base">
            {barbershop.address}
          </p>
          <Button
            variant="secondary"
            className="mt-2 w-full text-xs sm:mt-3 sm:text-sm"
            asChild
          >
            <Link href={`/barbershops/${barbershop.id}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
