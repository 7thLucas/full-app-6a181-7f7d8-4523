import { Link } from "@remix-run/react";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication/use-authentication";

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function SoldTodayHeader() {
  const { config } = useConfigurables();
  const { user, isAdmin } = useAuth();

  const appName = config?.appName || "Crumb";
  const logoUrl = config?.logoUrl && !String(config.logoUrl).startsWith("FILL_") ? config.logoUrl : "";

  return (
    <header
      className="w-full px-6 py-4 flex items-center justify-between gap-4 border-b"
      style={{ borderColor: "var(--pastry-edge)", background: "var(--butter-cream)" }}
    >
      {/* Left: logo + app name */}
      <div className="flex items-center gap-3 min-w-0">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={appName}
            className="h-9 w-9 rounded-full object-cover bg-white border border-[var(--pastry-edge)]"
          />
        ) : (
          <div
            aria-hidden="true"
            className="h-9 w-9 rounded-full flex items-center justify-center bg-white border border-[var(--pastry-edge)]"
            style={{ fontSize: 20 }}
          >
            🥐
          </div>
        )}
        <span
          className="font-display truncate"
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "var(--toasted-caramel)",
          }}
        >
          {appName}
        </span>
      </div>

      {/* Center: today's date */}
      <div
        className="hidden md:block text-sm"
        style={{ color: "var(--soft-ash)", fontWeight: 500 }}
      >
        {formatDate(new Date())}
      </div>

      {/* Right: nav + user */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isAdmin && (
          <Link
            to="/owner"
            className="hidden sm:inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition"
            style={{ color: "var(--toasted-caramel)" }}
          >
            Insight
          </Link>
        )}
        {isAdmin && (
          <Link
            to="/owner/catalog"
            className="hidden sm:inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-white transition"
            style={{ color: "var(--toasted-caramel)" }}
          >
            Pastries
          </Link>
        )}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-white border border-[var(--pastry-edge)]">
          <div
            className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
            style={{ background: "var(--toasted-caramel)" }}
            aria-hidden="true"
          >
            {(user?.username ?? "?").charAt(0).toUpperCase()}
          </div>
          <span
            className="hidden sm:inline text-sm truncate max-w-[120px]"
            style={{ color: "var(--char)" }}
          >
            {user?.username ?? "Staff"}
          </span>
          <form method="post" action="/auth/logout">
            <button
              type="submit"
              className="text-xs px-2 py-1 rounded-md hover:bg-[var(--butter-cream)] transition"
              style={{ color: "var(--soft-ash)" }}
              aria-label="Sign out"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
