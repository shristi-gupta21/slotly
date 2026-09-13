import { createPasswordResetToken } from "@/lib/password-reset";
import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { NextResponse } from "next/server";

const genericMessage =
  "If an account exists for that email, a reset token was created";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.pick({ email: true }).safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (!user) {
      return NextResponse.json({ message: genericMessage }, { status: 200 });
    }

    const { token, hash, expiresAt } = createPasswordResetToken();

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: hash,
        passwordResetExpiresAt: expiresAt,
      },
    });

    // token is returned only so you can test without email. Remove later.
    return NextResponse.json({ message: genericMessage, token }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
