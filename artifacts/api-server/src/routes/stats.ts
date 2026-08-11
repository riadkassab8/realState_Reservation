import { Router, type Request, type Response } from "express";
import { db, propertiesTable } from "@workspace/db";
import { eq, sql, gte } from "drizzle-orm";

const router = Router();

// GET /stats/summary
router.get("/stats/summary", async (req: Request, res: Response) => {
  try {
    const [totals] = await db
      .select({
        total: sql<number>`count(*)`,
        forSale: sql<number>`count(*) filter (where ${propertiesTable.type} = 'sale')`,
        forRent: sql<number>`count(*) filter (where ${propertiesTable.type} = 'rent')`,
        avgPriceSale: sql<number>`avg(CAST(${propertiesTable.price} AS NUMERIC)) filter (where ${propertiesTable.type} = 'sale')`,
        avgPriceRent: sql<number>`avg(CAST(${propertiesTable.price} AS NUMERIC)) filter (where ${propertiesTable.type} = 'rent')`,
        totalCities: sql<number>`count(distinct ${propertiesTable.city})`,
      })
      .from(propertiesTable);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [newThisMonthResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(propertiesTable)
      .where(gte(propertiesTable.createdAt, startOfMonth));

    res.json({
      totalProperties: Number(totals.total),
      forSale: Number(totals.forSale),
      forRent: Number(totals.forRent),
      avgPriceSale: Math.round(Number(totals.avgPriceSale ?? 0)),
      avgPriceRent: Math.round(Number(totals.avgPriceRent ?? 0)),
      totalCities: Number(totals.totalCities),
      newThisMonth: Number(newThisMonthResult.count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /stats/cities
router.get("/stats/cities", async (req: Request, res: Response) => {
  try {
    const cities = await db
      .select({
        city: propertiesTable.city,
        cityAr: propertiesTable.cityAr,
        count: sql<number>`count(*)`,
      })
      .from(propertiesTable)
      .groupBy(propertiesTable.city, propertiesTable.cityAr)
      .orderBy(sql`count(*) desc`);

    res.json(cities.map((c) => ({ city: c.city, cityAr: c.cityAr, count: Number(c.count) })));
  } catch (err) {
    req.log.error({ err }, "Failed to get city stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
