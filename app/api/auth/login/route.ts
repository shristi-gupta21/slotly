import prisma from "@/lib/prisma";
import { createSessionToken } from "@/lib/session";
import { registerSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/lib/validations/password";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: result.data.email,
      },
    });

    const verifyUserPassword = await verifyPassword(
      result.data.password,
      user?.passwordHash ?? "",
    );

    if (!user || !verifyUserPassword) {
      return NextResponse.json(
        {
          message: "Invalid email or password",
        },
        {
          status: 401,
        },
      );
    }

    const sessionToken = await createSessionToken({
      userId: user.id,
      role: user.role,
    });
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
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
        role: user.role,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
