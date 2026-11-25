import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { login } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <div className="adm-login adm-card">
      <h1>Admin login</h1>
      <p className="adm-sub">Only the shop owner can enter here.</p>
      {!adminConfigured() ? (
        <div className="adm-note">
          Admin login is switched off. Add <code>ADMIN_PASSWORD=...</code> (at
          least 8 characters) to your <code>.env</code> file and restart the
          site.
        </div>
      ) : (
        <form action={login} style={{ display: "grid", gap: 12 }}>
          <label htmlFor="adm-password" style={{ fontWeight: 600 }}>
            Password
          </label>
          <input
            id="adm-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
          />
          {error === "wrong" && (
            <p className="adm-error">That password is not correct.</p>
          )}
          {error === "locked" && (
            <p className="adm-error">
              Too many wrong attempts. Please try again in 15 minutes.
            </p>
          )}
          <button className="adm-btn" type="submit">
            Log in
          </button>
        </form>
      )}
    </div>
  );
}
