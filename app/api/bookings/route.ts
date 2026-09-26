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

export async function POST(request: Request) {
    const currentUser = await getCurrentUser();
    if ("response" in currentUser) {
      return currentUser.response;
    }
  
    const { eventId, seats, attendeeName, attendeeEmail } = await request.json();
  
    try {
      const booking = await prisma.$transaction(async (tx) => {
        const event = await tx.event.findUnique({ where: { id: eventId } });
        if (!event) {
          throw new Error("NOT_FOUND");
        }
  
        const { _sum } = await tx.booking.aggregate({
          where: { eventId },
          _sum: { seats: true },
        });
        const taken = _sum.seats ?? 0;
  
        if (taken + seats > event.capacity) {
          throw new Error("OVER_CAPACITY");
        }
  
        return tx.booking.create({
          data: {
            eventId,
            userId: currentUser.user.id,
            seats,
            attendeeName,
            attendeeEmail,
          },
        });
      });
  
      return NextResponse.json(booking, { status: 201 });
    } catch (error) {
      if (error instanceof Error && error.message === "NOT_FOUND") {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      if (error instanceof Error && error.message === "OVER_CAPACITY") {
        return NextResponse.json(
          { error: "Not enough seats available" },
          { status: 400 },
        );
      }
      console.error(error);
      return NextResponse.json(
        { message: "Please try again later" },
        { status: 500 },
      );
    }
  }