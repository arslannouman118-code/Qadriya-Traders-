import { business } from "@/lib/business";
import { formatPrice } from "@/lib/catalog";

export type DeliverySettings = {
  /** Delivery charge for one order, in Rs. 0 means delivery is always free. */
  fee: number;
  /** Orders at or above this amount get free delivery. 0 means never free. */
  freeThreshold: number;
};

export const DEFAULT_DELIVERY: DeliverySettings = {
  fee: business.deliveryFee,
  freeThreshold: business.freeDeliveryThreshold,
};

export function calcDelivery(subtotal: number, s: DeliverySettings) {
  if (s.fee <= 0) return 0;
  if (s.freeThreshold > 0 && subtotal >= s.freeThreshold) return 0;
  return s.fee;
}

/** Text for the pink bar at the top of every page. */
export function deliveryBanner(s: DeliverySettings) {
  if (s.fee <= 0) return "Free delivery on all orders";
  if (s.freeThreshold > 0)
    return `Free delivery on orders over ${formatPrice(s.freeThreshold)}`;
  return `Delivery charge ${formatPrice(s.fee)} per order`;
}

/** Short text for the home page. */
export function deliveryShort(s: DeliverySettings) {
  if (s.fee <= 0) return "Free delivery on all orders";
  if (s.freeThreshold > 0)
    return `Free delivery on orders ${formatPrice(s.freeThreshold)}+`;
  return `Delivery charge ${formatPrice(s.fee)}`;
}

/** Text for the product page. */
export function deliveryLong(s: DeliverySettings) {
  if (s.fee <= 0) return "Free delivery on all orders.";
  if (s.freeThreshold > 0)
    return `Free delivery on orders ${formatPrice(s.freeThreshold)}+. Otherwise ${formatPrice(s.fee)}.`;
  return `Delivery charge: ${formatPrice(s.fee)} per order.`;
}

/** Sentence for the Terms page. */
export function deliveryTerms(s: DeliverySettings) {
  if (s.fee <= 0) return "Delivery is free on all orders.";
  if (s.freeThreshold > 0)
    return `Delivery is free for orders of ${formatPrice(s.freeThreshold)} or more. A ${formatPrice(s.fee)} delivery fee applies below this amount.`;
  return `A delivery fee of ${formatPrice(s.fee)} applies to each order.`;
}
