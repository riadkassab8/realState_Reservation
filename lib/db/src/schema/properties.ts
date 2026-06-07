import { pgTable, serial, text, numeric, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const propertiesTable = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  type: text("type").notNull(), // sale | rent
  category: text("category").notNull(), // apartment | villa | office | land | commercial
  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  priceUnit: text("price_unit").default("SAR"),
  country: text("country").notNull().default("Saudi Arabia"),
  area: numeric("area", { precision: 10, scale: 2 }).notNull(),
  city: text("city").notNull(),
  cityAr: text("city_ar").notNull(),
  address: text("address").notNull(),
  addressAr: text("address_ar").notNull(),
  lat: numeric("lat", { precision: 10, scale: 6 }).notNull(),
  lng: numeric("lng", { precision: 10, scale: 6 }).notNull(),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  images: json("images").$type<string[]>().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  amenities: json("amenities").$type<string[]>().notNull().default([]),
  amenitiesAr: json("amenities_ar").$type<string[]>().notNull().default([]),
  yearBuilt: integer("year_built"),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  parkingSpaces: integer("parking_spaces"),
  agentName: text("agent_name").notNull().default("Realty Pro Agent"),
  agentNameAr: text("agent_name_ar").notNull().default("وكيل ريالتي برو"),
  agentPhone: text("agent_phone").notNull().default("+966500000000"),
  agentEmail: text("agent_email").notNull().default("agent@realtypro.sa"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const favoritesTable = pgTable("favorites", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => propertiesTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPropertySchema = createInsertSchema(propertiesTable).omit({ id: true, createdAt: true });
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof propertiesTable.$inferSelect;

export const insertFavoriteSchema = createInsertSchema(favoritesTable).omit({ id: true, createdAt: true });
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favoritesTable.$inferSelect;
