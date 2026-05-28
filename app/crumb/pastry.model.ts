import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import { CommonTypegooseEntity } from "~/api/models/base/common-typegoose.entity";

/**
 * Pastry — a catalog entry for one bakery item.
 *
 * `is_archived` lets the owner hide pastries that are no longer baked
 * without losing historical sales data linked to their _id.
 */
@modelOptions({
  schemaOptions: {
    collection: "tbl_pastries",
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Pastry extends CommonTypegooseEntity {
  @prop({ type: String, required: true, trim: true })
  name!: string;

  @prop({ type: String, required: false, default: "" })
  photo_url!: string;

  /** Single emoji shown as a fallback if photo_url is empty. */
  @prop({ type: String, required: false, default: "" })
  emoji!: string;

  @prop({ type: Number, required: true, default: 0 })
  display_order!: number;

  @prop({ type: Boolean, required: true, default: false })
  is_archived!: boolean;
}

export const PastryModel = getModelForClass(Pastry);
