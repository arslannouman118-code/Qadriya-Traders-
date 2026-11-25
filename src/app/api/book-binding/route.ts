import { business } from "@/lib/business";

export const dynamic = "force-dynamic";

// Book binding requests are delivered to this email only.
const BINDING_RECEIVER = "arslannouman118@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const clean = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Spam bots fill the hidden field. Pretend it worked and send nothing.
    if (clean(body.website, 200)) {
      return Response.json({ message: "Thank you!" }, { status: 201 });
    }

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 25);
    const email = clean(body.email, 254).toLowerCase();
    const organization = clean(body.organization, 160);
    const bindingType = clean(body.bindingType, 80);
    const pages = clean(body.pages, 40);
    const neededBy = clean(body.neededBy, 20);
    const details = clean(body.details, 3000);
    const quantity = Number(body.quantity);

    if (name.length < 2)
      return Response.json({ error: "Please enter your name." }, { status: 400 });
    const phoneDigits = phone.replace(/\D/g, "");
    if (
      phoneDigits.length < 7 ||
      phoneDigits.length > 15 ||
      !/^[0-9+\-()\s]+$/.test(phone)
    )
      return Response.json(
        { error: "Please enter a valid phone number so we can reach you." },
        { status: 400 },
      );
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return Response.json(
        { error: "That email address doesn’t look right." },
        { status: 400 },
      );
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 1000000)
      return Response.json(
        { error: "Please enter how many books you want bound." },
        { status: 400 },
      );
    if (!bindingType)
      return Response.json(
        { error: "Please choose a type of binding." },
        { status: 400 },
      );

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set, binding email was not sent");
      return Response.json(
        {
          error:
            "We couldn’t send your request. Please call or WhatsApp us instead.",
        },
        { status: 500 },
      );
    }

    const to = process.env.CONTACT_TO_EMAIL || BINDING_RECEIVER;
    const from =
      process.env.CONTACT_FROM_EMAIL ||
      `${business.name} Website <onboarding@resend.dev>`;
    const callLink = `tel:${phone.replace(/[^0-9+]/g, "")}`;
    const waLink = `https://wa.me/${phoneDigits}`;

    const rows: [string, string][] = [
      ["Name", name],
      ["Phone / WhatsApp", phone],
      ["Email", email || "—"],
      ["School / organisation", organization || "—"],
      ["Number of books", quantity.toLocaleString("en-US")],
      ["Type of binding", bindingType],
      ["Pages per book", pages || "—"],
      ["Needed by", neededBy || "—"],
    ];

    const text =
      `New BOOK BINDING request\n\n` +
      rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
      `\n\nDetails:\n${details || "—"}\n\nCall: ${phone}`;

    const html = `
      <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#222;max-width:560px">
        <h2 style="margin:0 0 12px">New book binding request</h2>
        <table style="border-collapse:collapse;width:100%">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding:6px 10px;border:1px solid #ddd;background:#f7f7f7;width:40%"><strong>${escapeHtml(k)}</strong></td><td style="padding:6px 10px;border:1px solid #ddd">${escapeHtml(v)}</td></tr>`,
            )
            .join("")}
        </table>
        <p><strong>Details:</strong></p>
        <p style="white-space:pre-wrap;border-left:3px solid #ccc;padding-left:12px">${escapeHtml(details || "—")}</p>
        <p>
          <a href="${escapeHtml(callLink)}">Call ${escapeHtml(phone)}</a>
          &nbsp;·&nbsp;
          <a href="${escapeHtml(waLink)}">WhatsApp this number</a>
        </p>
        ${email ? `<p style="color:#777;font-size:13px">Press Reply to answer the customer by email.</p>` : `<p style="color:#777;font-size:13px">No email given. Please contact by phone.</p>`}
      </div>`;

    const payload: Record<string, unknown> = {
      from,
      to: [to],
      subject: `Book binding: ${quantity.toLocaleString("en-US")} books – ${name.replace(/[\r\n]+/g, " ")}`,
      text,
      html,
    };
    if (email) payload.reply_to = email;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Resend error", response.status, await response.text());
      return Response.json(
        {
          error:
            "We couldn’t send your request. Please try again or call us directly.",
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        message:
          "Thank you! We’ve received your request and will contact you soon.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError)
      return Response.json({ error: "Invalid request." }, { status: 400 });
    console.error("Book binding submission failed", error);
    return Response.json(
      { error: "We couldn’t send your request. Please try again shortly." },
      { status: 500 },
    );
  }
}