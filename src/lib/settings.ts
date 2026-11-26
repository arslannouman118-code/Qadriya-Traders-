import { db } from "@/db";
import { settings } from "@/db/schema";
import { DEFAULT_DELIVERY, type DeliverySettings } from "@/lib/delivery";

function whole(value: string | undefined, fallback: number) {
  const n = Number(value);
  return value !== undefined && Number.isInteger(n) && n >= 0 ? n : fallback;
}

export async function getDeliverySettings(): Promise<DeliverySettings> {
  if (!process.env.DATABASE_URL) return DEFAULT_DELIVERY;
  try {
    const rows = await db.select().from(settings);
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return {
      fee: whole(map.get("delivery_fee"), DEFAULT_DELIVERY.fee),
      freeThreshold: whole(
        map.get("free_delivery_threshold"),
        DEFAULT_DELIVERY.freeThreshold,
      ),
    };
  } catch (error) {
    console.error("Could not load delivery settings", error);
    return DEFAULT_DELIVERY;
  }
}
