import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CheckoutClient } from "@/components/checkout/checkout-client";
export const metadata: Metadata = { title: "Checkout" };
export default function CheckoutPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <Link href="/shop">Shop</Link>
            <ChevronRight size={12} />
            <span>Checkout</span>
          </div>
          <p className="eyebrow">ALMOST YOURS</p>
          <h1>A few details, and you’re all set.</h1>
          <p>Secure checkout. Thoughtful service. A little joy on its way.</p>
        </div>
      </section>
      <CheckoutClient />
    </>
  );
}
