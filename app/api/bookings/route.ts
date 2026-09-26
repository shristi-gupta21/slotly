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

export async function POST(request: Request){
    const currentUser = await getCurrentUser();

    if('response' in currentUser) {
        return currentUser.response;
    }

    const { eventId, seats, attendeeName, attendeeEmail } = await request.json();

    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });
    
    if(!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const booking = await prisma.booking.create({
        data: {
            eventId,
            userId: currentUser.user.id,
            seats,
            attendeeName,
            attendeeEmail,
        },
    });

    return NextResponse.json(booking);
}