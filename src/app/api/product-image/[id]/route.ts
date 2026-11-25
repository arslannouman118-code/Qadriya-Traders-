import { eq } from "drizzle-orm";
import { db } from "@/db";
import { productImages } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const imageId = Number(id);
  if (!Number.isInteger(imageId) || imageId < 1)
    return new Response("Not found", { status: 404 });
  try {
    const [row] = await db
      .select()
      .from(productImages)
      .where(eq(productImages.id, imageId))
      .limit(1);
    if (!row) return new Response("Not found", { status: 404 });
    const bytes = new Uint8Array(Buffer.from(row.data, "base64"));
    return new Response(bytes, {
      headers: {
        "Content-Type": row.mime,
        // Every upload gets a new id, so this file never changes.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Could not load product image", error);
    return new Response("Not found", { status: 404 });
  }
}
