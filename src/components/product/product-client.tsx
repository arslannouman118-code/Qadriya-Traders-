"use client";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Heart, Check, Truck } from "lucide-react";
import { type Product, formatPrice, getCategory } from "@/lib/catalog";
import { useStore } from "../store-provider";
export function ProductClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const { addItem, setCartOpen, wishlist, toggleWishlist } = useStore();
  const saved = wishlist.includes(product.id);
  return (
    <div className="product-detail-grid">
      <div>
        <div className="detail-gallery-main">
          <img
            src={product.image}
            alt={product.name}
            style={{
              transform:
                imageIndex === 1
                  ? "scale(1.4)"
                  : imageIndex === 2
                    ? "scale(1.15)"
                    : "scale(1)",
              objectPosition:
                imageIndex === 1
                  ? "65% 50%"
                  : imageIndex === 2
                    ? "30% 40%"
                    : "center",
            }}
          />
          {product.badge && (
            <span className="product-badge">{product.badge}</span>
          )}
        </div>
        <div className="gallery-thumbnails">
          {["Full view", "Close-up detail", "Alternate crop"].map(
            (label, i) => (
              <button
                key={label}
                className={imageIndex === i ? "active" : ""}
                onClick={() => setImageIndex(i)}
                aria-label={label}
              >
                <img
                  src={product.image}
                  alt={label}
                  style={{
                    transform:
                      i === 1 ? "scale(1.4)" : i === 2 ? "scale(1.15)" : "none",
                    objectPosition: i === 1 ? "65% 50%" : "center",
                  }}
                />
              </button>
            ),
          )}
        </div>
      </div>
      <div className="detail-content">
        <p className="eyebrow">{getCategory(product.category)?.name}</p>
        <h1>{product.name}</h1>
        <div className="detail-price">
          <strong>{formatPrice(product.price)}</strong>
          {product.originalPrice && (
            <del>{formatPrice(product.originalPrice)}</del>
          )}
        </div>
        <span className="availability">
          <Check size={15} /> In stock · {product.stock} available
        </span>
        <p className="detail-description">{product.description}</p>
        <div className="detail-specs">
          <h3>The little details</h3>
          <ul>
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="detail-actions">
          <div className="quantity-control">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>
          <button
            className="button button-primary"
            onClick={() => {
              addItem(product.id, quantity);
              setCartOpen(true);
            }}
          >
            <ShoppingBag size={18} /> Add to bag
          </button>
        </div>
        <button
          className="detail-wishlist"
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved to your favourites" : "Save for a little later"}
        </button>
        <div className="detail-delivery">
          <Truck size={25} />
          <div>
            <strong>Delivered with care</strong>
            <small>Free delivery on orders Rs 999+. Otherwise Rs 49.</small>
          </div>
        </div>
      </div>
    </div>
  );
}