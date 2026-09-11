import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await getCurrentUser();
  if ("response" in auth) {
    return auth.response;
  }

  return NextResponse.json({
    id: auth.user.id,
    email: auth.user.email,
    role: auth.user.role,
  });
}
