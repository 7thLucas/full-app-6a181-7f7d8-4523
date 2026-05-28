import { Router } from "express";
import {
  getSoldToday,
  postSale,
  postUndoSale,
  listPastries,
  createPastry,
  updatePastry,
  deletePastry,
  getOwnerSnapshot,
} from "./crumb.controller";
import { requireAuth, requireAdmin } from "~/modules/authentication/authentication.middleware";

const router = Router();

/* ── Sold-today (the hot path) — any signed-in staff ─────────────────── */
router.get("/crumb/sold-today", requireAuth, getSoldToday);
router.post("/crumb/sales", requireAuth, postSale);
router.post("/crumb/sales/:id/undo", requireAuth, postUndoSale);

/* ── Pastry catalog — read for staff, write for owner-admin ──────────── */
router.get("/crumb/pastries", requireAuth, listPastries);
router.post("/crumb/pastries", requireAdmin, createPastry);
router.patch("/crumb/pastries/:id", requireAdmin, updatePastry);
router.delete("/crumb/pastries/:id", requireAdmin, deletePastry);

/* ── Owner insight (admin only) ──────────────────────────────────────── */
router.get("/crumb/owner-snapshot", requireAdmin, getOwnerSnapshot);

export default router;
