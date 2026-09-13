import { createHash, randomBytes } from "node:crypto";

const RESET_TTL_MS = 15 * 60 * 1000;

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordResetToken() {
  const token = randomBytes(32).toString("hex");
  const hash = hashPasswordResetToken(token);
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);

  return { token, hash, expiresAt };
}
