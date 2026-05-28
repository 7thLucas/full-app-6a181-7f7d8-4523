import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  index,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

/**
 * Channel a sale was logged from. The single sold-today number unifies
 * counter walk-ups, phone orders, and in-shop walk-ins.
 */
export enum SaleChannel {
  Counter = "counter",
  Phone = "phone",
  WalkIn = "walk_in",
}

/**
 * Sale — one tap = one row. Aggregated by `(pastry_id, sale_date)` for
 * the sold-today view.
 *
 * `sale_date` is a YYYY-MM-DD string in the bakery's local time so the
 * "today" rollup is trivial: just match on today's date string.
 */
@index({ sale_date: 1 })
@index({ pastry_id: 1, sale_date: 1 })
@modelOptions({
  schemaOptions: {
    collection: "tbl_sales",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Sale extends CommonTypegooseEntity {
  @prop({ type: String, required: true })
  pastry_id!: string;

  /** Local-date string, format "YYYY-MM-DD". */
  @prop({ type: String, required: true })
  sale_date!: string;

  @prop({ type: String, enum: SaleChannel, required: true, default: SaleChannel.Counter })
  channel!: SaleChannel;

  @prop({ type: String, required: false, default: null })
  logged_by_user_id?: string | null;

  /** Soft-delete style "undo" flag so we keep an audit trail. */
  @prop({ type: Boolean, required: true, default: false })
  is_undone!: boolean;
}

export const SaleModel = getModelForClass(Sale);
