import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet } from "~/lib/api.client";
import type { SoldTodayItem } from "./use-sold-today";

export interface BestsellerRow extends SoldTodayItem {
  rank: number;
}

export interface OwnerSnapshot {
  cumulative_sold_today: number;
  pastry_count: number;
  leaderboard: BestsellerRow[];
  last_7_days: { date: string; total: number }[];
}

export function useOwnerSnapshot(pollIntervalMs = 10000) {
  const [snapshot, setSnapshot] = useState<OwnerSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const refresh = useCallback(async () => {
    const res = await apiGet<OwnerSnapshot>("/api/crumb/owner-snapshot");
    if (!mountedRef.current) return;
    if (res.success && res.data) {
      setSnapshot(res.data);
      setError(null);
    } else {
      setError(res.message ?? "Could not load insight");
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    refresh().finally(() => {
      if (mountedRef.current) setLoading(false);
    });
    const interval = window.setInterval(refresh, pollIntervalMs);
    return () => {
      mountedRef.current = false;
      window.clearInterval(interval);
    };
  }, [refresh, pollIntervalMs]);

  return { snapshot, loading, error, refresh };
}
