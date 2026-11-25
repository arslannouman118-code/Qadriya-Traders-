import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { isAdmin } from "@/lib/admin-auth";
import { logout } from "./actions";

// Private area: never shown in search engines and not linked from the shop.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

const css = `
.adm{background:#f4f2ee;color:#1d1d1b;min-height:100vh;font-family:var(--font-sans,"DM Sans",system-ui,sans-serif);font-size:15px;line-height:1.5}
.adm *{box-sizing:border-box}
.adm a{color:inherit}
.adm-top{background:#1f1d1a;color:#fff;display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center;padding:12px 20px}
.adm-top strong{font-size:16px;margin-right:6px}
.adm-top a{color:#e9e4da;text-decoration:none;padding:4px 2px}
.adm-top a:hover{color:#fff;text-decoration:underline}
.adm-top form{margin-left:auto}
.adm-link{background:none;border:0;color:#e9e4da;cursor:pointer;font:inherit;padding:4px 2px}
.adm-wrap{max-width:1100px;margin:0 auto;padding:24px 16px 60px}
.adm h1{font-size:26px;margin:0 0 4px}
.adm h2{font-size:18px;margin:0 0 12px}
.adm-sub{color:#6b665d;margin:0 0 20px}
.adm-card{background:#fff;border:1px solid #e4dfd5;border-radius:12px;padding:18px;margin-bottom:18px}
.adm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:18px}
.adm-stat{background:#fff;border:1px solid #e4dfd5;border-radius:12px;padding:14px 16px;text-decoration:none}
.adm-stat b{display:block;font-size:28px;line-height:1.1}
.adm-stat span{color:#6b665d;font-size:13px}
.adm-stat.warn b{color:#b4531a}
.adm-btn{display:inline-block;background:#1f1d1a;color:#fff;border:1px solid #1f1d1a;border-radius:8px;padding:9px 16px;font:inherit;font-weight:600;cursor:pointer;text-decoration:none}
.adm-btn:disabled{opacity:.6;cursor:wait}
.adm-btn-light{background:#fff;color:#1f1d1a;border-color:#cfc9bd}
.adm-btn-sm{padding:5px 10px;font-size:13px;border-radius:6px}
.adm-btn-danger{background:#fff;color:#a32a1d;border-color:#e0b4ae}
.adm-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-bottom:16px}
.adm-table-wrap{overflow-x:auto}
.adm table{width:100%;border-collapse:collapse}
.adm th,.adm td{text-align:left;padding:10px 8px;border-bottom:1px solid #ece8df;vertical-align:middle}
.adm th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#6b665d}
.adm td img{width:46px;height:46px;object-fit:cover;border-radius:8px;background:#eee;display:block}
.adm td form{display:inline-flex;gap:6px;align-items:center;margin:0}
.adm input:not([type=checkbox]),.adm select,.adm textarea{width:100%;border:1px solid #cfc9bd;border-radius:8px;padding:9px 10px;font:inherit;background:#fff;color:inherit}
.adm td input.adm-num{width:80px;padding:5px 8px}
.adm textarea{resize:vertical}
.adm-pill{display:inline-block;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:600;background:#eee;color:#444}
.adm-pill.ok{background:#e1f2e2;color:#1f6a2a}
.adm-pill.off{background:#eee;color:#666}
.adm-pill.pending{background:#fdecc8;color:#8a5a00}
.adm-pill.confirmed{background:#dcebfa;color:#1c4f86}
.adm-pill.shipped{background:#e6e0f7;color:#4b3a8f}
.adm-pill.delivered{background:#e1f2e2;color:#1f6a2a}
.adm-pill.cancelled{background:#f7dcd8;color:#8e2a1e}
.adm-low{color:#b4531a;font-weight:700}
.adm-note{background:#fff8e6;border:1px solid #f0dca8;border-radius:10px;padding:12px 14px;margin-bottom:16px}
.adm-ok{background:#e8f5e9;border:1px solid #bfe0c3;border-radius:10px;padding:10px 14px;margin-bottom:16px}
.adm-error{color:#a32a1d;font-weight:600;margin:0}
.adm-form{display:grid;grid-template-columns:240px 1fr;gap:24px}
.adm-photo{display:flex;flex-direction:column;gap:10px;align-items:flex-start}
.adm-photo img,.adm-photo-empty{width:100%;aspect-ratio:1;object-fit:cover;border-radius:10px;background:#eee}
.adm-photo-empty{display:grid;place-items:center;color:#8a847a}
.adm-fields{display:grid;gap:14px}
.adm-fields label{display:grid;gap:5px;font-weight:600;font-size:14px}
.adm-row3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.adm-checks{display:flex;flex-wrap:wrap;gap:6px 20px}
.adm-checks label{display:flex;align-items:center;gap:8px;font-weight:500}
.adm-actions{display:flex;gap:10px}
.adm-login{max-width:380px;margin:60px auto}
.adm-order summary{cursor:pointer;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;list-style:none}
.adm-order summary::-webkit-details-marker{display:none}
.adm-order[open] summary{margin-bottom:12px}
.adm-order dl{display:grid;grid-template-columns:120px 1fr;gap:4px 12px;margin:0 0 12px}
.adm-order dt{color:#6b665d}
.adm-order dd{margin:0}
.adm-tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
@media(max-width:760px){.adm-form{grid-template-columns:1fr}.adm-row3{grid-template-columns:1fr}.adm-photo{max-width:260px}}
`;

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authed = await isAdmin();
  return (
    <div className="adm">
      <style>{css}</style>
      {authed && (
        <nav className="adm-top" aria-label="Admin">
          <strong>Qadriya Admin</strong>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/" target="_blank">
            View website ↗
          </Link>
          <form action={logout}>
            <button className="adm-link" type="submit">
              Log out
            </button>
          </form>
        </nav>
      )}
      <div className="adm-wrap">
        {authed && !process.env.DATABASE_URL ? (
          <div className="adm-note">
            <strong>Database is not connected.</strong> Add{" "}
            <code>DATABASE_URL</code> to your <code>.env</code> file (and to
            Vercel), then restart the site. The admin panel needs the database
            to save products and show orders.
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
