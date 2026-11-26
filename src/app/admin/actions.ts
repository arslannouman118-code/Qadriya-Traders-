"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { inquiries, orders, productImages, products, settings } from "@/db/schema";
import {
  checkPassword,
  createSession,
  destroySession,
  requireAdmin,
} from "@/lib/admin-auth";
import { categories, products as sampleProducts } from "@/lib/catalog";
import type { ProductInput, SaveResult } from "./types";

// ---------- Login ----------

const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 6;

export async function login(formData: FormData) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && now - record.first < WINDOW && record.count >= MAX_ATTEMPTS)
    redirect("/admin/login?error=locked");

  const password = String(formData.get("password") || "");
  if (checkPassword(password)) {
    attempts.delete(ip);
    await createSession();
    redirect("/admin");
  }
  // Wrong password: slow down guessing and count the attempt.
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (!record || now - record.first >= WINDOW)
    attempts.set(ip, { count: 1, first: now });
  else record.count += 1;
  redirect("/admin/login?error=wrong");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Products ----------

const UPLOADED_IMAGE = /^\/api\/product-image\/(\d+)$/;

function whole(value: string) {
  const text = value.trim().replace(/,/g, "");
  return /^\d+$/.test(text) ? Number(text) : NaN;
}

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "product"
  );
}

async function uniqueId(name: string) {
  const base = slugify(name);
  let candidate = base;
  for (let n = 2; n < 100; n++) {
    const [existing] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, candidate))
      .limit(1);
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

async function removeUploadedImage(image: string | null | undefined) {
  const match = image ? UPLOADED_IMAGE.exec(image) : null;
  if (match)
    await db.delete(productImages).where(eq(productImages.id, Number(match[1])));
}

export async function saveProduct(input: ProductInput): Promise<SaveResult> {
  await requireAdmin();

  const name = String(input.name || "").trim();
  if (name.length < 2 || name.length > 160)
    return { ok: false, error: "Please enter the product name." };
  if (!categories.some((c) => c.id === input.category))
    return { ok: false, error: "Please choose a category." };
  const price = whole(String(input.price));
  if (!Number.isInteger(price) || price < 1 || price > 10_000_000)
    return { ok: false, error: "Please enter a valid price (numbers only)." };
  let originalPrice: number | null = null;
  if (String(input.originalPrice).trim()) {
    originalPrice = whole(String(input.originalPrice));
    if (!Number.isInteger(originalPrice) || originalPrice <= price)
      return {
        ok: false,
        error: "Old price must be a number higher than the selling price.",
      };
  }
  const stock = whole(String(input.stock));
  if (!Number.isInteger(stock) || stock < 0 || stock > 1_000_000)
    return { ok: false, error: "Please enter the stock (0 or more)." };
  const badge = String(input.badge || "").trim().slice(0, 40) || null;
  const description = String(input.description || "").trim().slice(0, 3000);
  const details = String(input.details || "")
    .split("\n")
    .map((line) => line.trim().slice(0, 200))
    .filter(Boolean)
    .slice(0, 12);

  const imageData = String(input.imageData || "");
  let newImageId: number | null = null;
  if (imageData) {
    const prefix = "data:image/jpeg;base64,";
    if (!imageData.startsWith(prefix) || imageData.length > 1_500_000)
      return {
        ok: false,
        error: "That photo could not be used. Please try a different one.",
      };
    const [row] = await db
      .insert(productImages)
      .values({ mime: "image/jpeg", data: imageData.slice(prefix.length) })
      .returning({ id: productImages.id });
    newImageId = row.id;
  }

  const fields = {
    name,
    category: input.category,
    price,
    originalPrice,
    stock,
    badge,
    description,
    details,
    featured: !!input.featured,
    isNew: !!input.isNew,
    active: !!input.active,
    updatedAt: new Date(),
  };

  if (input.id) {
    const [existing] = await db
      .select()
      .from(products)
      .where(eq(products.id, input.id))
      .limit(1);
    if (!existing) return { ok: false, error: "This product no longer exists." };
    const image = newImageId ? `/api/product-image/${newImageId}` : existing.image;
    await db
      .update(products)
      .set({ ...fields, image })
      .where(eq(products.id, input.id));
    if (newImageId) await removeUploadedImage(existing.image);
  } else {
    const id = await uniqueId(name);
    await db.insert(products).values({
      id,
      ...fields,
      image: newImageId ? `/api/product-image/${newImageId}` : "",
    });
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const [existing] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (!existing) return;
  await db.delete(products).where(eq(products.id, id));
  await removeUploadedImage(existing.image);
  revalidatePath("/", "layout");
}

export async function setProductActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const active = String(formData.get("active")) === "true";
  if (!id) return;
  await db
    .update(products)
    .set({ active, updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidatePath("/", "layout");
}

export async function updateStock(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const stock = whole(String(formData.get("stock") || ""));
  if (!id || !Number.isInteger(stock) || stock < 0 || stock > 1_000_000) return;
  await db
    .update(products)
    .set({ stock, updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidatePath("/", "layout");
}

export async function importSampleProducts() {
  await requireAdmin();
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  if (count > 0) return;
  const base = Date.now();
  await db.insert(products).values(
    sampleProducts.map((p, index) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice ?? null,
      image: p.image,
      description: p.description,
      details: p.details,
      badge: p.badge ?? null,
      featured: !!p.featured,
      isNew: !!p.isNew,
      stock: p.stock,
      active: true,
      // Keeps the original order of the sample products.
      createdAt: new Date(base - index * 1000),
    })),
  );
  revalidatePath("/", "layout");
}

// ---------- Orders ----------

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "");
  if (!Number.isInteger(id) || !STATUSES.includes(status)) return;
  await db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    if (!order || order.status === status || order.status === "cancelled")
      return;
    if (status === "cancelled" && Array.isArray(order.items)) {
      // Put the books of a cancelled order back into stock.
      for (const item of order.items as { id?: unknown; quantity?: unknown }[]) {
        if (typeof item.id !== "string" || !Number.isInteger(item.quantity))
          continue;
        await tx
          .update(products)
          .set({ stock: sql`${products.stock} + ${item.quantity as number}` })
          .where(and(eq(products.id, item.id)));
      }
    }
    await tx.update(orders).set({ status }).where(eq(orders.id, id));
  });
  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");
}

// ---------- Order delivery charge (one order only) ----------

export async function updateOrderDelivery(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const delivery = whole(String(formData.get("delivery") || ""));
  if (!Number.isInteger(id) || !Number.isInteger(delivery)) return;
  if (delivery < 0 || delivery > 1_000_000) return;
  await db.transaction(async (tx) => {
    const [order] = await tx
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);
    if (!order || order.status === "cancelled") return;
    await tx
      .update(orders)
      .set({ delivery, total: order.subtotal + delivery })
      .where(eq(orders.id, id));
  });
  revalidatePath("/admin", "layout");
}

// ---------- Delivery settings (for all new orders) ----------

export async function saveDeliverySettings(formData: FormData) {
  await requireAdmin();
  const fee = whole(String(formData.get("fee") || ""));
  const threshold = whole(String(formData.get("threshold") || ""));
  if (
    !Number.isInteger(fee) ||
    fee < 0 ||
    fee > 1_000_000 ||
    !Number.isInteger(threshold) ||
    threshold < 0 ||
    threshold > 100_000_000
  )
    redirect("/admin/settings?error=1");
  const now = new Date();
  for (const [key, value] of [
    ["delivery_fee", fee],
    ["free_delivery_threshold", threshold],
  ] as const) {
    await db
      .insert(settings)
      .values({ key, value: String(value), updatedAt: now })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: String(value), updatedAt: now },
      });
  }
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

// ---------- Contact messages ----------

export async function setMessageHandled(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const handled = String(formData.get("handled")) === "true";
  if (!Number.isInteger(id)) return;
  await db.update(inquiries).set({ handled }).where(eq(inquiries.id, id));
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await db.delete(inquiries).where(eq(inquiries.id, id));
  revalidatePath("/admin", "layout");
}
