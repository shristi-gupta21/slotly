import prisma from "@/lib/prisma";
import { createSessionToken, readSessionToken } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let payload: { userId: string; role: string };
    try {
      payload = await readSessionToken(session.value);
    } catch {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role === "organiser") {
      return NextResponse.json(
        { message: "User is already an organiser" },
        { status: 200 },
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: "organiser",
      },
    });

    const token = await createSessionToken({
      userId: user.id,
      role: "organiser",
    });
    cookieStore.set(
      "session",
      await createSessionToken({ userId: user.id, role: "organiser" }),
    );
    
    cookieStore.set("session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        role: "organiser",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
