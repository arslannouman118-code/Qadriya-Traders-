import { business } from "@/lib/business";

export const dynamic = "force-dynamic";

// Customer messages from the contact form are delivered to this email only.
const CONTACT_FORM_RECEIVER = "arslannouman118@gmail.com";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set, contact email was not sent");
    return false;
  }
  const to = process.env.CONTACT_TO_EMAIL || CONTACT_FORM_RECEIVER;
  const from =
    process.env.CONTACT_FROM_EMAIL ||
    `${business.name} Website <onboarding@resend.dev>`;
  const subjectLine = data.subject.replace(/[\r\n]+/g, " ");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `New website message: ${subjectLine}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${subjectLine}\n\n${data.message}`,
      html: `
        <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#222">
          <h2 style="margin:0 0 12px">New message from your website</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}<br/>
          <strong>Email:</strong> ${escapeHtml(data.email)}<br/>
          <strong>Subject:</strong> ${escapeHtml(subjectLine)}</p>
          <p style="white-space:pre-wrap;border-left:3px solid #ccc;padding-left:12px">${escapeHtml(data.message)}</p>
          <p style="color:#777;font-size:13px">Press Reply to answer the customer directly.</p>
        </div>`,
    }),
  });

  if (!response.ok) {
    console.error("Resend error", response.status, await response.text());
    return false;
  }
  return true;
}

async function saveToDatabase(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const { db } = await import("@/db");
    const { inquiries } = await import("@/db/schema");
    await db.insert(inquiries).values(data);
    return true;
  } catch (error) {
    console.error("Saving inquiry to database failed", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();
    if (typeof name !== "string" || name.trim().length < 2 || name.length > 120)
      return Response.json(
        { error: "Please enter your name." },
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
    if (typeof subject !== "string" || !subject.trim() || subject.length > 160)
      return Response.json(
        { error: "Please choose a subject." },
        { status: 400 },
      );
    if (
      typeof message !== "string" ||
      message.trim().length < 10 ||
      message.length > 5000
    )
      return Response.json(
        { error: "Please include a message of at least 10 characters." },
        { status: 400 },
      );

    const data = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    };

    // Email is the main way the owner gets the message; the database copy is a backup.
    let emailSent = false;
    try {
      emailSent = await sendEmail(data);
    } catch (error) {
      console.error("Contact email failed", error);
    }
    const saved = await saveToDatabase(data);

    if (!emailSent && !saved)
      return Response.json(
        {
          error:
            "We couldn’t send your message. Please try again shortly or contact us on WhatsApp.",
        },
        { status: 500 },
      );

    return Response.json(
      {
        message:
          "Thank you for your note! Your message has been received. We’ll be in touch soon.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError)
      return Response.json({ error: "Invalid request." }, { status: 400 });
    console.error("Contact submission failed", error);
    return Response.json(
      { error: "We couldn’t send your message. Please try again shortly." },
      { status: 500 },
    );
  }
}