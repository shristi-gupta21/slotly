import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword } from "@/lib/validations/password";
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

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return NextResponse.json(
        {
          message: "User already exists",
        },
        {
          status: 409,
        },
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
      },
    });

    return NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      {
        status: 201,
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
