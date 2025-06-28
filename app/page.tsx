import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import Image from "next/image"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getConfirmedBookings } from "./_data/get-confirmed-booking"
import { CarouselBarbershopItem } from "./_components/carousel-barbershop-item"

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
      <div className="mx-auto px-3 py-5 lg:p-5">
        {/*TEXTO*/}
        <h2 className="text-center text-lg font-bold lg:text-xl">
          Olá, {session?.user ? session.user.name : "Bem vindo"}
        </h2>
        <p className="text-center text-sm lg:text-base">
          <span className="capitalize">
            {format(new Date(), "EEEE, dd", { locale: ptBR })}
          </span>
          <span>&nbsp;de&nbsp;</span>
          <span className="capitalize">
            {format(new Date(), "MMMM", { locale: ptBR })}
          </span>
        </p>
        {/* BUSCA */}
        <div className="mt-4 lg:mt-6">
          <Search />
        </div>
        {/* BUSCA RÁPIDA */}
        <div className="mt-4 flex gap-2 overflow-x-auto lg:mt-6 lg:gap-3 [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => {
            return (
              <Button
                className="min-w-max gap-2"
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
                  <span className="text-xs lg:text-sm">{option.title}</span>
                </Link>
              </Button>
            )
          })}
        </div>
        {/* IMAGEM */}
        <div className="relative mt-4 h-[120px] w-full sm:h-[150px] lg:mt-6">
          <Image
            src="/banner01.png"
            fill
            className="rounded-xl object-cover"
            alt="Agende nos melhores com FSW Barber"
            sizes="(max-width: 640px) 100vw, 700px"
          />
        </div>

        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-2 mt-4 text-xs font-bold uppercase text-gray-400 lg:mb-3 lg:mt-6">
              Agendamentos
            </h2>
            {/* AGENDAMENTO*/}
            <div className="flex gap-2 overflow-x-auto lg:gap-3 [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}

        <h2 className="mb-2 mt-4 text-xs font-bold uppercase text-gray-400 lg:mb-3 lg:mt-6">
          Recomendados
        </h2>
        <div className="w-full">
          <CarouselBarbershopItem barbershops={barbershops} />
        </div>

        <h2 className="mb-2 mt-4 text-xs font-bold uppercase text-gray-400 lg:mb-3 lg:mt-6">
          Populares
        </h2>
        <div className="w-full">
          <CarouselBarbershopItem barbershops={popularBarbershops} />
        </div>
      </div>
    </div>
  )
}

export default Home
