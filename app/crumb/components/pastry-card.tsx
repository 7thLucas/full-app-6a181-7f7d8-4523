import { useEffect, useRef, useState } from "react";
import type { SoldTodayItem } from "../use-sold-today";

interface PastryCardProps {
  pastry: SoldTodayItem;
  bestsellerRank: number | null; // 1, 2, 3, or null
  showBestsellerBadge: boolean;
  onTap: (pastry: SoldTodayItem) => void;
}

/**
 * PastryCard — THE hero component. Photo dominates, count is glanceable,
 * the entire card is the tap target. Tap = +1 sale, with bump + flash feedback.
 */
export function PastryCard({
  pastry,
  bestsellerRank,
  showBestsellerBadge,
  onTap,
}: PastryCardProps) {
  const [bump, setBump] = useState(false);
  const [flash, setFlash] = useState(false);
  const [press, setPress] = useState(false);
  const lastCountRef = useRef(pastry.sold_today);

  useEffect(() => {
    if (pastry.sold_today !== lastCountRef.current) {
      lastCountRef.current = pastry.sold_today;
      setBump(true);
      const t = window.setTimeout(() => setBump(false), 300);
      return () => window.clearTimeout(t);
    }
  }, [pastry.sold_today]);

  const handleTap = () => {
    setPress(true);
    setFlash(true);
    window.setTimeout(() => setPress(false), 200);
    window.setTimeout(() => setFlash(false), 340);
    onTap(pastry);
  };

  const hasPhoto = !!pastry.photo_url;
  const emoji = pastry.emoji || "🥐";

  return (
    <button
      type="button"
      onClick={handleTap}
      aria-label={`Log one ${pastry.name} sale. Sold today: ${pastry.sold_today}`}
      className={[
        "relative w-full text-left rounded-2xl overflow-hidden bg-white border border-[var(--pastry-edge)]",
        "shadow-[0_2px_8px_rgba(42,31,24,0.08)] hover:shadow-[0_6px_18px_rgba(42,31,24,0.12)]",
        "transition-shadow duration-200 ease-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--crust-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--butter-cream)]",
        "active:scale-[0.985]",
        press ? "crumb-card-press" : "",
      ].join(" ")}
      style={{ minHeight: 220 }}
    >
      {/* Flash overlay */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 z-10",
          flash ? "crumb-card-flash" : "",
        ].join(" ")}
      />

      {/* Photo (or emoji fallback) */}
      <div
        className="relative w-full aspect-[4/3] overflow-hidden"
        style={{
          background: hasPhoto
            ? undefined
            : "linear-gradient(135deg, var(--butter-cream) 0%, #F4E8D0 100%)",
        }}
      >
        {hasPhoto ? (
          <img
            src={pastry.photo_url}
            alt=""
            draggable={false}
            className="w-full h-full object-cover select-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center select-none">
            <span style={{ fontSize: 96 }} aria-hidden="true">
              {emoji}
            </span>
          </div>
        )}

        {/* Bestseller badge */}
        {showBestsellerBadge && bestsellerRank && bestsellerRank <= 3 && (
          <span
            className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--crust-gold)] text-[var(--char)] text-xs font-semibold shadow-sm"
            aria-label={`Rank ${bestsellerRank} today`}
          >
            <CrownIcon />#{bestsellerRank}
          </span>
        )}
      </div>

      {/* Footer: name + big count */}
      <div className="flex items-end justify-between px-4 py-3 gap-3">
        <div className="min-w-0 flex-1">
          <h3
            className="text-[var(--char)] font-semibold leading-tight truncate"
            style={{ fontSize: 20, fontFamily: "Inter, sans-serif" }}
            title={pastry.name}
          >
            {pastry.name}
          </h3>
          <p
            className="text-[var(--soft-ash)] mt-0.5"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            Sold today
          </p>
        </div>
        <div
          className={[
            "font-display tabular-nums tracking-tight",
            bump ? "crumb-count-bump" : "",
          ].join(" ")}
          style={{
            fontSize: 48,
            lineHeight: 1,
            fontWeight: 700,
            color: "var(--crust-gold)",
          }}
        >
          {pastry.sold_today}
        </div>
      </div>
    </button>
  );
}

function CrownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 18l2-9 5 4 3-7 3 7 5-4 2 9H2zm0 2h20v2H2v-2z" />
    </svg>
  );
}
