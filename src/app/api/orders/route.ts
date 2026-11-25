import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, products as productsTable } from "@/db/schema";
import { getProducts } from "@/lib/products";
import { business } from "@/lib/business";
import { randomUUID } from "node:crypto";

class StockError extends Error {}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, address, city, postalCode, items } = body;
    if (typeof name !== "string" || name.trim().length < 2 || name.length > 120)
      return Response.json(
        { error: "Please enter your full name." },
        { status: 400 },
      );
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254
    )
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    if (typeof phone !== "string" || !/^[+\d\s()-]{7,20}$/.test(phone))
      return Response.json(
        { error: "Please enter a valid phone number." },
        { status: 400 },
      );
    if (
      typeof address !== "string" ||
      address.trim().length < 8 ||
      address.length > 500
    )
      return Response.json(
        { error: "Please enter your complete delivery address." },
        { status: 400 },
      );
    if (typeof city !== "string" || city.trim().length < 2 || city.length > 120)
      return Response.json(
        { error: "Please enter your city." },
        { status: 400 },
      );
    if (typeof postalCode !== "string" || !/^[\w -]{3,20}$/.test(postalCode))
      return Response.json(
        { error: "Please enter a valid postal code." },
        { status: 400 },
      );
    if (!Array.isArray(items) || !items.length || items.length > 50)
      return Response.json(
        { error: "Your shopping bag is empty or invalid." },
        { status: 400 },
      );

    const catalog = await getProducts();
    const byId = new Map(catalog.map((p) => [p.id, p]));
    const validated: {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }[] = [];
    for (const item of items) {
      const product =
        typeof item?.id === "string" ? byId.get(item.id) : undefined;
      if (
        !product ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > product.stock
      )
        return Response.json(
          {
            error:
              "An item or quantity is unavailable. Please update your bag.",
          },
          { status: 400 },
        );
      validated.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }
    const subtotal = validated.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const delivery =
      subtotal >= business.freeDeliveryThreshold ? 0 : business.deliveryFee;
    const reference = `QT-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`;

    // Save the order and reduce the stock together, or neither.
    try {
      await db.transaction(async (tx) => {
        for (const item of validated) {
          const updated = await tx
            .update(productsTable)
            .set({ stock: sql`${productsTable.stock} - ${item.quantity}` })
            .where(
              and(
                eq(productsTable.id, item.id),
                gte(productsTable.stock, item.quantity),
              ),
            )
            .returning({ id: productsTable.id });
          if (!updated.length) throw new StockError();
        }
        await tx.insert(orders).values({
          reference,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          items: validated,
          subtotal,
          delivery,
          total: subtotal + delivery,
        });
      });
    } catch (error) {
      if (error instanceof StockError)
        return Response.json(
          {
            error:
              "An item or quantity is unavailable. Please update your bag.",
          },
          { status: 400 },
        );
      throw error;
    }

    return Response.json(
      {
        reference,
        total: subtotal + delivery,
        message:
          "Your order has been received. We will contact you to confirm availability and delivery.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError)
      return Response.json({ error: "Invalid request." }, { status: 400 });
    console.error("Order submission failed", error);
    return Response.json(
      { error: "We couldn’t save your order. Please try again in a moment." },
      { status: 500 },
    );
  }
}
