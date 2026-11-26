"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Product } from "@/lib/catalog";
import type { DeliverySettings } from "@/lib/delivery";

type Catalog = {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
  delivery: DeliverySettings;
};

const CatalogContext = createContext<Catalog | null>(null);

export function CatalogProvider({
  products,
  delivery,
  children,
}: {
  products: Product[];
  delivery: DeliverySettings;
  children: ReactNode;
}) {
  const value = useMemo<Catalog>(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return { products, getProduct: (id: string) => byId.get(id), delivery };
  }, [products, delivery]);
  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error("CatalogProvider is required");
  return catalog;
}
