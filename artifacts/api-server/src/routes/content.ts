import { Router, type IRouter } from "express";
import {
  db,
  surahsTable,
  duasTable,
  azkarTable,
  ziyaratTable,
  wallpapersTable,
} from "@workspace/db";

const router: IRouter = Router();

router.use((_req, res, next) => {
  res.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60");
  next();
});

router.get("/surahs", async (_req, res) => {
  const rows = await db
    .select({
      id: surahsTable.id,
      slug: surahsTable.slug,
      number: surahsTable.number,
      name: surahsTable.name,
      english: surahsTable.english,
      verseCount: surahsTable.verseCount,
      revelationType: surahsTable.revelationType,
      excerpt: surahsTable.excerpt,
    })
    .from(surahsTable)
    .orderBy(surahsTable.id);
  res.json(rows);
});

router.get("/duas", async (_req, res) => {
  const rows = await db.select().from(duasTable).orderBy(duasTable.id);
  res.json(rows);
});

router.get("/azkar", async (_req, res) => {
  const rows = await db.select().from(azkarTable).orderBy(azkarTable.id);
  res.json(rows);
});

router.get("/ziyarat", async (_req, res) => {
  const rows = await db.select().from(ziyaratTable).orderBy(ziyaratTable.id);
  res.json(rows);
});

router.get("/wallpapers", async (_req, res) => {
  const rows = await db.select().from(wallpapersTable).orderBy(wallpapersTable.id);
  res.json(rows);
});

export default router;
