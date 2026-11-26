"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useStore } from "../store-provider";
import { formatPrice } from "@/lib/catalog";
import { calcDelivery } from "@/lib/delivery";
import { useCatalog } from "../catalog-provider";
import { business, whatsappUrl } from "@/lib/business";

export function CheckoutClient() {
  const { getProduct, delivery: deliverySettings } = useCatalog();
  const { cart, subtotal, clearCart, setCartOpen } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const delivery = calcDelivery(subtotal, deliverySettings);
  const total = subtotal + delivery;
  const message = `Hello Qadriya Traders! I’d like to order:\n${cart
    .map((i) => {
      const p = getProduct(i.id)!;
      return `${i.quantity} × ${p.name} — ${formatPrice(p.price * i.quantity)}`;
    })
    .join(
      "\n",
    )}\nSubtotal: ${formatPrice(subtotal)}\nDelivery: ${delivery ? formatPrice(delivery) : "Free"}\nTotal: ${formatPrice(total)}\nPlease confirm availability and delivery.`;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, items: cart }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setReference(result.reference);
      setOrderTotal(result.total);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }
  if (reference)
    return (
      <div className="container">
        <div className="success-panel">
          <span className="success-icon">
            <CheckCircle2 size={37} />
          </span>
          <p className="eyebrow">A LITTLE SOMETHING TO LOOK FORWARD TO</p>
          <h1>Your order is in!</h1>
          <p>
            Thank you for choosing Qadriya Traders. We’ve received your order
            and will contact you to confirm availability and delivery.
          </p>
          <div className="order-reference">
            Order reference: <strong>{reference}</strong>
            <br />
            Total: <strong>{formatPrice(orderTotal)}</strong> · Cash on delivery
          </div>
          <Link href="/shop" className="button button-primary">
            Keep exploring <ArrowRight size={17} />
          </Link>
          <a
            className="button button-outline"
            href={whatsappUrl(
              `Hello! I’ve placed order ${reference} for ${formatPrice(orderTotal)}. Please confirm my order.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={17} /> Share order on WhatsApp
          </a>
        </div>
      </div>
    );
  if (!cart.length)
    return (
      <div className="container empty-state">
        <ShoppingBag size={48} strokeWidth={1} />
        <h3>Your bag is waiting for a little inspiration.</h3>
        <p>Add a few favourites before checking out.</p>
        <Link href="/shop" className="button button-primary">
          Explore the shop <ArrowRight size={17} />
        </Link>
      </div>
    );
  return (
    <div className="container checkout-layout">
      <form className="checkout-form" onSubmit={submit}>
        <h2>Your details</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="name">Full name *</label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              maxLength={120}
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone number *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              minLength={7}
              maxLength={20}
              placeholder="Your contact number"
              autoComplete="tel"
            />
          </div>
          <div className="form-field full">
            <label htmlFor="email">Email address *</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>
        <h2 className="delivery-heading">Where should we send it?</h2>
        <div className="form-grid">
          <div className="form-field full">
            <label htmlFor="address">Delivery address *</label>
            <textarea
              id="address"
              name="address"
              required
              minLength={8}
              maxLength={500}
              placeholder="House / flat number, street, area and landmark"
              autoComplete="street-address"
            />
          </div>
          <div className="form-field">
            <label htmlFor="city">City *</label>
            <input
              id="city"
              name="city"
              required
              minLength={2}
              maxLength={120}
              placeholder="Your city"
              autoComplete="address-level2"
            />
          </div>
          <div className="form-field">
            <label htmlFor="postalCode">Postal code *</label>
            <input
              id="postalCode"
              name="postalCode"
              required
              minLength={3}
              maxLength={20}
              placeholder="Postal code"
              autoComplete="postal-code"
            />
          </div>
        </div>
        <h2 className="delivery-heading">Payment</h2>
        <div className="payment-option">
          <ShieldCheck size={25} />
          <div>
            <strong>Cash on delivery</strong>
            <small>
              Pay when your order arrives. No online payment required.
            </small>
          </div>
        </div>
        {error && (
          <p className="form-message error" role="alert">
            {error}
          </p>
        )}
        <button
          className="button button-primary checkout-submit"
          disabled={loading}
          type="submit"
        >
          {loading
            ? "Placing your order…"
            : `Place order · ${formatPrice(total)}`}
          <ArrowRight size={17} />
        </button>
        <p className="checkout-note">
          By placing an order, you agree to our{" "}
          <Link href="/terms">terms & conditions</Link>. Availability will be
          confirmed by our team.
        </p>
      </form>
      <aside className="order-summary">
        <h2>Your lovely finds</h2>
        {cart.map((item) => {
          const p = getProduct(item.id)!;
          return (
            <div className="summary-item" key={p.id}>
              <img src={p.image} alt={p.name} />
              <div>
                <strong>{p.name}</strong>
                <small>Quantity: {item.quantity}</small>
              </div>
              <span>{formatPrice(p.price * item.quantity)}</span>
            </div>
          );
        })}
        <button
          className="text-link"
          style={{ border: 0, background: "none", padding: 0 }}
          onClick={() => setCartOpen(true)}
        >
          Edit shopping bag <ArrowRight size={13} />
        </button>
        <div className="summary-totals">
          <div>
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div>
            <span>Delivery</span>
            <span>{delivery ? formatPrice(delivery) : "On us!"}</span>
          </div>
          <div className="total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-order"
        >
          <MessageCircle size={18} /> Prefer to order on WhatsApp?
        </a>
        <p className="whatsapp-note">
          {business.phone
            ? "Send your bag directly to our team."
            : "Opens WhatsApp with your order ready to share. Select the business contact to send."}
        </p>
      </aside>
    </div>
  );
}
