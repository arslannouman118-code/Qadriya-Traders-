"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig } from "framer-motion";
import type { Product } from "@/lib/catalog";
import { useCatalog } from "./catalog-provider";

export type CartItem = { id: string; quantity: number };
type Store = {
  cart: CartItem[];
  addItem: (id: string, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  quickView: Product | null;
  setQuickView: (product: Product | null) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
  toast: string;
  notify: (message: string) => void;
};
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { getProduct } = useCatalog();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("qadriya-cart") || "[]");
      if (Array.isArray(saved))
        setCart(
          saved
            .filter(
              (i: CartItem) =>
                getProduct(i.id) &&
                Number.isInteger(i.quantity) &&
                i.quantity > 0,
            )
            .map((i: CartItem) => ({
              id: i.id,
              quantity: Math.min(i.quantity, getProduct(i.id)!.stock),
            })),
        );
      const savedWishlist = JSON.parse(
        localStorage.getItem("qadriya-wishlist") || "[]",
      );
      if (Array.isArray(savedWishlist))
        setWishlist(savedWishlist.filter((id: string) => getProduct(id)));
    } catch {
      /* A fresh cart is used if local storage is unavailable. */
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Drop items from the bag if the shop has removed or hidden them.
    if (!ready) return;
    setCart((current) => {
      const kept = current.filter((i) => getProduct(i.id));
      return kept.length === current.length ? current : kept;
    });
  }, [getProduct, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem("qadriya-cart", JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready)
      localStorage.setItem("qadriya-wishlist", JSON.stringify(wishlist));
  }, [wishlist, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const addItem = (id: string, quantity = 1) => {
    const product = getProduct(id);
    if (!product) return;
    setCart((current) => {
      const existing = current.find((i) => i.id === id);
      return existing
        ? current.map((i) =>
            i.id === id
              ? {
                  ...i,
                  quantity: Math.min(i.quantity + quantity, product.stock),
                }
              : i,
          )
        : [...current, { id, quantity: Math.min(quantity, product.stock) }];
    });
    setToast(`${product.name} added to your bag`);
  };
  const updateQuantity = (id: string, quantity: number) => {
    const product = getProduct(id);
    if (quantity <= 0) setCart((current) => current.filter((i) => i.id !== id));
    else if (product)
      setCart((current) =>
        current.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(quantity, product.stock) }
            : i,
        ),
      );
  };
  const toggleWishlist = (id: string) =>
    setWishlist((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id],
    );
  const subtotal = cart.reduce(
    (total, item) => total + (getProduct(item.id)?.price || 0) * item.quantity,
    0,
  );
  return (
    <StoreContext.Provider
      value={{
        cart,
        addItem,
        updateQuantity,
        removeItem: (id) => setCart((c) => c.filter((i) => i.id !== id)),
        clearCart: () => setCart([]),
        cartCount: cart.reduce((n, i) => n + i.quantity, 0),
        subtotal,
        cartOpen,
        setCartOpen,
        quickView,
        setQuickView,
        searchOpen,
        setSearchOpen,
        wishlist,
        toggleWishlist,
        toast,
        notify: setToast,
      }}
    >
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider is required");
  return store;
}
