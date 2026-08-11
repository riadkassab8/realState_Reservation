import { Router, type Request, type Response } from "express";
import { db, propertiesTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, or, desc, asc, sql } from "drizzle-orm";
import {
  ListPropertiesQueryParams,
  CreatePropertyBody,
  UpdatePropertyBody,
  GetPropertyParams,
  UpdatePropertyParams,
  DeletePropertyParams,
} from "@workspace/api-zod";

const router = Router();

// GET /properties
router.get("/properties", async (req: Request, res: Response) => {
  try {
    const query = ListPropertiesQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query parameters" });
      return;
    }

    const {
      type,
      category,
      country,
      city,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      featured,
      search,
      sortBy,
      page = 1,
      limit = 12,
    } = query.data;

    const conditions = [];

    if (type && type !== "all") {
      conditions.push(eq(propertiesTable.type, type));
    }
    if (category && category !== "all") {
      conditions.push(eq(propertiesTable.category, category));
    }
    if (country) {
      conditions.push(eq(propertiesTable.country, country));
    }
    if (city) {
      conditions.push(
        or(
          ilike(propertiesTable.city, `%${city}%`),
          ilike(propertiesTable.cityAr, `%${city}%`)
        )
      );
    }
    if (minPrice !== undefined) {
      conditions.push(gte(propertiesTable.price, String(minPrice)));
    }
    if (maxPrice !== undefined) {
      conditions.push(lte(propertiesTable.price, String(maxPrice)));
    }
    if (minArea !== undefined) {
      conditions.push(gte(propertiesTable.area, String(minArea)));
    }
    if (maxArea !== undefined) {
      conditions.push(lte(propertiesTable.area, String(maxArea)));
    }
    if (bedrooms !== undefined) {
      conditions.push(eq(propertiesTable.bedrooms, bedrooms));
    }
    if (bathrooms !== undefined) {
      conditions.push(eq(propertiesTable.bathrooms, bathrooms));
    }
    if (featured !== undefined) {
      conditions.push(eq(propertiesTable.featured, featured));
    }
    if (search) {
      conditions.push(
        or(
          ilike(propertiesTable.title, `%${search}%`),
          ilike(propertiesTable.titleAr, `%${search}%`),
          ilike(propertiesTable.city, `%${search}%`),
          ilike(propertiesTable.cityAr, `%${search}%`),
          ilike(propertiesTable.address, `%${search}%`)
        )
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (sortBy) {
      case "price_asc":
        orderBy = asc(sql`CAST(${propertiesTable.price} AS NUMERIC)`);
        break;
      case "price_desc":
        orderBy = desc(sql`CAST(${propertiesTable.price} AS NUMERIC)`);
        break;
      case "oldest":
        orderBy = asc(propertiesTable.createdAt);
        break;
      case "area_asc":
        orderBy = asc(sql`CAST(${propertiesTable.area} AS NUMERIC)`);
        break;
      case "area_desc":
        orderBy = desc(sql`CAST(${propertiesTable.area} AS NUMERIC)`);
        break;
      case "newest":
      default:
        orderBy = desc(propertiesTable.createdAt);
        break;
    }

    const offset = (page - 1) * limit;

    const [properties, totalResult] = await Promise.all([
      db
        .select()
        .from(propertiesTable)
        .where(where)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(propertiesTable)
        .where(where),
    ]);

    const total = Number(totalResult[0]?.count ?? 0);
    const totalPages = Math.ceil(total / limit);

    res.json({
      properties: properties.map(serialize),
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list properties");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /properties
router.post("/properties", async (req: Request, res: Response) => {
  try {
    const body = CreatePropertyBody.safeParse(req.body);
    if (!body.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const data = body.data;
    const [property] = await db
      .insert(propertiesTable)
      .values({
        title: data.title,
        titleAr: data.titleAr,
        description: data.description,
        descriptionAr: data.descriptionAr,
        type: data.type,
        category: data.category,
        price: String(data.price),
        priceUnit: data.priceUnit ?? "SAR",
        area: String(data.area),
        city: data.city,
        cityAr: data.cityAr,
        address: data.address,
        addressAr: data.addressAr,
        lat: String(data.lat),
        lng: String(data.lng),
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        images: data.images,
        featured: data.featured ?? false,
        amenities: data.amenities ?? [],
        amenitiesAr: data.amenitiesAr ?? [],
        yearBuilt: data.yearBuilt,
        floor: data.floor,
        totalFloors: data.totalFloors,
        parkingSpaces: data.parkingSpaces,
        agentName: data.agentName ?? "Realty Pro Agent",
        agentNameAr: data.agentNameAr ?? "وكيل ريالتي برو",
        agentPhone: data.agentPhone ?? "+966500000000",
        agentEmail: data.agentEmail ?? "agent@realtypro.sa",
      })
      .returning();

    res.status(201).json(serialize(property));
  } catch (err) {
    req.log.error({ err }, "Failed to create property");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /properties/featured — must be before /:id
router.get("/properties/featured", async (req: Request, res: Response) => {
  try {
    const properties = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.featured, true))
      .orderBy(desc(propertiesTable.createdAt))
      .limit(8);

    res.json(properties.map(serialize));
  } catch (err) {
    req.log.error({ err }, "Failed to get featured properties");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /properties/:id
router.get("/properties/:id", async (req: Request, res: Response) => {
  try {
    const params = GetPropertyParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [property] = await db
      .select()
      .from(propertiesTable)
      .where(eq(propertiesTable.id, params.data.id));

    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    res.json(serialize(property));
  } catch (err) {
    req.log.error({ err }, "Failed to get property");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /properties/:id
router.patch("/properties/:id", async (req: Request, res: Response) => {
  try {
    const params = UpdatePropertyParams.safeParse({ id: Number(req.params.id) });
    const body = UpdatePropertyBody.safeParse(req.body);

    if (!params.success || !body.success) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const updates: Record<string, unknown> = {};
    const d = body.data;
    if (d.title !== undefined) updates.title = d.title;
    if (d.titleAr !== undefined) updates.titleAr = d.titleAr;
    if (d.description !== undefined) updates.description = d.description;
    if (d.descriptionAr !== undefined) updates.descriptionAr = d.descriptionAr;
    if (d.price !== undefined) updates.price = String(d.price);
    if (d.featured !== undefined) updates.featured = d.featured;
    if (d.images !== undefined) updates.images = d.images;

    const [property] = await db
      .update(propertiesTable)
      .set(updates)
      .where(eq(propertiesTable.id, params.data.id))
      .returning();

    if (!property) {
      res.status(404).json({ error: "Property not found" });
      return;
    }

    res.json(serialize(property));
  } catch (err) {
    req.log.error({ err }, "Failed to update property");
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /properties/:id
router.delete("/properties/:id", async (req: Request, res: Response) => {
  try {
    const params = DeletePropertyParams.safeParse({ id: Number(req.params.id) });
    if (!params.success) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    await db.delete(propertiesTable).where(eq(propertiesTable.id, params.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete property");
    res.status(500).json({ error: "Internal server error" });
  }
});

function serialize(p: typeof propertiesTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    titleAr: p.titleAr,
    description: p.description,
    descriptionAr: p.descriptionAr,
    type: p.type,
    category: p.category,
    price: Number(p.price),
    priceUnit: p.priceUnit,
    area: Number(p.area),
    country: p.country,
    city: p.city,
    cityAr: p.cityAr,
    address: p.address,
    addressAr: p.addressAr,
    lat: Number(p.lat),
    lng: Number(p.lng),
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    images: p.images as string[],
    featured: p.featured,
    amenities: p.amenities as string[],
    amenitiesAr: p.amenitiesAr as string[],
    yearBuilt: p.yearBuilt,
    floor: p.floor,
    totalFloors: p.totalFloors,
    parkingSpaces: p.parkingSpaces,
    agentName: p.agentName,
    agentNameAr: p.agentNameAr,
    agentPhone: p.agentPhone,
    agentEmail: p.agentEmail,
    createdAt: p.createdAt.toISOString(),
  };
}

export default router;
