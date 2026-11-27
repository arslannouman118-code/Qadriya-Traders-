import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { getProducts } from "@/lib/products";
import { business, whatsappUrl } from "@/lib/business";

export const metadata: Metadata = {
  title: "Binding Materials",
  description:
    "Binding materials from Qadriya Traders. Pick what you need and order online, or ask us if you can’t find it.",
};

export default async function BindingMaterialsPage() {
  const all = await getProducts();
  const materials = all.filter((p) => p.category === "binding-materials");
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <span>Binding Materials</span>
          </div>
          <p className="eyebrow">BINDING MATERIALS</p>
          <h1>Everything you need to bind your books.</h1>
          <p>
            Choose the materials you need and order them online. Prefer to have
            your books bound for you? We can do that too.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {materials.length > 0 ? (
            <>
              <p style={{ margin: "0 0 20px" }}>
                {materials.length}{" "}
                {materials.length === 1 ? "material" : "materials"} available
              </p>
              <div className="product-grid">
                {materials.map((product, i) => (
                  <Reveal key={product.id} delay={i * 0.04}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h3>Our binding materials are on their way.</h3>
              <p>
                We’re getting the list ready. In the meantime, tell us what you
                need and we’ll let you know what we have.
              </p>
              <a
                href={whatsappUrl(
                  "Hello Qadriya Traders! I’d like to ask about binding materials.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-primary"
              >
                <MessageCircle size={17} /> Ask on WhatsApp{" "}
                <ArrowUpRight size={16} />
              </a>
            </div>
          )}
        </div>
      </section>
      <div className="container category-promo">
        <div>
          <h2>Want your books bound for you?</h2>
          <p>
            Tell us how many books and what kind of binding you need, and we’ll
            get back to you{business.phone ? " by email or phone" : ""}.
          </p>
        </div>
        <Link href="/book-binding" className="button button-primary">
          Book binding service <ArrowRight size={17} />
        </Link>
      </div>
    </>
  );
}
