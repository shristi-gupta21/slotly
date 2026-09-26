import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUser = await getCurrentUser();

  if ("response" in currentUser) {
    return currentUser.response;
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: currentUser.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: { event: true },
  });

  return NextResponse.json(bookings);
}
