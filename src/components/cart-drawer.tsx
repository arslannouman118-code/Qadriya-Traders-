"use client";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  X,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
} from "lucide-react";
import { useStore } from "./store-provider";
import { formatPrice } from "@/lib/catalog";
import { useCatalog } from "./catalog-provider";
import { calcDelivery } from "@/lib/delivery";
import { useEffect } from "react";

export function CartDrawer() {
  const { getProduct, delivery } = useCatalog();
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartCount,
    subtotal,
    updateQuantity,
    removeItem,
  } = useStore();
  useEffect(() => {
    if (!cartOpen) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    document.addEventListener("keydown", listener);
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", listener);
      document.body.style.overflow = old;
    };
  }, [cartOpen, setCartOpen]);
  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="drawer-layer">
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">YOUR GOOD FINDS</span>
                <h2>
                  Shopping bag <span>({cartCount})</span>
                </h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>
            {cart.length ? (
              <>
                {delivery.fee > 0 && delivery.freeThreshold > 0 ? (
                  <div className="delivery-progress">
                    <Truck size={18} />
                    <p>
                      {subtotal >= delivery.freeThreshold ? (
                        "Lovely! Your order qualifies for free delivery."
                      ) : (
                        <>
                          You’re{" "}
                          <strong>
                            {formatPrice(delivery.freeThreshold - subtotal)}
                          </strong>{" "}
                          away from free delivery.
                        </>
                      )}
                    </p>
                    <div>
                      <span
                        style={{
                          width: `${Math.min((subtotal / delivery.freeThreshold) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : null}
                <div className="cart-items">
                  {cart.map((item) => {
                    const p = getProduct(item.id)!;
                    return (
                      <div className="cart-item" key={item.id}>
                        <img src={p.image} alt={p.name} />
                        <div>
                          <Link
                            href={`/product/${p.id}`}
                            onClick={() => setCartOpen(false)}
                          >
                            {p.name}
                          </Link>
                          <p>{formatPrice(p.price)}</p>
                          <div className="quantity-control">
                            <button
                              onClick={() =>
                                updateQuantity(p.id, item.quantity - 1)
                              }
                              aria-label={`Decrease ${p.name} quantity`}
                            >
                              <Minus size={13} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(p.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= p.stock}
                              aria-label={`Increase ${p.name} quantity`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                        <button
                          className="remove-item"
                          onClick={() => removeItem(p.id)}
                          aria-label={`Remove ${p.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </div>
                  <p>
                    Delivery calculated at checkout. All prices include taxes.
                  </p>
                  <Link
                    href="/checkout"
                    className="button button-primary"
                    onClick={() => setCartOpen(false)}
                  >
                    Proceed to checkout <ArrowRight size={17} />
                  </Link>
                  <button
                    className="continue-shopping"
                    onClick={() => setCartOpen(false)}
                  >
                    Continue exploring
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <ShoppingBag size={48} strokeWidth={1} />
                <h3>A little empty, a lot of possibility.</h3>
                <p>Find something you’ll love, and we’ll keep it here.</p>
                <Link
                  className="button button-primary"
                  href="/shop"
                  onClick={() => setCartOpen(false)}
                >
                  Explore the shop <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
