// Creates (or updates) the first ADMIN account. Regular signups always get
// the USER role, so the first admin has to come from somewhere trusted: here.
//
// Usage:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' \
//     npm run seed:admin --workspace=@workspace/api-server
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { hashPassword } from "./lib/passwords.js";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Admin";

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script.");
    process.exit(1);
  }
  if (password.length < 8 || password.length > 72) {
    console.error("ADMIN_PASSWORD must be 8-72 characters.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existing) {
    await db
      .update(usersTable)
      .set({ passwordHash, role: "ADMIN", name })
      .where(eq(usersTable.id, existing.id));
    console.log(`Updated existing account to ADMIN: ${email}`);
  } else {
    await db.insert(usersTable).values({ email, name, passwordHash, role: "ADMIN" });
    console.log(`Created ADMIN account: ${email}`);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
