import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { formatPrice, getCategory } from "@/lib/catalog";
import { PLACEHOLDER_IMAGE } from "@/lib/products";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteProduct, setProductActive, updateStock } from "../actions";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;
  let rows: (typeof products.$inferSelect)[] | null = null;
  try {
    rows = await db
      .select()
      .from(products)
      .orderBy(desc(products.createdAt), asc(products.name));
  } catch (error) {
    console.error("Admin products query failed", error);
  }
  if (!rows)
    return (
      <div className="adm-note">
        <strong>The products table is not ready yet.</strong> In the VS Code
        terminal run <code>npx drizzle-kit push</code>, then refresh.
      </div>
    );

  return (
    <>
      <div className="adm-bar">
        <div>
          <h1>Products</h1>
          <p className="adm-sub" style={{ margin: 0 }}>
            {rows.length} products. Change stock right here, or open a product
            to edit everything.
          </p>
        </div>
        <Link className="adm-btn" href="/admin/products/new">
          + Add product
        </Link>
      </div>
      {saved && <div className="adm-ok">Saved. The website is updated.</div>}
      <div className="adm-card">
        {rows.length === 0 ? (
          <p style={{ margin: 0 }}>
            No products yet. Press “Add product” to create the first one.
          </p>
        ) : (
          <div className="adm-table-wrap">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>On website</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.image || PLACEHOLDER_IMAGE} alt="" />
                    </td>
                    <td>
                      <strong>{p.name}</strong>
                      <br />
                      <small>{getCategory(p.category)?.name || p.category}</small>
                    </td>
                    <td>
                      {formatPrice(p.price)}
                      {p.originalPrice ? (
                        <>
                          <br />
                          <small style={{ textDecoration: "line-through" }}>
                            {formatPrice(p.originalPrice)}
                          </small>
                        </>
                      ) : null}
                    </td>
                    <td>
                      <form action={updateStock}>
                        <input type="hidden" name="id" value={p.id} />
                        <input
                          className={`adm-num${p.stock <= 5 ? " adm-low" : ""}`}
                          name="stock"
                          defaultValue={p.stock}
                          inputMode="numeric"
                          aria-label={`Stock for ${p.name}`}
                        />
                        <button className="adm-btn adm-btn-light adm-btn-sm" type="submit">
                          Save
                        </button>
                      </form>
                    </td>
                    <td>
                      <form action={setProductActive}>
                        <input type="hidden" name="id" value={p.id} />
                        <input
                          type="hidden"
                          name="active"
                          value={p.active ? "false" : "true"}
                        />
                        <span className={`adm-pill ${p.active ? "ok" : "off"}`}>
                          {p.active ? "Visible" : "Hidden"}
                        </span>
                        <button className="adm-btn adm-btn-light adm-btn-sm" type="submit">
                          {p.active ? "Hide" : "Show"}
                        </button>
                      </form>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <Link
                        className="adm-btn adm-btn-light adm-btn-sm"
                        href={`/admin/products/${p.id}`}
                      >
                        Edit
                      </Link>{" "}
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmButton
                          className="adm-btn adm-btn-danger adm-btn-sm"
                          message={`Delete “${p.name}”? This cannot be undone. (To keep it but remove it from the website, use Hide instead.)`}
                        >
                          Delete
                        </ConfirmButton>
                      </form>
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
