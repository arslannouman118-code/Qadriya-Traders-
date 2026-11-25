"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store-provider";
import { formatPrice, getCategory } from "@/lib/catalog";

export function QuickView() {
  const { quickView: product, setQuickView, addItem, setCartOpen } = useStore();
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    setQuantity(1);
  }, [product]);
  useEffect(() => {
    if (!product) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickView(null);
    };
    document.addEventListener("keydown", listener);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", listener);
      document.body.style.overflow = old;
    };
  }, [product, setQuickView]);
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="modal-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="overlay" onClick={() => setQuickView(null)} />
          <motion.div
            className="quick-view-modal"
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            initial={{ y: 25, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
          >
            <button
              className="modal-close icon-button"
              onClick={() => setQuickView(null)}
              aria-label="Close quick view"
            >
              <X />
            </button>
            <div className="quick-view-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="quick-view-content">
              <p className="eyebrow">{getCategory(product.category)?.name}</p>
              <h2>{product.name}</h2>
              <div className="detail-price">
                <strong>{formatPrice(product.price)}</strong>
                {product.originalPrice && (
                  <del>{formatPrice(product.originalPrice)}</del>
                )}
              </div>
              <p>{product.description}</p>
              <span className="availability">
                <Check size={15} /> In stock · Ready for your next idea
              </span>
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
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => {
                    addItem(product.id, quantity);
                    setQuickView(null);
                    setCartOpen(true);
                  }}
                >
                  <ShoppingBag size={18} /> Add to bag
                </button>
              </div>
              <Link
                href={`/product/${product.id}`}
                className="text-link"
                onClick={() => setQuickView(null)}
              >
                View full details <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
