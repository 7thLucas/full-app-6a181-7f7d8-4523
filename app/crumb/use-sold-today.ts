import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet, apiRequest } from "~/lib/api.client";

export interface SoldTodayItem {
  id: string;
  name: string;
  photo_url: string;
  emoji: string;
  display_order: number;
  is_archived: boolean;
  sold_today: number;
}

export interface LogSaleResult {
  sale_id: string;
  pastry_id: string;
  sold_today: number;
}

/**
 * useSoldToday — hot-path hook for the counter-tablet screen.
 *
 * - Loads the sold-today list once on mount.
 * - `logSale(pastryId)` increments locally IMMEDIATELY (optimistic), then
 *   syncs the canonical count from the server. Two-tap promise preserved.
 * - Polls every 8s in the background so other tablets show up within a beat.
 */
export function useSoldToday(pollIntervalMs = 8000) {
  const [items, setItems] = useState<SoldTodayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    const res = await apiGet<{ items: SoldTodayItem[] }>("/api/crumb/sold-today");
    if (!mountedRef.current) return;
    if (res.success && res.data) {
      setItems(res.data.items);
      setError(null);
    } else if (!res.success) {
      setError(res.message ?? "Could not load sold-today");
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    refresh().finally(() => {
      if (mountedRef.current) setLoading(false);
    });

    const interval = window.setInterval(() => {
      refresh();
    }, pollIntervalMs);

    return () => {
      mountedRef.current = false;
      window.clearInterval(interval);
    };
  }, [refresh, pollIntervalMs]);

  const logSale = useCallback(
    async (pastryId: string): Promise<LogSaleResult | null> => {
      // Optimistic bump
      setItems((prev) =>
        prev.map((it) =>
          it.id === pastryId ? { ...it, sold_today: it.sold_today + 1 } : it,
        ),
      );

      const res = await apiRequest<LogSaleResult>("/api/crumb/sales", {
        method: "POST",
        data: { pastry_id: pastryId, channel: "counter" },
      });

      if (res.success && res.data) {
        // Reconcile to server truth
        const serverCount = res.data.sold_today;
        setItems((prev) =>
          prev.map((it) =>
            it.id === pastryId ? { ...it, sold_today: serverCount } : it,
          ),
        );
        return res.data;
      } else {
        // Roll back optimistic bump
        setItems((prev) =>
          prev.map((it) =>
            it.id === pastryId
              ? { ...it, sold_today: Math.max(0, it.sold_today - 1) }
              : it,
          ),
        );
        setError(res.message ?? "Sale didn't save — try again");
        return null;
      }
    },
    [],
  );

  const undoSale = useCallback(async (saleId: string, pastryId: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === pastryId
          ? { ...it, sold_today: Math.max(0, it.sold_today - 1) }
          : it,
      ),
    );
    const res = await apiRequest(`/api/crumb/sales/${saleId}/undo`, {
      method: "POST",
    });
    if (!res.success) {
      // Roll back undo
      setItems((prev) =>
        prev.map((it) =>
          it.id === pastryId ? { ...it, sold_today: it.sold_today + 1 } : it,
        ),
      );
    }
    return res.success;
  }, []);

  return { items, loading, error, logSale, undoSale, refresh };
}
