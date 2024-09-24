"use server"

import { db } from "../_lib/prisma"

interface CreateBoakingParams {
  userId: string
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBoakingParams) => {
  await db.booking.create({
    data: params,
  })
}
