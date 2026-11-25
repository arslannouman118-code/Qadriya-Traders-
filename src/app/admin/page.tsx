import Link from "next/link";
import { desc, eq, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice } from "@/lib/catalog";
import { importSampleProducts } from "./actions";

export default async function AdminDashboard() {
  await requireAdmin();
  let data: {
    productCount: number;
    lowStock: number;
    pending: number;
    orderCount: number;
    recent: (typeof orders.$inferSelect)[];
  } | null = null;
  try {
    const [p] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);
    const [low] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(lte(products.stock, 5));
    const [pend] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(eq(orders.status, "pending"));
    const [all] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders);
    const recent = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);
    data = {
      productCount: p.count,
      lowStock: low.count,
      pending: pend.count,
      orderCount: all.count,
      recent,
    };
  } catch (error) {
    console.error("Admin dashboard query failed", error);
  }

  if (!data)
    return (
      <div className="adm-note">
        <strong>The database tables are not ready yet.</strong> In the VS Code
        terminal run <code>npx drizzle-kit push</code>, then refresh this page.
      </div>
    );

  return (
    <>
      <h1>Dashboard</h1>
      <p className="adm-sub">A quick look at your shop.</p>
      {data.productCount === 0 && (
        <div className="adm-note">
          <p style={{ margin: "0 0 10px" }}>
            <strong>You have no products in the database yet.</strong> Until you
            add some, the website keeps showing the sample products. You can
            copy the 24 sample products in and edit them, or start fresh with
            your own.
          </p>
          <form action={importSampleProducts} style={{ display: "inline" }}>
            <button className="adm-btn adm-btn-sm" type="submit">
              Copy sample products
            </button>
          </form>{" "}
          <Link className="adm-btn adm-btn-sm adm-btn-light" href="/admin/products/new">
            Add my first product
          </Link>
        </div>
      )}
      <div className="adm-grid">
        <Link href="/admin/orders?status=pending" className={`adm-stat${data.pending ? " warn" : ""}`}>
          <b>{data.pending}</b>
          <span>New orders waiting</span>
        </Link>
        <Link href="/admin/orders" className="adm-stat">
          <b>{data.orderCount}</b>
          <span>All orders</span>
        </Link>
        <Link href="/admin/products" className="adm-stat">
          <b>{data.productCount}</b>
          <span>Products</span>
        </Link>
        <Link href="/admin/products" className={`adm-stat${data.lowStock ? " warn" : ""}`}>
          <b>{data.lowStock}</b>
          <span>Low or out of stock (5 or less)</span>
        </Link>
      </div>
      <div className="adm-card">
        <h2>Latest orders</h2>
        {data.recent.length === 0 ? (
          <p className="adm-sub" style={{ margin: 0 }}>
            No orders yet.
          </p>
        ) : (
          <div className="adm-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href="/admin/orders">{o.reference}</Link>
                    </td>
                    <td>
                      {o.name}
                      <br />
                      <small>{o.phone}</small>
                    </td>
                    <td>{formatPrice(o.total)}</td>
                    <td>
                      <span className={`adm-pill ${o.status}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
