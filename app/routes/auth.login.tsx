import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import {
  getUserFromRequest,
  signJwt,
  buildAuthCookie,
} from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const user = await AuthService.login({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({
      sub: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
      email_verified: user.email_verified,
    });
    return redirect("/", {
      headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) },
    });
  } catch (error: any) {
    return { error: error.message ?? "Invalid credentials" };
  }
}

interface ActionData {
  error?: string;
}

export default function LoginPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const { config } = useConfigurables();

  const appName = config?.appName || "Crumb";
  const welcome = config?.loginWelcome || "Welcome back to the counter.";
  const logoUrl = config?.logoUrl && !String(config.logoUrl).startsWith("FILL_") ? config.logoUrl : "";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--butter-cream)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_2px_8px_rgba(42,31,24,0.08)]"
        style={{ border: "1px solid var(--pastry-edge)" }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={appName}
              className="h-14 w-14 rounded-full object-cover border border-[var(--pastry-edge)] bg-white"
            />
          ) : (
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center bg-[var(--butter-cream)] border border-[var(--pastry-edge)]"
              style={{ fontSize: 32 }}
              aria-hidden="true"
            >
              🥐
            </div>
          )}
          <h1
            className="font-display mt-4"
            style={{ fontSize: 28, fontWeight: 700, color: "var(--char)" }}
          >
            {appName}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--soft-ash)" }}>
            {welcome}
          </p>
        </div>

        <Form method="post" className="space-y-4">
          {actionData?.error && (
            <div
              className="rounded-lg px-4 py-3 text-sm"
              style={{
                background: "rgba(200, 74, 74, 0.08)",
                color: "var(--strawberry-jam)",
                border: "1px solid rgba(200, 74, 74, 0.2)",
              }}
            >
              {actionData.error}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--char)" }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg px-3.5 py-2.5 bg-white outline-none focus:ring-2 focus:ring-[var(--crust-gold)] transition"
              style={{
                border: "1px solid var(--pastry-edge)",
                color: "var(--char)",
                fontSize: 15,
              }}
            />
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium"
                style={{ color: "var(--char)" }}
              >
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-xs hover:underline"
                style={{ color: "var(--soft-ash)" }}
              >
                Forgot?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg px-3.5 py-2.5 bg-white outline-none focus:ring-2 focus:ring-[var(--crust-gold)] transition"
              style={{
                border: "1px solid var(--pastry-edge)",
                color: "var(--char)",
                fontSize: 15,
              }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg py-3 font-semibold transition disabled:opacity-60"
            style={{
              background: "var(--crust-gold)",
              color: "var(--char)",
              fontSize: 16,
            }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
          <p className="text-center text-sm pt-1" style={{ color: "var(--soft-ash)" }}>
            New staff?{" "}
            <Link
              to="/auth/register"
              className="font-semibold hover:underline"
              style={{ color: "var(--toasted-caramel)" }}
            >
              Create an account
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
