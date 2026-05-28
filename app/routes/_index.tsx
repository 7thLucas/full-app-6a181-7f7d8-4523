import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useConfigurables } from "~/modules/configurables";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { SoldTodayHeader } from "~/crumb/components/sold-today-header";
import { SoldTodayGrid } from "~/crumb/components/sold-today-grid";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

export default function SoldTodayPage() {
  const { config } = useConfigurables();

  const heading = config?.soldTodayHeading || "Sold today";
  const sub = config?.soldTodaySubheading || "Tap a pastry once each time it sells.";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--butter-cream)" }}>
      <SoldTodayHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
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
        <SoldTodayGrid />
      </main>
    </div>
  );
}
