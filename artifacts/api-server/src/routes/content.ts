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

router.get("/surahs", async (_req, res) => {
  const rows = await db.select().from(surahsTable).orderBy(surahsTable.id);
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
