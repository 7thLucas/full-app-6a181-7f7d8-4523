import { PastryModel, type Pastry } from "./pastry.model";
import { SaleModel, SaleChannel, type Sale } from "./sale.model";
import type { DocumentType } from "@typegoose/typegoose";

/* ────────────────────────────────────────────────────────────────────────
 * Public DTO shapes
 * ──────────────────────────────────────────────────────────────────────── */

export interface PublicPastry {
  id: string;
  name: string;
  photo_url: string;
  emoji: string;
  display_order: number;
  is_archived: boolean;
}

export interface SoldTodayItem extends PublicPastry {
  sold_today: number;
}

export interface BestsellerRow extends PublicPastry {
  sold_today: number;
  rank: number;
}

export interface OwnerSnapshot {
  cumulative_sold_today: number;
  pastry_count: number;
  leaderboard: BestsellerRow[];
  last_7_days: { date: string; total: number }[];
}

/* ────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────── */

function toPublicPastry(p: DocumentType<Pastry>): PublicPastry {
  return {
    id: p._id.toString(),
    name: p.name,
    photo_url: p.photo_url ?? "",
    emoji: p.emoji ?? "",
    display_order: p.display_order ?? 0,
    is_archived: p.is_archived ?? false,
  };
}

/** Local-date string in YYYY-MM-DD format. */
export function todayDateString(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysAgoDateString(daysAgo: number, now: Date = new Date()): string {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return todayDateString(d);
}

/* ────────────────────────────────────────────────────────────────────────
 * Service
 * ──────────────────────────────────────────────────────────────────────── */

export class CrumbService {
  /* ── Pastry catalog ──────────────────────────────────────────────────── */

  static async listPastries(): Promise<PublicPastry[]> {
    const pastries = await PastryModel.find({ is_archived: false })
      .sort({ display_order: 1, name: 1 })
      .exec();
    return pastries.map(toPublicPastry);
  }

  static async createPastry(input: {
    name: string;
    photoUrl?: string;
    emoji?: string;
  }): Promise<PublicPastry> {
    const count = await PastryModel.countDocuments();
    const created = await PastryModel.create({
      name: input.name.trim(),
      photo_url: input.photoUrl ?? "",
      emoji: input.emoji ?? "",
      display_order: count,
      is_archived: false,
    });
    return toPublicPastry(created);
  }

  static async updatePastry(
    id: string,
    patch: { name?: string; photoUrl?: string; emoji?: string; isArchived?: boolean },
  ): Promise<PublicPastry | null> {
    const update: Record<string, unknown> = {};
    if (patch.name !== undefined) update.name = patch.name.trim();
    if (patch.photoUrl !== undefined) update.photo_url = patch.photoUrl;
    if (patch.emoji !== undefined) update.emoji = patch.emoji;
    if (patch.isArchived !== undefined) update.is_archived = patch.isArchived;

    const updated = await PastryModel.findByIdAndUpdate(id, update, { new: true }).exec();
    return updated ? toPublicPastry(updated) : null;
  }

  static async deletePastry(id: string): Promise<boolean> {
    const res = await PastryModel.findByIdAndUpdate(id, { is_archived: true }).exec();
    return !!res;
  }

  /* ── Sales ───────────────────────────────────────────────────────────── */

  static async logSale(input: {
    pastryId: string;
    channel?: SaleChannel;
    userId?: string;
  }): Promise<{ sale_id: string; pastry_id: string; sold_today: number }> {
    const channel = input.channel ?? SaleChannel.Counter;
    const date = todayDateString();

    const sale = await SaleModel.create({
      pastry_id: input.pastryId,
      sale_date: date,
      channel,
      logged_by_user_id: input.userId ?? null,
      is_undone: false,
    });

    const sold_today = await SaleModel.countDocuments({
      pastry_id: input.pastryId,
      sale_date: date,
      is_undone: false,
    });

    return { sale_id: sale._id.toString(), pastry_id: input.pastryId, sold_today };
  }

  static async undoSale(saleId: string): Promise<boolean> {
    const sale = await SaleModel.findById(saleId).exec();
    if (!sale || sale.is_undone) return false;
    sale.is_undone = true;
    await sale.save();
    return true;
  }

  /* ── Sold-today view ─────────────────────────────────────────────────── */

  static async getSoldToday(): Promise<SoldTodayItem[]> {
    const date = todayDateString();
    const pastries = await PastryModel.find({ is_archived: false })
      .sort({ display_order: 1, name: 1 })
      .exec();

    if (pastries.length === 0) return [];

    const counts = await SaleModel.aggregate<{ _id: string; total: number }>([
      { $match: { sale_date: date, is_undone: false } },
      { $group: { _id: "$pastry_id", total: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    for (const c of counts) countMap.set(c._id, c.total);

    return pastries.map((p) => ({
      ...toPublicPastry(p),
      sold_today: countMap.get(p._id.toString()) ?? 0,
    }));
  }

  /* ── Owner insight view ──────────────────────────────────────────────── */

  static async getOwnerSnapshot(): Promise<OwnerSnapshot> {
    const items = await CrumbService.getSoldToday();
    const sorted = [...items].sort((a, b) => b.sold_today - a.sold_today);
    const cumulative = sorted.reduce((sum, it) => sum + it.sold_today, 0);

    const leaderboard: BestsellerRow[] = sorted.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));

    // Last 7 days totals (today inclusive)
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) days.push(daysAgoDateString(i));

    const dayTotals = await SaleModel.aggregate<{ _id: string; total: number }>([
      { $match: { sale_date: { $in: days }, is_undone: false } },
      { $group: { _id: "$sale_date", total: { $sum: 1 } } },
    ]);
    const dayMap = new Map<string, number>();
    for (const dt of dayTotals) dayMap.set(dt._id, dt.total);

    const last_7_days = days.map((d) => ({ date: d, total: dayMap.get(d) ?? 0 }));

    return {
      cumulative_sold_today: cumulative,
      pastry_count: items.length,
      leaderboard,
      last_7_days,
    };
  }
}
