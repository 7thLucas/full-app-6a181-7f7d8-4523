import type { Request, Response } from "express";
import { CrumbService } from "./crumb.service";
import { SaleChannel } from "./sale.model";

/* ────────────────────────────────────────────────────────────────────────
 * Response helpers (mirrors the project's standard {success, data} shape)
 * ──────────────────────────────────────────────────────────────────────── */

function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data });
}
function fail(res: Response, message: string, status = 400) {
  return res.status(status).json({ success: false, message });
}

/* ────────────────────────────────────────────────────────────────────────
 * Sold-today (the hot path)
 * ──────────────────────────────────────────────────────────────────────── */

export async function getSoldToday(_req: Request, res: Response) {
  try {
    const items = await CrumbService.getSoldToday();
    return ok(res, { items });
  } catch (err) {
    console.error("[Crumb] getSoldToday failed", err);
    return fail(res, "Failed to fetch sold-today", 500);
  }
}

export async function postSale(req: Request, res: Response) {
  try {
    const pastryId = String(req.body?.pastry_id ?? "").trim();
    if (!pastryId) return fail(res, "pastry_id is required", 400);

    const channelInput = String(req.body?.channel ?? "").trim();
    const channel =
      channelInput === SaleChannel.Phone || channelInput === SaleChannel.WalkIn
        ? (channelInput as SaleChannel)
        : SaleChannel.Counter;

    const result = await CrumbService.logSale({
      pastryId,
      channel,
      userId: req.user?.id,
    });
    return ok(res, result, 201);
  } catch (err) {
    console.error("[Crumb] postSale failed", err);
    return fail(res, "Failed to log sale", 500);
  }
}

export async function postUndoSale(req: Request, res: Response) {
  try {
    const saleId = String(req.params?.id ?? "").trim();
    if (!saleId) return fail(res, "sale id is required", 400);
    const success = await CrumbService.undoSale(saleId);
    if (!success) return fail(res, "Sale not found or already undone", 404);
    return ok(res, { undone: true });
  } catch (err) {
    console.error("[Crumb] postUndoSale failed", err);
    return fail(res, "Failed to undo sale", 500);
  }
}

/* ────────────────────────────────────────────────────────────────────────
 * Pastry catalog
 * ──────────────────────────────────────────────────────────────────────── */

export async function listPastries(_req: Request, res: Response) {
  try {
    const items = await CrumbService.listPastries();
    return ok(res, { items });
  } catch (err) {
    console.error("[Crumb] listPastries failed", err);
    return fail(res, "Failed to fetch pastries", 500);
  }
}

export async function createPastry(req: Request, res: Response) {
  try {
    const name = String(req.body?.name ?? "").trim();
    if (!name) return fail(res, "name is required", 400);
    const photoUrl = req.body?.photo_url ? String(req.body.photo_url) : "";
    const emoji = req.body?.emoji ? String(req.body.emoji) : "";
    const created = await CrumbService.createPastry({ name, photoUrl, emoji });
    return ok(res, created, 201);
  } catch (err) {
    console.error("[Crumb] createPastry failed", err);
    return fail(res, "Failed to create pastry", 500);
  }
}

export async function updatePastry(req: Request, res: Response) {
  try {
    const id = String(req.params?.id ?? "").trim();
    if (!id) return fail(res, "id is required", 400);
    const patch: { name?: string; photoUrl?: string; emoji?: string; isArchived?: boolean } = {};
    if (req.body?.name !== undefined) patch.name = String(req.body.name);
    if (req.body?.photo_url !== undefined) patch.photoUrl = String(req.body.photo_url);
    if (req.body?.emoji !== undefined) patch.emoji = String(req.body.emoji);
    if (req.body?.is_archived !== undefined) patch.isArchived = !!req.body.is_archived;
    const updated = await CrumbService.updatePastry(id, patch);
    if (!updated) return fail(res, "Pastry not found", 404);
    return ok(res, updated);
  } catch (err) {
    console.error("[Crumb] updatePastry failed", err);
    return fail(res, "Failed to update pastry", 500);
  }
}

export async function deletePastry(req: Request, res: Response) {
  try {
    const id = String(req.params?.id ?? "").trim();
    if (!id) return fail(res, "id is required", 400);
    const success = await CrumbService.deletePastry(id);
    if (!success) return fail(res, "Pastry not found", 404);
    return ok(res, { archived: true });
  } catch (err) {
    console.error("[Crumb] deletePastry failed", err);
    return fail(res, "Failed to delete pastry", 500);
  }
}

/* ────────────────────────────────────────────────────────────────────────
 * Owner insight
 * ──────────────────────────────────────────────────────────────────────── */

export async function getOwnerSnapshot(_req: Request, res: Response) {
  try {
    const snapshot = await CrumbService.getOwnerSnapshot();
    return ok(res, snapshot);
  } catch (err) {
    console.error("[Crumb] getOwnerSnapshot failed", err);
    return fail(res, "Failed to fetch owner snapshot", 500);
  }
}
