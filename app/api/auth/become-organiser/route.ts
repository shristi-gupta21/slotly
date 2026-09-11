import { getCurrentUser, setSessionCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const auth = await getCurrentUser();
    if ("response" in auth) {
      return auth.response;
    }

    const { user } = auth;

    if (user.role === "organiser") {
      return NextResponse.json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: "organiser" },
      select: { id: true, email: true, role: true },
    });

    await setSessionCookie(updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
