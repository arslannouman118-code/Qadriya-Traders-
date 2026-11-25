"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Product } from "@/lib/catalog";

type Catalog = {
  products: Product[];
  getProduct: (id: string) => Product | undefined;
};

const CatalogContext = createContext<Catalog | null>(null);

export function CatalogProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const value = useMemo<Catalog>(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    return { products, getProduct: (id: string) => byId.get(id) };
  }, [products]);
  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error("CatalogProvider is required");
  return catalog;
}
