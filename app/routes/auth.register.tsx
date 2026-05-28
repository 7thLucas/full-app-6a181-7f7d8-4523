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
    const user = await AuthService.register({
      username: String(formData.get("username") ?? ""),
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
    return { error: error.message ?? "Registration failed" };
  }
}

interface ActionData {
  error?: string;
}

export default function RegisterPage() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const submitting = navigation.state === "submitting";
  const { config } = useConfigurables();
  const appName = config?.appName || "Crumb";

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
          <div
            aria-hidden="true"
            className="h-14 w-14 rounded-full flex items-center justify-center bg-[var(--butter-cream)] border border-[var(--pastry-edge)]"
            style={{ fontSize: 32 }}
          >
            🥐
          </div>
          <h1
            className="font-display mt-4"
            style={{ fontSize: 26, fontWeight: 700, color: "var(--char)" }}
          >
            Join {appName}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--soft-ash)" }}>
            Quick setup. You'll be tapping in a minute.
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
          <Field label="Display name" name="username" autoComplete="nickname" />
          <Field label="Email" name="email" type="email" autoComplete="email" />
          <Field label="Password" name="password" type="password" autoComplete="new-password" />
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
            {submitting ? "Creating account…" : "Create account"}
          </button>
          <p className="text-center text-sm pt-1" style={{ color: "var(--soft-ash)" }}>
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold hover:underline"
              style={{ color: "var(--toasted-caramel)" }}
            >
              Sign in
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--char)" }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="w-full rounded-lg px-3.5 py-2.5 bg-white outline-none focus:ring-2 focus:ring-[var(--crust-gold)] transition"
        style={{
          border: "1px solid var(--pastry-edge)",
          color: "var(--char)",
          fontSize: 15,
        }}
      />
    </div>
  );
}
