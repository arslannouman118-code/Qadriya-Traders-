import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [p] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  if (!p) notFound();
  return (
    <>
      <h1>Edit product</h1>
      <p className="adm-sub">{p.name}</p>
      <ProductForm
        key={p.updatedAt.toISOString()}
        initial={{
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          originalPrice: p.originalPrice,
          stock: p.stock,
          badge: p.badge ?? "",
          description: p.description,
          details: Array.isArray(p.details) ? p.details : [],
          featured: p.featured,
          isNew: p.isNew,
          active: p.active,
          image: p.image,
        }}
      />
    </>
  );
}
