import { pgTable, serial, text, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// ---------------------------------------------------------------------------
// Quran surahs
// ---------------------------------------------------------------------------

export const surahsTable = pgTable("surahs", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // e.g. "surah-36"
  number: text("number").notNull(), // Arabic-Indic numeral, e.g. "٣٦"
  name: text("name").notNull(), // Arabic name, e.g. "يس"
  english: text("english").notNull(), // e.g. "Ya-Sin"
  verseCount: integer("verse_count").notNull(),
  revelationType: text("revelation_type").notNull(), // "مكية" | "مدنية"
  excerpt: text("excerpt").notNull(), // opening verse shown in the index
  verses: jsonb("verses").$type<string[]>().notNull().default([]), // reader verses, in order
});

export const insertSurahSchema = createInsertSchema(surahsTable).omit({ id: true });
export const selectSurahSchema = createSelectSchema(surahsTable);
export type InsertSurah = typeof surahsTable.$inferInsert;
export type Surah = typeof surahsTable.$inferSelect;

// ---------------------------------------------------------------------------
// Duas
// ---------------------------------------------------------------------------

export const duasTable = pgTable("duas", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(), // e.g. "dua-morning"
  category: text("category").notNull(), // "الصباح" | "المساء" | "الصلاة"
  title: text("title").notNull(),
  body: text("body").notNull(),
  count: text("count").notNull(), // display text, e.g. "٣ مرات"
});

export const insertDuaSchema = createInsertSchema(duasTable).omit({ id: true });
export const selectDuaSchema = createSelectSchema(duasTable);
export type InsertDua = typeof duasTable.$inferInsert;
export type Dua = typeof duasTable.$inferSelect;

// ---------------------------------------------------------------------------
// Azkar
// ---------------------------------------------------------------------------

export const azkarTable = pgTable("azkar", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // "الصباح" | "المساء" | "بعد الصلاة"
  title: text("title").notNull(),
  body: text("body").notNull(),
  count: text("count").notNull(),
});

export const insertAzkarSchema = createInsertSchema(azkarTable).omit({ id: true });
export const selectAzkarSchema = createSelectSchema(azkarTable);
export type InsertAzkar = typeof azkarTable.$inferInsert;
export type Azkar = typeof azkarTable.$inferSelect;

// ---------------------------------------------------------------------------
// Ziyarat
// ---------------------------------------------------------------------------

export const ziyaratTable = pgTable("ziyarat", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // "عامة" | "أيام الأسبوع"
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body"), // full text, optional for now
});

export const insertZiyaratSchema = createInsertSchema(ziyaratTable).omit({ id: true });
export const selectZiyaratSchema = createSelectSchema(ziyaratTable);
export type InsertZiyarat = typeof ziyaratTable.$inferInsert;
export type Ziyarat = typeof ziyaratTable.$inferSelect;

// ---------------------------------------------------------------------------
// Wallpapers
// ---------------------------------------------------------------------------

export const wallpapersTable = pgTable("wallpapers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(), // "المراقد المقدسة" | "مناسبات"
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertWallpaperSchema = createInsertSchema(wallpapersTable).omit({ id: true });
export const selectWallpaperSchema = createSelectSchema(wallpapersTable);
export type InsertWallpaper = typeof wallpapersTable.$inferInsert;
export type Wallpaper = typeof wallpapersTable.$inferSelect;
