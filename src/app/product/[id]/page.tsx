import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProducts } from "@/lib/products";
import { ProductClient } from "@/components/product/product-client";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Newsletter } from "@/components/newsletter";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = (await getProducts()).find((p) => p.id === id);
  return {
    title: product?.name || "Product not found",
    description: product?.description,
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const products = await getProducts();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  const related = [
    ...products.filter((p) => p.category === product.category && p.id !== id),
    ...products.filter((p) => p.category !== product.category),
  ].slice(0, 4);
  return (
    <>
      <div className="container product-detail">
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop">Shop</Link>
          <ChevronRight size={12} />
          <span>{product.name}</span>
        </div>
        <ProductClient product={product} />
      </div>
      <section className="section related-section">
        <div className="container">
          <SectionHeading
            eyebrow="BETTER TOGETHER"
            title="A few more things you might love"
            link="/shop"
            linkText="Explore all products"
          />
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
