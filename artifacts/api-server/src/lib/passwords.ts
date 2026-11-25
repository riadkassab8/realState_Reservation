import bcrypt from "bcryptjs";

// Cost factor 12: ~250ms per hash on a modern server.
// Slow on purpose: it makes guessing passwords offline expensive.
const BCRYPT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
