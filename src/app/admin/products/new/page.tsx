import { requireAdmin } from "@/lib/admin-auth";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <h1>Add product</h1>
      <p className="adm-sub">Fields marked * are needed.</p>
      <ProductForm
        initial={{
          name: "",
          category: "",
          price: null,
          originalPrice: null,
          stock: 10,
          badge: "",
          description: "",
          details: [],
          featured: false,
          isNew: true,
          active: true,
          image: "",
        }}
      />
    </>
  );
}
