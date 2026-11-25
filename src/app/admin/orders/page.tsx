import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/catalog";
import { updateOrderStatus } from "../actions";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function whatsappLink(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = `92${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

type Item = { id?: string; name?: string; price?: number; quantity?: number };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter =
    typeof status === "string" && STATUSES.includes(status) ? status : "";
  let rows: (typeof orders.$inferSelect)[] | null = null;
  try {
    const query = db.select().from(orders);
    rows = await (filter ? query.where(eq(orders.status, filter)) : query)
      .orderBy(desc(orders.createdAt))
      .limit(200);
  } catch (error) {
    console.error("Admin orders query failed", error);
  }
  if (!rows)
    return (
      <div className="adm-note">
        <strong>The orders table is not ready yet.</strong> In the VS Code
        terminal run <code>npx drizzle-kit push</code>, then refresh.
      </div>
    );

  return (
    <>
      <h1>Orders</h1>
      <p className="adm-sub">
        Open an order to see the customer’s details and change its status.
        Cancelling an order puts its items back into stock.
      </p>
      <div className="adm-tabs">
        <Link
          className={`adm-btn adm-btn-sm ${filter ? "adm-btn-light" : ""}`}
          href="/admin/orders"
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            className={`adm-btn adm-btn-sm ${filter === s ? "" : "adm-btn-light"}`}
            href={`/admin/orders?status=${s}`}
          >
            {s}
          </Link>
        ))}
      </div>
      {rows.length === 0 && (
        <div className="adm-card">No orders here yet.</div>
      )}
      {rows.map((o) => {
        const items: Item[] = Array.isArray(o.items) ? (o.items as Item[]) : [];
        return (
          <details className="adm-card adm-order" key={o.id}>
            <summary>
              <strong>{o.reference}</strong>
              <span>{o.name}</span>
              <span>{formatPrice(o.total)}</span>
              <span className={`adm-pill ${o.status}`}>{o.status}</span>
              <small style={{ marginLeft: "auto" }}>
                {o.createdAt.toLocaleString("en-GB", {
                  timeZone: "Asia/Karachi",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </small>
            </summary>
            <dl>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${o.phone.replace(/[^0-9+]/g, "")}`}>{o.phone}</a>{" "}
                ·{" "}
                <a href={whatsappLink(o.phone)} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </dd>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${o.email}`}>{o.email}</a>
              </dd>
              <dt>Address</dt>
              <dd>
                {o.address}, {o.city} {o.postalCode}
              </dd>
            </dl>
            <div className="adm-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice((item.price ?? 0) * (item.quantity ?? 0))}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2}>Delivery</td>
                    <td>{o.delivery ? formatPrice(o.delivery) : "Free"}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <strong>Total (cash on delivery)</strong>
                    </td>
                    <td>
                      <strong>{formatPrice(o.total)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {o.status === "cancelled" ? (
              <p style={{ margin: "12px 0 0" }}>
                This order is cancelled. Its items were put back into stock.
              </p>
            ) : (
              <form
                action={updateOrderStatus}
                style={{ display: "flex", gap: 8, marginTop: 12, maxWidth: 360 }}
              >
                <input type="hidden" name="id" value={o.id} />
                <select name="status" defaultValue={o.status} aria-label="Order status">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button className="adm-btn" type="submit">
                  Update
                </button>
              </form>
            )}
          </details>
        );
      })}
    </>
  );
}
