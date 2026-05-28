import { createLogger } from "~/lib/logger";
import { PastryModel } from "./pastry.model";
import { defaultConfigurablesData } from "~/modules/configurables/src/constants/configurables.default";

const logger = createLogger("CrumbSeed");

/**
 * Seed the pastry catalog from the configurables defaults on first boot.
 * Idempotent: skips if any pastry already exists.
 */
export async function seedCrumb(): Promise<void> {
  try {
    const existing = await PastryModel.countDocuments();
    if (existing > 0) {
      logger.info("Pastries already seeded, skipping.");
      return;
    }

    const seeds = defaultConfigurablesData.defaultPastries ?? [];
    if (seeds.length === 0) {
      logger.info("No default pastries to seed.");
      return;
    }

    logger.info(`Seeding ${seeds.length} default pastries...`);

    await PastryModel.create(
      seeds.map((p, idx) => ({
        name: p.name,
        photo_url: p.photoUrl ?? "",
        emoji: p.emoji ?? "",
        display_order: idx,
        is_archived: false,
      })),
    );

    logger.info("Default pastries seeded.");
  } catch (err) {
    logger.error("Failed to seed default pastries", err);
  }
}
