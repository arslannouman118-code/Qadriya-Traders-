import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ShopClient } from "@/components/shop/shop-client";
import { Newsletter } from "@/components/newsletter";
import { getCategory } from "@/lib/catalog";
export const metadata: Metadata = { title: "Shop Books & Stationery" };
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  const query = typeof params.q === "string" ? params.q : "";
  const sort = typeof params.sort === "string" ? params.sort : "";
  const offer = params.offer === "true";
  const saved = params.saved === "true";
  const title = saved
    ? "Your saved favourites"
    : offer
      ? "Little prices. Lovely finds."
      : getCategory(category)?.name ||
        (sort === "newest"
          ? "Fresh on our shelves"
          : "A world of everyday possibilities");
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <span>Shop</span>
          </div>
          <p className="eyebrow">THOUGHTFULLY CHOSEN. JUST FOR YOU.</p>
          <h1>{title}</h1>
          <p>
            Books, stationery, and little essentials to make every day a little
            more inspired.
          </p>
        </div>
      </section>
      <ShopClient
        initialCategory={category}
        initialQuery={query}
        initialSort={sort}
        offer={offer}
        saved={saved}
      />
      <Newsletter />
    </>
  );
}
