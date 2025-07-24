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
import { mostVisitedBarbershops } from "./_actions/most-visited"

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
  const mostVisitedBarbershop = await mostVisitedBarbershops()

  return (
    <div>
      {/*HEADER*/}
      <Header />
      <div className="mx-auto max-w-7xl px-3 py-5 lg:p-8">
        <div className="flex min-h-[340px] flex-col gap-8 lg:flex-row xl:min-h-[260px] xl:gap-16">
          {/* Esquerda */}
          <div className="flex w-full flex-col justify-between lg:w-2/5 xl:w-2/3">
            <div>
              <h2 className="text-lg font-bold md:text-center lg:text-left xl:text-2xl">
                Olá, {session?.user ? session.user.name : "Bem vindo"}
              </h2>
              <p className="text-sm sm:text-left md:text-center lg:text-left xl:text-base">
                <span className="capitalize">
                  {format(new Date(), "EEEE, dd", { locale: ptBR })}
                </span>
                <span>&nbsp;de&nbsp;</span>
                <span className="capitalize">
                  {format(new Date(), "MMMM", { locale: ptBR })}
                </span>
              </p>
              {/* BUSCA */}
              <div className="mt-6 sm:mt-8 xl:mt-8">
                <Search />
              </div>
              {/* BUSCA RAPIDA */}
              <div className="mt-2 lg:hidden xl:mt-4">
                <QuickSearch />
              </div>
            </div>
            {/* Banner */}
            <div className="relative mt-6 flex h-[120px] w-full items-end md:hidden lg:hidden xl:mt-0 xl:hidden xl:h-[180px] 2xl:hidden">
              <Image
                src="/banner01.png"
                fill
                className="rounded-xl object-cover"
                alt="Agende nos melhores com FSW Barber"
                sizes="(max-width: 640px) 100vw, 350px"
              />
            </div>
            {/* AGENDAMENTOS */}
            {confirmedBookings.length > 0 && (
              <div className="mt-6 xl:mt-10">
                <h2 className="mb-2 text-xs font-bold uppercase text-gray-400 xl:mb-3">
                  Agendamentos
                </h2>
                <div className="flex gap-2 overflow-x-auto xl:gap-3 [&::-webkit-scrollbar]:hidden">
                  {confirmedBookings.map((booking) => (
                    <BookingItem key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Direita */}
          <div className="flex w-full flex-col justify-end lg:w-3/5 xl:w-2/3 xl:pl-12">
            <h2 className="mb-2 mt-0 text-xs font-bold uppercase text-gray-400 xl:mb-3">
              Recomendados
            </h2>
            <div className="flex h-full w-full flex-col justify-end">
              <CarouselBarbershopItem
                barbershops={barbershops}
                className="basis-auto sm:w-1/3 lg:basis-1/2 xl:basis-1/3"
              />
            </div>
          </div>
        </div>

        {/* Populares */}
        <div className="mt-8 sm:mt-12 xl:mt-20">
          <h2 className="mb-2 mt-4 px-1 text-xs font-bold uppercase text-gray-400 xl:mb-3 xl:mt-6">
            Populares
          </h2>
          <div className="w-full">
            <CarouselBarbershopItem
              barbershops={popularBarbershops}
              className="basis-auto sm:w-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/5"
            />
          </div>
        </div>

        {/* MAIS VISITADAS*/}
        <div className="mt-8 sm:mt-12 xl:mt-20">
          <h2 className="mb-2 mt-4 px-1 text-xs font-bold uppercase text-gray-400 xl:mb-3 xl:mt-6">
            Mais Visitadas
          </h2>
          <div className="w-full">
            {mostVisitedBarbershop.length > 0 ? (
              <CarouselBarbershopItem
                barbershops={mostVisitedBarbershop}
                className="basis-auto sm:w-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/5"
              />
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg bg-gray-50 sm:h-40 md:h-48 lg:h-56 xl:h-64">
                <div className="px-4 text-center">
                  <p className="text-sm text-gray-500 sm:text-base">
                    Nenhuma barbearia visitada ainda.
                  </p>
                  <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                    Faça seu primeiro agendamento para ver suas favoritas!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
