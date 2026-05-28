import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  getUserFromRequest,
} from "~/modules/authentication/authentication.server";
import { UserRole } from "~/modules/authentication/authentication.types";
import { useConfigurables } from "~/modules/configurables";
import { useOwnerSnapshot } from "~/crumb/use-owner-snapshot";
import { SoldTodayHeader } from "~/crumb/components/sold-today-header";
import { BestsellerLeaderboard } from "~/crumb/components/bestseller-leaderboard";
import { Sparkline } from "~/crumb/components/sparkline";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  if (user.role !== UserRole.Admin) return redirect("/");
  return null;
}

function shortDayLabel(dateStr: string) {
  // dateStr: "YYYY-MM-DD"
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export default function OwnerInsightPage() {
  const { config } = useConfigurables();
  const { snapshot, loading } = useOwnerSnapshot(10000);

  const heading = config?.insightHeading || "Today's bestsellers";
  const sub = config?.insightSubheading || "What's flying off the shelf right now.";

  const cumulative = snapshot?.cumulative_sold_today ?? 0;
  const last7 = snapshot?.last_7_days ?? [];
  const sparkValues = last7.map((d) => d.total);
  const sparkLabels = last7.map((d) => shortDayLabel(d.date));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--butter-cream)" }}>
      <SoldTodayHeader />
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1
            className="font-display"
            style={{ fontSize: 32, fontWeight: 700, color: "var(--char)", lineHeight: 1.1 }}
          >
            {heading}
          </h1>
          <p className="mt-1" style={{ color: "var(--soft-ash)", fontSize: 15 }}>
            {sub}
          </p>
        </div>

        {/* Big cumulative tile + sparkline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div
            className="lg:col-span-1 rounded-2xl bg-white p-6 flex flex-col justify-between"
            style={{ border: "1px solid var(--pastry-edge)" }}
          >
            <span
              className="text-sm font-medium uppercase tracking-wider"
              style={{ color: "var(--soft-ash)" }}
            >
              Sold today, all channels
            </span>
            <div className="mt-4">
              <span
                className="font-display tabular-nums"
                style={{
                  fontSize: 72,
                  fontWeight: 700,
                  color: "var(--crust-gold)",
                  lineHeight: 1,
                }}
              >
                {loading && !snapshot ? "—" : cumulative}
              </span>
              <p className="mt-1 text-sm" style={{ color: "var(--soft-ash)" }}>
                across {snapshot?.pastry_count ?? 0} pastries
              </p>
            </div>
          </div>

          <div
            className="lg:col-span-2 rounded-2xl bg-white p-6"
            style={{ border: "1px solid var(--pastry-edge)" }}
          >
            <div className="flex items-baseline justify-between mb-3">
              <span
                className="text-sm font-medium uppercase tracking-wider"
                style={{ color: "var(--soft-ash)" }}
              >
                Last 7 days
              </span>
              <span style={{ color: "var(--soft-ash)", fontSize: 12 }}>
                cumulative sold-today per day
              </span>
            </div>
            <Sparkline values={sparkValues} labels={sparkLabels} height={140} />
          </div>
        </div>

        <h2
          className="font-display mb-4"
          style={{ fontSize: 22, fontWeight: 600, color: "var(--char)" }}
        >
          Leaderboard
        </h2>
        <BestsellerLeaderboard rows={snapshot?.leaderboard ?? []} />
      </main>
    </div>
  );
}
