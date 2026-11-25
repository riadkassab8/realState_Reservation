import jwt from "jsonwebtoken";

export type AuthRole = "ADMIN" | "SUPERVISOR" | "USER" | "MERCHANT";

export interface AuthTokenPayload {
  userId: number;
  role: AuthRole;
}

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const AUTH_ROLES: readonly AuthRole[] = ["ADMIN", "SUPERVISOR", "USER", "MERCHANT"];

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set to a random string of at least 32 characters.",
    );
  }
  return secret;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(
    { userId: payload.userId, role: payload.role },
    getJwtSecret(),
    { algorithm: "HS256", expiresIn: TOKEN_TTL_SECONDS },
  );
}

// Returns the payload only when the signature is valid, the token is not
// expired, and the claims have the expected shape. Any failure -> null.
export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
    if (typeof decoded === "string") return null;
    const { userId, role } = decoded as Record<string, unknown>;
    if (
      typeof userId !== "number" ||
      typeof role !== "string" ||
      !AUTH_ROLES.includes(role as AuthRole)
    ) {
      return null;
    }
    return { userId, role: role as AuthRole };
  } catch {
    return null;
  }
}
