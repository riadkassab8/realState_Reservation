import { Router, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, usersTable } from "@workspace/db";
import { hashPassword, verifyPassword } from "../lib/passwords.js";
import { signAuthToken } from "../lib/auth-tokens.js";
import { requireAuth, getSessionUser } from "../middlewares/auth.js";

const router = Router();

// bcrypt only reads the first 72 bytes of a password, so longer ones give a
// false sense of extra strength. 8..72 keeps that honest.
const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().max(254).email(),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().max(254).email(),
  password: z.string().min(1).max(72),
});

// Precomputed bcrypt hash of a random throwaway string. Compared against when
// the email is unknown so the response time is the same whether or not the
// account exists (timing attacks should not reveal registered emails).
const DUMMY_HASH = "$2b$12$qTNLrP8t1z8K5J8ZtOQdZeX9eN36LmNj26CdRFELMNnSWuwKXhGki";

function publicUser(u: { id: number; email: string; name: string; role: string }) {
  // Never return passwordHash to the client.
  return { id: u.id, email: u.email, name: u.name, role: u.role };
}

// POST /auth/register — public signup, always creates a plain USER.
// The role is never taken from the request body: letting the caller choose
// their role would let anyone register as ADMIN.
router.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid registration data" });
      return;
    }

    const email = parsed.data.email.toLowerCase();
    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const [user] = await db
      .insert(usersTable)
      .values({ email, name: parsed.data.name, passwordHash, role: "USER" })
      .returning();

    const token = signAuthToken({ userId: user.id, role: user.role });
    res.status(201).json({ user: publicUser(user), token });
  } catch (err) {
    req.log.error({ err }, "Failed to register user");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/login — verifies email + password, returns a signed token.
router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid login data" });
      return;
    }

    const email = parsed.data.email.toLowerCase();
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    // Run bcrypt either way so unknown emails take as long as wrong passwords.
    const ok = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signAuthToken({ userId: user.id, role: user.role });
    res.json({ user: publicUser(user), token });
  } catch (err) {
    req.log.error({ err }, "Failed to log in");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /auth/me — who the current token belongs to.
router.get("/auth/me", requireAuth, async (_req: Request, res: Response): Promise<void> => {
  res.json({ user: getSessionUser(res) });
});

// POST /auth/logout — tokens are stateless, so logout means the client
// deletes its token. This endpoint exists so the frontend has a clean API
// call to make (and a place to add token revocation later).
router.post("/auth/logout", (_req: Request, res: Response): void => {
  res.json({ ok: true });
});

export default router;
