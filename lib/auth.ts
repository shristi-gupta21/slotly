import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSessionToken, readSessionToken } from "@/lib/session";
import type { Role } from "@/app/generated/prisma/enums";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
};

type AuthSuccess = { user: SessionUser };
type AuthFailure = { response: NextResponse };
export type AuthResult = AuthSuccess | AuthFailure;

function unauthorized(message = "Unauthorized"): AuthFailure {
  return {
    response: NextResponse.json({ message }, { status: 401 }),
  };
}

function forbidden(message: string): AuthFailure {
  return {
    response: NextResponse.json({ message }, { status: 403 }),
  };
}

export async function getCurrentUser(): Promise<AuthResult> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) {
    return unauthorized();
  }

  let payload: { userId: string; role: string };
  try {
    payload = await readSessionToken(session.value);
  } catch {
    return unauthorized();
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    return unauthorized();
  }

  return { user };
}

export async function requireOrganiser(
  message = "Only organisers can do this",
): Promise<AuthResult> {
  const result = await getCurrentUser();
  if ("response" in result) {
    return result;
  }

  if (result.user.role !== "organiser") {
    return forbidden(message);
  }

  return result;
}

export async function setSessionCookie(user: SessionUser) {
  const cookieStore = await cookies();
  const token = await createSessionToken({
    userId: user.id,
    role: user.role,
  });

  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
