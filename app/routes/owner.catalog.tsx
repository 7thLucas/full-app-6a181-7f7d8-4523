import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { useCallback, useEffect, useState } from "react";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { UserRole } from "~/modules/authentication/authentication.types";
import { apiGet, apiRequest } from "~/lib/api.client";
import { SoldTodayHeader } from "~/crumb/components/sold-today-header";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  if (user.role !== UserRole.Admin) return redirect("/");
  return null;
}

interface Pastry {
  id: string;
  name: string;
  photo_url: string;
  emoji: string;
  display_order: number;
  is_archived: boolean;
}

export default function OwnerCatalogPage() {
  const [pastries, setPastries] = useState<Pastry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", photo_url: "", emoji: "" });
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    const res = await apiGet<{ items: Pastry[] }>("/api/crumb/pastries");
    if (res.success && res.data) {
      setPastries(res.data.items);
      setError(null);
    } else {
      setError(res.message ?? "Could not load pastries");
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    const res = await apiRequest("/api/crumb/pastries", {
      method: "POST",
      data: { name: form.name, photo_url: form.photo_url, emoji: form.emoji },
    });
    setCreating(false);
    if (res.success) {
      setForm({ name: "", photo_url: "", emoji: "" });
      load();
    } else {
      setError(res.message ?? "Could not add pastry");
    }
  };

  const handleUpdate = async (id: string, patch: Partial<Pastry>) => {
    setSavingId(id);
    const res = await apiRequest(`/api/crumb/pastries/${id}`, {
      method: "PATCH",
      data: {
        name: patch.name,
        photo_url: patch.photo_url,
        emoji: patch.emoji,
        is_archived: patch.is_archived,
      },
    });
    setSavingId(null);
    if (res.success) load();
  };

  const handleArchive = async (id: string) => {
    setSavingId(id);
    const res = await apiRequest(`/api/crumb/pastries/${id}`, { method: "DELETE" });
    setSavingId(null);
    if (res.success) load();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--butter-cream)" }}>
      <SoldTodayHeader />
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1
            className="font-display"
            style={{ fontSize: 32, fontWeight: 700, color: "var(--char)", lineHeight: 1.1 }}
          >
            Pastry catalog
          </h1>
          <p className="mt-1" style={{ color: "var(--soft-ash)", fontSize: 15 }}>
            Add what you're baking today. Tap targets show up on the counter screen instantly.
          </p>
        </div>

        {/* Add new pastry */}
        <form
          onSubmit={handleCreate}
          className="rounded-2xl bg-white p-5 mb-8 flex flex-col sm:flex-row gap-3 items-end"
          style={{ border: "1px solid var(--pastry-edge)" }}
        >
          <FormField
            label="Name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="e.g. Almond Croissant"
            className="flex-1"
            required
          />
          <FormField
            label="Photo URL"
            value={form.photo_url}
            onChange={(v) => setForm((f) => ({ ...f, photo_url: v }))}
            placeholder="https://…"
            className="flex-1"
          />
          <FormField
            label="Emoji"
            value={form.emoji}
            onChange={(v) => setForm((f) => ({ ...f, emoji: v }))}
            placeholder="🥐"
            className="w-20"
          />
          <button
            type="submit"
            disabled={creating || !form.name.trim()}
            className="rounded-lg px-5 py-2.5 font-semibold transition disabled:opacity-50"
            style={{
              background: "var(--crust-gold)",
              color: "var(--char)",
              minWidth: 120,
            }}
          >
            {creating ? "Adding…" : "Add pastry"}
          </button>
        </form>

        {error && (
          <div
            className="rounded-lg px-4 py-3 mb-4 text-sm"
            style={{
              background: "rgba(200, 74, 74, 0.08)",
              color: "var(--strawberry-jam)",
              border: "1px solid rgba(200, 74, 74, 0.2)",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color: "var(--soft-ash)" }}>Loading…</p>
        ) : pastries.length === 0 ? (
          <div
            className="rounded-2xl bg-white p-10 text-center"
            style={{ border: "1px solid var(--pastry-edge)", color: "var(--soft-ash)" }}
          >
            No pastries yet — add your first one above.
          </div>
        ) : (
          <ul
            className="rounded-2xl bg-white overflow-hidden divide-y divide-[var(--pastry-edge)]"
            style={{ border: "1px solid var(--pastry-edge)" }}
          >
            {pastries.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-4">
                {p.photo_url ? (
                  <img
                    src={p.photo_url}
                    alt=""
                    className="h-14 w-14 rounded-full object-cover border border-[var(--pastry-edge)]"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-14 w-14 rounded-full flex items-center justify-center bg-[var(--butter-cream)] border border-[var(--pastry-edge)]"
                    style={{ fontSize: 28 }}
                  >
                    {p.emoji || "🥐"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <input
                    defaultValue={p.name}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && v !== p.name) handleUpdate(p.id, { name: v });
                    }}
                    className="w-full bg-transparent outline-none focus:bg-[var(--butter-cream)] rounded px-2 py-1 font-semibold"
                    style={{ color: "var(--char)", fontSize: 16 }}
                  />
                  <div className="flex gap-2 mt-1">
                    <input
                      defaultValue={p.photo_url}
                      onBlur={(e) => {
                        const v = e.target.value;
                        if (v !== p.photo_url) handleUpdate(p.id, { photo_url: v });
                      }}
                      placeholder="Photo URL"
                      className="flex-1 text-xs bg-transparent outline-none focus:bg-[var(--butter-cream)] rounded px-2 py-1"
                      style={{ color: "var(--soft-ash)" }}
                    />
                    <input
                      defaultValue={p.emoji}
                      onBlur={(e) => {
                        const v = e.target.value;
                        if (v !== p.emoji) handleUpdate(p.id, { emoji: v });
                      }}
                      placeholder="🥐"
                      className="w-16 text-sm text-center bg-transparent outline-none focus:bg-[var(--butter-cream)] rounded px-1 py-1"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Archive ${p.name}? Past sales are kept; it just hides from the counter.`)) {
                      handleArchive(p.id);
                    }
                  }}
                  disabled={savingId === p.id}
                  className="text-sm font-medium px-3 py-2 rounded-lg hover:bg-[var(--butter-cream)] transition disabled:opacity-50"
                  style={{ color: "var(--strawberry-jam)" }}
                >
                  {savingId === p.id ? "…" : "Archive"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  className,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span
        className="block text-xs font-medium mb-1"
        style={{ color: "var(--soft-ash)" }}
      >
        {label}
        {required && <span style={{ color: "var(--strawberry-jam)" }}> *</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-[var(--crust-gold)] transition"
        style={{
          border: "1px solid var(--pastry-edge)",
          color: "var(--char)",
          fontSize: 14,
        }}
      />
    </label>
  );
}
