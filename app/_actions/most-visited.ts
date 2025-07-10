import { db } from "../_lib/prisma"

export const mostVisitedBarbershops = async () => {
  const mostVisited = await db.booking.groupBy({
    by: ["serviceId"],
    _count: {
      serviceId: true,
    },
  })

  // Pega os dados dos serviços e barbearias relacionados
  const services = await db.barbershopService.findMany({
    where: {
      id: {
        in: mostVisited.map((item) => item.serviceId),
      },
    },
    include: {
      barbershop: true,
    },
  })

  // Agrupa por barbearia e soma os agendamentos
  const visitedForBarbershop: Record<
    string,
    { barbershop: any; count: number }
  > = {}

  for (const items of mostVisited) {
    const service = services.find((service) => service.id === items.serviceId)
    if (!service) continue

    const barbershopId = service.barbershop.id
    if (!visitedForBarbershop[barbershopId]) {
      visitedForBarbershop[barbershopId] = {
        barbershop: service.barbershop,
        count: 0,
      }
    }
    visitedForBarbershop[barbershopId].count += items._count.serviceId
  }

  // Transforma em array, ordena e retorna os dados completos das barbearias
  const topBarbershops = Object.values(visitedForBarbershop)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((item) => item.barbershop) // retorna apenas os dados da barbearia

  return topBarbershops
}
