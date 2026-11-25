"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store-provider";
import { categories, formatPrice } from "@/lib/catalog";
import { useCatalog } from "./catalog-provider";

export function SearchDialog() {
  const { products } = useCatalog();
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [setSearchOpen]);
  const results = products
    .filter((p) =>
      `${p.name} ${p.category} ${p.description}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    )
    .slice(0, 6);
  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="modal-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="overlay" onClick={() => setSearchOpen(false)} />
          <motion.div
            className="search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <div className="search-input">
              <Search size={23} />
              <input
                autoFocus
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="icon-button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={21} />
              </button>
            </div>
            <div className="search-results">
              <p className="eyebrow">
                {query
                  ? `${results.length} MATCHING FINDS`
                  : "A LITTLE INSPIRATION"}
              </p>
              {!query && (
                <div className="search-categories">
                  {categories.slice(0, 6).map((c) => (
                    <Link
                      href={`/shop?category=${c.id}`}
                      key={c.id}
                      onClick={() => setSearchOpen(false)}
                    >
                      {c.shortName}
                      <ArrowUpRight size={15} />
                    </Link>
                  ))}
                </div>
              )}
              {results.map((p) => (
                <Link
                  className="search-result"
                  key={p.id}
                  href={`/product/${p.id}`}
                  onClick={() => setSearchOpen(false)}
                >
                  <img src={p.image} alt={p.name} />
                  <div>
                    <strong>{p.name}</strong>
                    <span>{formatPrice(p.price)}</span>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              ))}
              {query && !results.length && (
                <p className="search-empty">
                  No products found. Try “notebook”, “pens”, or “art”.
                </p>
              )}
              <Link
                href={`/shop?q=${encodeURIComponent(query)}`}
                className="text-link"
                onClick={() => setSearchOpen(false)}
              >
                Browse all products <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
