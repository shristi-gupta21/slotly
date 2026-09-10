import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function createSessionToken(input: {
  userId: string;
  role: string;
}) {
  return new SignJWT(input)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function readSessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as { userId: string; role: string };
}
