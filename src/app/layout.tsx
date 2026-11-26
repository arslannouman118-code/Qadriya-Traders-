import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StoreProvider } from "@/components/store-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Overlays } from "@/components/overlays";
import { CatalogProvider } from "@/components/catalog-provider";
import { PublicOnly } from "@/components/public-only";
import { getProducts } from "@/lib/products";
import { getDeliverySettings } from "@/lib/settings";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Qadriya Traders | Books, Stationery & A Little Inspiration",
    template: "%s | Qadriya Traders",
  },
  description:
    "Discover thoughtfully chosen books, stationery, art supplies, and everyday essentials at Qadriya Traders. Everything you need to learn, create & grow.",
};

// Products come from the database, so pages are built fresh for every visit.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [products, delivery] = await Promise.all([
    getProducts(),
    getDeliverySettings(),
  ]);
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CatalogProvider products={products} delivery={delivery}>
          <StoreProvider>
            <PublicOnly>
              <SiteHeader />
            </PublicOnly>
            <main>{children}</main>
            <PublicOnly>
              <SiteFooter />
            </PublicOnly>
            <PublicOnly>
              <Overlays />
            </PublicOnly>
          </StoreProvider>
        </CatalogProvider>
      </body>
    </html>
  );
}
