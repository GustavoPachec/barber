import { SearchIcon } from "lucide-react"
import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import Image from "next/image"
import { Card, CardContent } from "./_components/ui/card"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import {} from "date-fns"
import { ptBR } from "date-fns/locale"
import { getConfirmedBookings } from "./_data/get-confirmed-booking"

const Home = async () => {
  // chamar o banco de dados
  const session = await getServerSession(authOptions)
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "asc",
    },
  })
  const confirmedBookings = await getConfirmedBookings()

  return (
    <div>
      {/*HEADER*/}
      <Header />
      <div className="p-5">
        {/*TEXTO*/}
        <h2 className="text-xl font-bold">
          Olá, {session?.user ? session.user.name : "Bem vindo"}
        </h2>
        <p>
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>
        {/* BUSCA */}
        <div className="mt-6">
          <Search />
        </div>
        {/* BUSCA RÁPIDA */}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => {
            return (
              <Button
                className="gap-2"
                variant="secondary"
                key={option.title}
                asChild
              >
                <Link href={`/barbershops?service=${option.title}`}>
                  <Image
                    src={option.imageURL}
                    width={16}
                    height={16}
                    alt={option.title}
                  />
                  {option.title}
                </Link>
              </Button>
            )
          })}
        </div>
        {/* IMAGEM */}
        <div className="relative mt-6 h-[150px] w-full">
          <Image
            src="/banner01.png"
            fill
            className="rounded-xl object-cover"
            alt="Agende nos melhores com FSW Barber"
          />
        </div>

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
              Agendamentos
            </h2>

            {/* AGENDAMENTO*/}
            <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}

        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Recomendados
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
        <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {popularBarbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
