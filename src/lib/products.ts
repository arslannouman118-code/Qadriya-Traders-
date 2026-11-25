import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable } from "@/db/schema";
import { products as sampleProducts, type Product } from "@/lib/catalog";

export const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#ece8e1"/><text x="400" y="410" font-family="Arial,sans-serif" font-size="34" text-anchor="middle" fill="#9a948a">No image yet</text></svg>',
)}`;

export type ProductRow = typeof productsTable.$inferSelect;

export function rowToProduct(row: ProductRow): Product {
  const hasDiscount =
    row.originalPrice != null && row.originalPrice > row.price;
  const badge =
    row.badge ||
    (hasDiscount
      ? `SAVE Rs ${(row.originalPrice! - row.price).toLocaleString("en-PK")}`
      : row.isNew
        ? "NEW"
        : undefined);
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    originalPrice: hasDiscount ? row.originalPrice! : undefined,
    image: row.image || PLACEHOLDER_IMAGE,
    description: row.description,
    details: Array.isArray(row.details) ? row.details : [],
    badge,
    featured: row.featured,
    isNew: row.isNew,
    stock: row.stock,
  };
}

/**
 * Products shown on the public website.
 * Uses the database when it is connected, and the built-in sample products
 * when it is not (or when the products table has not been created yet).
 */
export async function getProducts(): Promise<Product[]> {
  if (!process.env.DATABASE_URL) return sampleProducts;
  try {
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.active, true))
      .orderBy(desc(productsTable.createdAt), asc(productsTable.name));
    return rows.map(rowToProduct);
  } catch (error) {
    console.error("Could not load products from the database", error);
    return sampleProducts;
  }
}

export async function getProductById(id: string) {
  const all = await getProducts();
  return all.find((p) => p.id === id);
}
