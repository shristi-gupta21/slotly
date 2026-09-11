import { requireOrganiser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { fieldErrorsFromZod, patchEventSchema } from "@/lib/validations/events";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const result = await prisma.event.findUnique({
    where: { id },
  });

  if (!result) {
    return NextResponse.json(
      {
        message: "Event not found",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json(result, { status: 200 });
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    const auth = await requireOrganiser("Only organisers can update events");
    if ("response" in auth) {
      return auth.response;
    }

    const body = await request.json();
    const result = patchEventSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          fieldErrors: fieldErrorsFromZod(result.error),
        },
        { status: 400 },
      );
    }



    const data: {
      name?: string;
      genre?: typeof result.data.genre;
      capacity?: number;
      city?: typeof result.data.eventCity;
      venue?: string;
      date?: Date;
      time?: Date;
      contactName?: string;
      phone?: string;
      email?: string;
      description?: string | null;
    } = {};

    if (result.data.eventName !== undefined) data.name = result.data.eventName;
    if (result.data.genre !== undefined) data.genre = result.data.genre;
    if (result.data.capacity !== undefined)
      data.capacity = result.data.capacity;
    if (result.data.eventCity !== undefined) data.city = result.data.eventCity;
    if (result.data.venue !== undefined) data.venue = result.data.venue;
    if (result.data.date !== undefined) data.date = new Date(result.data.date);
    if (result.data.time !== undefined) {
      data.time = new Date(`1970-01-01T${result.data.time}`);
    }
    if (result.data.contactName !== undefined)
      data.contactName = result.data.contactName;
    if (result.data.phone !== undefined) data.phone = result.data.phone;
    if (result.data.email !== undefined) data.email = result.data.email;
    if (result.data.description !== undefined)
      data.description = result.data.description;

    const eventResult = await prisma.event.findUnique({ where: { id } });

    if (!eventResult) {
      return NextResponse.json(
        {
          message: "Event not found",
        },
        { status: 404 },
      );
    }

    if (
      eventResult.organiserId &&
      eventResult.organiserId !== auth.user.id
    ) {
      return NextResponse.json(
        { message: "Only the event organiser can update this event" },
        { status: 403 },
      );
    }

    const event = await prisma.event.update({ where: { id }, data });

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Please try again later",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    const auth = await requireOrganiser("Only organisers can delete events");
    if ("response" in auth) {
      return auth.response;
    }

    const eventResult = await prisma.event.findUnique({ where: { id } });
    if (!eventResult) {
      return NextResponse.json(
        {
          message: "Event not found",
        },
        { status: 404 },
      );
    }

    if (
      eventResult.organiserId &&
      eventResult.organiserId !== auth.user.id
    ) {
      return NextResponse.json(
        { message: "Only the event organiser can delete this event" },
        { status: 403 },
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Please try again later",
      },
      { status: 500 },
    );
  }
}
