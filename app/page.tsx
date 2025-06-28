import Header from "./_components/header"
import Image from "next/image"
import { db } from "./_lib/prisma"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getConfirmedBookings } from "./_data/get-confirmed-booking"
import { CarouselBarbershopItem } from "./_components/carousel-barbershop-item"
import QuickSearch from "./_components/quick-search"

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
        {/*TEXTO BOAS VINDAS*/}
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
        <div>
          <QuickSearch />
        </div>

        {/* IMAGEM */}
        <div className="relative mt-4 h-[120px] w-full lg:mt-6 lg:h-[200px] xl:h-[280px]">
          <Image
            src="/banner01.png"
            fill
            className="rounded-xl object-cover"
            alt="Agende nos melhores com FSW Barber"
            sizes="(max-width: 640px) 100vw, 700px"
          />
        </div>

        {/* AGENDAMENTOS */}
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-2 mt-4 text-xs font-bold uppercase text-gray-400 lg:mb-3 lg:mt-6">
              Agendamentos
            </h2>
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
