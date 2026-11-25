import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { CategoryGrid } from "@/components/home/category-grid";
import { Newsletter } from "@/components/newsletter";
export const metadata: Metadata = { title: "Explore Our Categories" };
export default function CategoriesPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <span>Categories</span>
          </div>
          <p className="eyebrow">FIND YOUR NEXT FAVOURITE</p>
          <h1>A little something for every need.</h1>
          <p>
            From classroom essentials to creative companions — find your kind of
            inspiration.
          </p>
        </div>
      </section>
      <CategoryGrid all />
      <div className="container category-promo">
        <div>
          <h2>Not sure where to start?</h2>
          <p>
            Explore our full collection. Your next favourite might be a click
            away.
          </p>
        </div>
        <Link href="/shop" className="button button-primary">
          Shop all products <ArrowRight size={17} />
        </Link>
      </div>
      <Newsletter />
    </>
  );
}
