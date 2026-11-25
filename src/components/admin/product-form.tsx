"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/catalog";
import { saveProduct } from "@/app/admin/actions";
import type { ProductInput } from "@/app/admin/types";

type Initial = {
  id?: string;
  name: string;
  category: string;
  price: number | null;
  originalPrice: number | null;
  stock: number;
  badge: string;
  description: string;
  details: string[];
  featured: boolean;
  isNew: boolean;
  active: boolean;
  image: string;
};

async function resizeToJpeg(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  let quality = 0.82;
  let data = canvas.toDataURL("image/jpeg", quality);
  while (data.length > 700_000 && quality > 0.45) {
    quality -= 0.1;
    data = canvas.toDataURL("image/jpeg", quality);
  }
  return data;
}

export function ProductForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial.name,
    category: initial.category,
    price: initial.price == null ? "" : String(initial.price),
    originalPrice:
      initial.originalPrice == null ? "" : String(initial.originalPrice),
    stock: String(initial.stock),
    badge: initial.badge,
    description: initial.description,
    details: initial.details.join("\n"),
    featured: initial.featured,
    isNew: initial.isNew,
    active: initial.active,
  });
  const [imageData, setImageData] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function choosePhoto(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      setImageData(await resizeToJpeg(file));
    } catch {
      setError("Could not read that photo. Please choose a JPG or PNG image.");
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const input: ProductInput = { id: initial.id, ...form, imageData };
    try {
      const result = await saveProduct(input);
      if (!result.ok) {
        setError(result.error);
        setSaving(false);
        return;
      }
      router.push("/admin/products?saved=1");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  const preview = imageData || initial.image;

  return (
    <form className="adm-card adm-form" onSubmit={submit}>
      <div className="adm-photo">
        {preview ? (
          <img src={preview} alt="Product" />
        ) : (
          <div className="adm-photo-empty">No photo yet</div>
        )}
        <label className="adm-btn adm-btn-light">
          {preview ? "Change photo" : "Choose photo"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => choosePhoto(e.target.files?.[0])}
          />
        </label>
        {imageData && <small>New photo ready. Press Save to keep it.</small>}
      </div>

      <div className="adm-fields">
        <label>
          Product name *
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={160}
            required
          />
        </label>
        <label>
          Category *
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="adm-row3">
          <label>
            Price (Rs) *
            <input
              inputMode="numeric"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="e.g. 450"
              required
            />
          </label>
          <label>
            Old price (Rs)
            <input
              inputMode="numeric"
              value={form.originalPrice}
              onChange={(e) => set("originalPrice", e.target.value)}
              placeholder="Only if on sale"
            />
          </label>
          <label>
            Stock *
            <input
              inputMode="numeric"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              required
            />
          </label>
        </div>
        <label>
          Badge
          <input
            value={form.badge}
            onChange={(e) => set("badge", e.target.value)}
            maxLength={40}
            placeholder="Leave empty for automatic (SAVE Rs … / NEW)"
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={4}
            maxLength={3000}
          />
        </label>
        <label>
          Key points (one per line)
          <textarea
            value={form.details}
            onChange={(e) => set("details", e.target.value)}
            rows={4}
            placeholder={"80 ruled pages\nA5 size"}
          />
        </label>
        <div className="adm-checks">
          <label>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
            />
            Show on website
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            Featured on home page
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.isNew}
              onChange={(e) => set("isNew", e.target.checked)}
            />
            Mark as new arrival
          </label>
        </div>
        {error && <p className="adm-error">{error}</p>}
        <div className="adm-actions">
          <button className="adm-btn" disabled={saving} type="submit">
            {saving ? "Saving…" : "Save product"}
          </button>
          <Link href="/admin/products" className="adm-btn adm-btn-light">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
