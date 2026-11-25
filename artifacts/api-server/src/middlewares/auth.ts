import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { verifyAuthToken, type AuthRole } from "../lib/auth-tokens.js";

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  role: AuthRole;
}

// Verifies the "Authorization: Bearer <token>" header, loads the user from the
// database (so deleted accounts lose access immediately), and stores it on
// res.locals.user for the route handler.
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing or malformed Authorization header" });
      return;
    }

    const payload = verifyAuthToken(header.slice("Bearer ".length).trim());
    if (!payload) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    const [user] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        name: usersTable.name,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, payload.userId));

    if (!user) {
      res.status(401).json({ error: "Account no longer exists" });
      return;
    }

    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function getSessionUser(res: Response): SessionUser {
  return res.locals.user as SessionUser;
}

// Use after requireAuth. ADMIN always passes (it has every permission in the
// frontend permissions map too). Call with no roles to require ADMIN only.
export function requireRole(...roles: AuthRole[]) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user as SessionUser | undefined;
    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    if (user.role !== "ADMIN" && !roles.includes(user.role)) {
      res.status(403).json({ error: "You do not have permission to perform this action" });
      return;
    }
    next();
  };
}
