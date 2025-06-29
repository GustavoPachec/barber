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
    <Card className="min-w-[167px] rounded-2xl border shadow-md hover:shadow-lg sm:min-w-[200px] md:min-w-[250px] xl:min-w-[220px] 2xl:min-w-[180px]">
      <CardContent className="p-0 px-0.5 pt-0.5 sm:px-3 sm:pt-2">
        {/* IMAGEM */}
        <div className="relative h-[159px] w-full sm:h-[200px] md:h-[250px] xl:h-[160px] 2xl:h-[130px]">
          <Image
            alt={barbershop.name}
            fill
            className="rounded-2xl object-cover"
            src={barbershop.imageUrl}
          />

          <Badge
            className="absolute left-2 top-2 space-x-1"
            variant="secondary"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <p className="text-xs font-semibold">5,0</p>
          </Badge>
        </div>

        {/* TEXTO */}
        <div className="px-0.5 py-2 sm:px-3 sm:py-4">
          <h3 className="truncate text-base font-semibold sm:text-lg">
            {barbershop.name}
          </h3>
          <p className="truncate text-sm text-gray-400 sm:text-base">
            {barbershop.address}
          </p>
          <Button variant="secondary" className="mt-2 w-full sm:mt-4" asChild>
            <Link href={`/barbershops/${barbershop.id}`}>Reservar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
