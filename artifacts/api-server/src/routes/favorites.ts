import { Router } from "express";
import { db, favoritesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AddFavoriteBody, RemoveFavoriteBody } from "@workspace/api-zod";

const router = Router();

// GET /favorites
router.get("/favorites", async (req, res) => {
  try {
    const favorites = await db.select().from(favoritesTable);
    res.json(favorites.map((f) => f.propertyId));
  } catch (err) {
    req.log.error({ err }, "Failed to list favorites");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /favorites
router.post("/favorites", async (req, res) => {
  try {
    const body = AddFavoriteBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const existing = await db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.propertyId, body.data.propertyId));

    if (existing.length === 0) {
      await db.insert(favoritesTable).values({ propertyId: body.data.propertyId });
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to add favorite");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /favorites
router.delete("/favorites", async (req, res) => {
  try {
    const body = RemoveFavoriteBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    await db.delete(favoritesTable).where(eq(favoritesTable.propertyId, body.data.propertyId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to remove favorite");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
