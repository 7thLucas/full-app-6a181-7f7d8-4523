import type { BestsellerRow } from "../use-owner-snapshot";

interface BestsellerLeaderboardProps {
  rows: BestsellerRow[];
}

export function BestsellerLeaderboard({ rows }: BestsellerLeaderboardProps) {
  if (rows.length === 0) {
    return (
      <div
        className="rounded-2xl bg-white border border-[var(--pastry-edge)] p-8 text-center"
        style={{ color: "var(--soft-ash)" }}
      >
        No sales logged yet today.
      </div>
    );
  }

  return (
    <ol className="rounded-2xl bg-white border border-[var(--pastry-edge)] overflow-hidden divide-y divide-[var(--pastry-edge)]">
      {rows.map((row) => (
        <li
          key={row.id}
          className="flex items-center gap-4 px-5 py-4"
          style={{ color: "var(--char)" }}
        >
          <RankBadge rank={row.rank} />

          {row.photo_url ? (
            <img
              src={row.photo_url}
              alt=""
              className="h-12 w-12 rounded-full object-cover border border-[var(--pastry-edge)]"
            />
          ) : (
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center bg-[var(--butter-cream)] border border-[var(--pastry-edge)]"
              style={{ fontSize: 24 }}
              aria-hidden="true"
            >
              {row.emoji || "🥐"}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate" style={{ fontSize: 17 }}>
              {row.name}
            </p>
            <p className="text-xs" style={{ color: "var(--soft-ash)" }}>
              {row.sold_today === 1 ? "1 sold today" : `${row.sold_today} sold today`}
            </p>
          </div>

          <div
            className="font-display tabular-nums"
            style={{
              fontSize: 32,
              lineHeight: 1,
              fontWeight: 700,
              color: row.rank <= 3 ? "var(--crust-gold)" : "var(--toasted-caramel)",
            }}
          >
            {row.sold_today}
          </div>
        </li>
      ))}
    </ol>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  return (
    <div
      className="flex items-center justify-center font-display font-bold rounded-full"
      style={{
        width: 36,
        height: 36,
        fontSize: 16,
        color: isTop3 ? "var(--char)" : "var(--soft-ash)",
        background: isTop3 ? "var(--crust-gold)" : "var(--butter-cream)",
        border: isTop3 ? "none" : "1px solid var(--pastry-edge)",
      }}
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </div>
  );
}
