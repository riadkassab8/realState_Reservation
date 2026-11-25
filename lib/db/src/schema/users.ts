import { pgTable, pgEnum, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Roles mirror the frontend UserRole union (artifacts/realty-pro/src/auth/auth.types.ts).
export const userRoleEnum = pgEnum("user_role", ["ADMIN", "SUPERVISOR", "USER", "MERCHANT"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("USER"),
  // bcrypt hash (60 chars). The plain password is never stored.
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type DbUser = typeof usersTable.$inferSelect;
