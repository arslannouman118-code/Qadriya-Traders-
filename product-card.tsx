"use client";
import Link from "next/link";
import { Heart, Plus, Eye, ShoppingBag } from "lucide-react";
import { useStore } from "./store-provider";
import { formatPrice, getCategory, type Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, setQuickView, wishlist, toggleWishlist } = useStore();
  const saved = wishlist.includes(product.id);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link href={`/product/${product.id}`} aria-label={product.name}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        {product.badge && (
          <span
            className={`product-badge ${product.badge === "NEW" ? "badge-new" : ""}`}
          >
            {product.badge}
          </span>
        )}
        <button
          className={`wishlist-button ${saved ? "saved" : ""}`}
          aria-label={
            saved
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name}`
          }
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart
            size={18}
            fill={saved ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        </button>
        <button
          className="quick-view-button"
          onClick={() => setQuickView(product)}
        >
          <Eye size={16} /> Quick view
        </button>
      </div>
      <div className="product-info">
        <p className="product-category">
          {getCategory(product.category)?.name}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="product-bottom">
          <div className="product-price">
            <strong>{formatPrice(product.price)}</strong>
            {product.originalPrice && (
              <del>{formatPrice(product.originalPrice)}</del>
            )}
          </div>
          <button
            className="add-button"
            onClick={() => addItem(product.id)}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={18} />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <ShoppingBag size={42} strokeWidth={1} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
