import { db } from "@/db";
import { subscribers } from "@/db/schema";
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254
    )
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    await db
      .insert(subscribers)
      .values({ email: email.trim().toLowerCase() })
      .onConflictDoNothing();
    return Response.json({
      message: "You’re on the list! A little inspiration is headed your way.",
    });
  } catch (error) {
    if (error instanceof SyntaxError)
      return Response.json({ error: "Invalid request." }, { status: 400 });
    console.error("Newsletter subscription failed", error);
    return Response.json(
      { error: "We couldn’t save your subscription. Please try again." },
      { status: 500 },
    );
  }
}
