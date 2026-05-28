import { useCallback, useMemo, useRef, useState } from "react";
import { useConfigurables } from "~/modules/configurables";
import { useSoldToday, type SoldTodayItem } from "../use-sold-today";
import { PastryCard } from "./pastry-card";
import { UndoToast } from "./undo-toast";

interface PendingSale {
  saleId: string;
  pastryId: string;
  pastryName: string;
}

export function SoldTodayGrid() {
  const { config } = useConfigurables();
  const { items, loading, error, logSale, undoSale } = useSoldToday(8000);
  const [pending, setPending] = useState<PendingSale | null>(null);
  const dismissTimerRef = useRef<number | null>(null);

  const showUndo = config?.enableUndo !== false;
  const showBestsellerBadges = config?.showBestsellerBadges !== false;
  const gridColumns = Math.max(2, Math.min(5, Number(config?.gridColumns) || 3));

  /**
   * Sort by sold_today DESC so today's bestsellers float to the top in real time.
   * Within ties, fall back to original display order.
   */
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (b.sold_today !== a.sold_today) return b.sold_today - a.sold_today;
      return a.display_order - b.display_order;
    });
  }, [items]);

  /**
   * Bestseller rank: top 3 with at least one sale today get a crown.
   */
  const rankMap = useMemo(() => {
    const map = new Map<string, number>();
    const ranked = sortedItems.filter((it) => it.sold_today > 0).slice(0, 3);
    ranked.forEach((it, idx) => map.set(it.id, idx + 1));
    return map;
  }, [sortedItems]);

  const handleTap = useCallback(
    async (pastry: SoldTodayItem) => {
      const result = await logSale(pastry.id);
      if (!result || !showUndo) return;

      if (dismissTimerRef.current !== null) {
        window.clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }

      setPending({
        saleId: result.sale_id,
        pastryId: pastry.id,
        pastryName: pastry.name,
      });
    },
    [logSale, showUndo],
  );

  const handleUndo = useCallback(async () => {
    if (!pending) return;
    await undoSale(pending.saleId, pending.pastryId);
    setPending(null);
  }, [pending, undoSale]);

  const handleDismiss = useCallback(() => setPending(null), []);

  if (loading) {
    return (
      <div
        className="grid gap-6 w-full"
        style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-[var(--pastry-edge)] animate-pulse"
            style={{ height: 280 }}
          />
        ))}
      </div>
    );
  }

  if (error && sortedItems.length === 0) {
    return (
      <div
        className="rounded-2xl bg-white border border-[var(--pastry-edge)] p-8 text-center"
        style={{ color: "var(--char)" }}
      >
        <p className="font-display text-xl mb-2">Couldn't load pastries</p>
        <p className="text-sm" style={{ color: "var(--soft-ash)" }}>{error}</p>
      </div>
    );
  }

  if (sortedItems.length === 0) {
    return (
      <div
        className="rounded-2xl bg-white border border-[var(--pastry-edge)] p-10 text-center"
        style={{ color: "var(--char)" }}
      >
        <div style={{ fontSize: 64 }} aria-hidden="true">🥐</div>
        <h2 className="font-display mt-3" style={{ fontSize: 24, fontWeight: 700 }}>
          No pastries on the board yet
        </h2>
        <p className="text-sm mt-2" style={{ color: "var(--soft-ash)" }}>
          The owner can add today's bakes from the Pastries page.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid gap-6 w-full"
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
        }}
      >
        {sortedItems.map((pastry) => (
          <PastryCard
            key={pastry.id}
            pastry={pastry}
            bestsellerRank={rankMap.get(pastry.id) ?? null}
            showBestsellerBadge={showBestsellerBadges}
            onTap={handleTap}
          />
        ))}
      </div>

      <UndoToast
        visible={!!pending}
        message={pending ? `Sold: ${pending.pastryName}` : ""}
        onUndo={handleUndo}
        onDismiss={handleDismiss}
      />
    </>
  );
}
