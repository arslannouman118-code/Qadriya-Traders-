"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  Search,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Heart,
} from "lucide-react";
import { useStore } from "./store-provider";
import { categories } from "@/lib/catalog";
import { deliveryBanner } from "@/lib/delivery";
import { useCatalog } from "./catalog-provider";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Qadriya Traders home"
    >
      <span className="brand-mark">
        <BookOpen size={29} strokeWidth={1.5} />
        <span className="brand-spark">✦</span>
      </span>
      <span>
        <strong>
          Qadriya Traders<span className="brand-dot">.</span>
        </strong>
        <small>BOOKS · STATIONERY · MORE</small>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { cartCount, setCartOpen, setSearchOpen, wishlist } = useStore();
  const { delivery } = useCatalog();
  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/categories", label: "Categories" },
    { href: "/book-binding", label: "Book Binding" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <>
      <div className="announcement">
        <span>A little inspiration for every big idea.</span>
        <span className="announcement-divider">✦</span>
        <Link href="/shop?offer=true">
          {deliveryBanner(delivery)} <ArrowRight size={13} />
        </Link>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) =>
              link.href === "/categories" ? (
                <div
                  className="nav-category"
                  key={link.href}
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <Link
                    className={pathname === link.href ? "active" : ""}
                    href={link.href}
                  >
                    {link.label}
                    <ChevronDown size={13} />
                  </Link>
                  {categoriesOpen && (
                    <div className="category-dropdown">
                      <span className="eyebrow">FIND YOUR INSPIRATION</span>
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          href={`/shop?category=${c.id}`}
                          onClick={() => setCategoriesOpen(false)}
                        >
                          {c.name}
                          <ArrowRight size={14} />
                        </Link>
                      ))}
                      <Link href="/categories" className="dropdown-all">
                        Explore all categories <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href ? "active" : ""}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={21} strokeWidth={1.6} />
            </button>
            <Link
              href="/shop?saved=true"
              className="icon-button wishlist-nav"
              aria-label={`Wishlist, ${wishlist.length} saved products`}
            >
              <Heart size={21} strokeWidth={1.6} />
              {wishlist.length > 0 && (
                <span className="tiny-count">{wishlist.length}</span>
              )}
            </Link>
            <button
              className="cart-trigger"
              onClick={() => setCartOpen(true)}
              aria-label={`Open shopping bag, ${cartCount} items`}
            >
              <ShoppingBag size={21} strokeWidth={1.6} />
              <span className="cart-label">Cart</span>
              <span className="cart-count">{cartCount}</span>
            </button>
            <button
              className="icon-button mobile-menu-button"
              aria-label={mobile ? "Close menu" : "Open menu"}
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobile(false)}
              >
                {link.label}
                <ArrowRight size={16} />
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
