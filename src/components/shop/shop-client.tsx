"use client";
import { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, Heart } from "lucide-react";
import { categories, getCategory, formatPrice } from "@/lib/catalog";
import { useCatalog } from "../catalog-provider";
import { ProductCard, EmptyState } from "../product-card";
import { useStore } from "../store-provider";

export function ShopClient({
  initialCategory = "",
  initialQuery = "",
  initialSort = "",
  offer = false,
  saved = false,
}: {
  initialCategory?: string;
  initialQuery?: string;
  initialSort?: string;
  offer?: boolean;
  saved?: boolean;
}) {
  const { products } = useCatalog();
  // The price slider always reaches the most expensive product.
  const priceMax = Math.max(
    1000,
    Math.ceil(Math.max(0, ...products.map((p) => p.price)) / 500) * 500,
  );
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState(initialSort);
  const [maxPrice, setMaxPrice] = useState(priceMax);
  const [saleOnly, setSaleOnly] = useState(offer);
  const [savedOnly, setSavedOnly] = useState(saved);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { wishlist } = useStore();
  useEffect(() => {
    setCategory(initialCategory);
    setQuery(initialQuery);
    setSort(initialSort);
    setSaleOnly(offer);
    setSavedOnly(saved);
  }, [initialCategory, initialQuery, initialSort, offer, saved]);
  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!query ||
          `${p.name} ${p.description} ${getCategory(p.category)?.name}`
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        p.price <= maxPrice &&
        (!saleOnly || p.originalPrice) &&
        (!savedOnly || wishlist.includes(p.id)),
    );
    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    if (sort === "newest")
      list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === "popular")
      list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [
    products,
    category,
    query,
    sort,
    maxPrice,
    saleOnly,
    savedOnly,
    wishlist,
  ]);
  const reset = () => {
    setCategory("");
    setQuery("");
    setSort("");
    setMaxPrice(priceMax);
    setSaleOnly(false);
    setSavedOnly(false);
  };
  return (
    <div className="container shop-layout">
      <aside className={`filter-sidebar ${filtersOpen ? "mobile-open" : ""}`}>
        <div className="filter-title">
          <h3>Filter your finds</h3>
          <button onClick={reset}>Reset all</button>
        </div>
        <div className="filter-group">
          <h4>Categories</h4>
          <label className="filter-option">
            <input
              type="radio"
              name="category"
              checked={!category}
              onChange={() => setCategory("")}
            />
            <span>All categories</span>
            <small>{products.length}</small>
          </label>
          {categories.map((c) => (
            <label className="filter-option" key={c.id}>
              <input
                type="radio"
                name="category"
                checked={category === c.id}
                onChange={() => setCategory(c.id)}
              />
              <span>{c.name}</span>
              <small>
                {products.filter((p) => p.category === c.id).length}
              </small>
            </label>
          ))}
        </div>
        <div className="filter-group">
          <h4>Price range</h4>
          <input
            aria-label="Maximum price"
            type="range"
            min="50"
            max={priceMax}
            step="50"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          <div className="price-range-labels">
            <span>Rs 0</span>
            <span>Up to {formatPrice(maxPrice)}</span>
          </div>
        </div>
        <div className="filter-group">
          <h4>A little extra</h4>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={saleOnly}
              onChange={(e) => setSaleOnly(e.target.checked)}
            />
            <span>On special offer</span>
          </label>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={savedOnly}
              onChange={(e) => setSavedOnly(e.target.checked)}
            />
            <span>My saved favourites</span>
            <Heart size={13} />
          </label>
        </div>
      </aside>
      <div>
        <div className="shop-toolbar">
          <div className="shop-search">
            <Search size={17} />
            <input
              aria-label="Search the shop"
              placeholder="Search for a little inspiration…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="icon-button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            className="filter-mobile-button"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="">Featured first</option>
            <option value="popular">Bestsellers</option>
            <option value="newest">New arrivals</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
          <span className="result-count">{filtered.length} products</span>
        </div>
        {(category || saleOnly || savedOnly) && (
          <div className="active-filters">
            {category && (
              <button onClick={() => setCategory("")}>
                {getCategory(category)?.name}
                <X size={12} />
              </button>
            )}
            {saleOnly && (
              <button onClick={() => setSaleOnly(false)}>
                Special offers
                <X size={12} />
              </button>
            )}
            {savedOnly && (
              <button onClick={() => setSavedOnly(false)}>
                Saved favourites
                <X size={12} />
              </button>
            )}
          </div>
        )}
        <div className="product-grid shop-grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {!filtered.length && (
            <EmptyState
              title="A fresh search, perhaps?"
              text={
                savedOnly
                  ? "Save products using the heart icon, or explore more of our collection."
                  : "We couldn’t find a match. Try another search or reset your filters."
              }
              action={
                <button className="button button-primary" onClick={reset}>
                  Explore all products
                </button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
