import prisma from "@/lib/prisma";
import {
  createEventSchema,
  fieldErrorsFromZod,
} from "@/lib/validations/events";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createEventSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { fieldErrors: fieldErrorsFromZod(result.error) },
        { status: 400 },
      );
    }

    const event = await prisma.event.create({
      data: {
        name: result.data.eventName,
        genre: result.data.genre,
        capacity: result.data.capacity,
        city: result.data.eventCity,
        venue: result.data.venue,
        date: new Date(result.data.date),
        time: new Date(`1970-01-01T${result.data.time}`),
        contactName: result.data.contactName,
        phone: result.data.phone,
        email: result.data.email,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch(error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Please try again later",
      },
      { status: 500 },
    );
  }
}
