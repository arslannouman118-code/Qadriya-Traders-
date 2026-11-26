import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteMessage, setMessageHandled } from "../actions";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { show } = await searchParams;
  const filter = show === "new" || show === "done" ? show : "";
  let rows: (typeof inquiries.$inferSelect)[] | null = null;
  try {
    const query = db.select().from(inquiries);
    const filtered =
      filter === "new"
        ? query.where(eq(inquiries.handled, false))
        : filter === "done"
          ? query.where(eq(inquiries.handled, true))
          : query;
    rows = await filtered.orderBy(desc(inquiries.createdAt)).limit(200);
  } catch (error) {
    console.error("Admin messages query failed", error);
  }
  if (!rows)
    return (
      <div className="adm-note">
        <strong>The messages table is not ready yet.</strong> In the VS Code
        terminal run <code>npx drizzle-kit push</code>, then refresh.
      </div>
    );

  return (
    <>
      <h1>Messages</h1>
      <p className="adm-sub">
        Messages sent from the “Send us a little note” form on your contact
        page. They also arrive in your email. Mark a message as done once you
        have replied.
      </p>
      <div className="adm-tabs">
        <Link
          className={`adm-btn adm-btn-sm ${filter ? "adm-btn-light" : ""}`}
          href="/admin/messages"
        >
          All
        </Link>
        <Link
          className={`adm-btn adm-btn-sm ${filter === "new" ? "" : "adm-btn-light"}`}
          href="/admin/messages?show=new"
        >
          Not replied yet
        </Link>
        <Link
          className={`adm-btn adm-btn-sm ${filter === "done" ? "" : "adm-btn-light"}`}
          href="/admin/messages?show=done"
        >
          Done
        </Link>
      </div>
      {rows.length === 0 && <div className="adm-card">No messages here.</div>}
      {rows.map((m) => (
        <details className="adm-card adm-order" key={m.id} open={!m.handled}>
          <summary>
            <strong>{m.subject}</strong>
            <span>{m.name}</span>
            <span className={`adm-pill ${m.handled ? "ok" : "pending"}`}>
              {m.handled ? "done" : "new"}
            </span>
            <small style={{ marginLeft: "auto" }}>
              {m.createdAt.toLocaleString("en-GB", {
                timeZone: "Asia/Karachi",
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </small>
          </summary>
          <dl>
            <dt>From</dt>
            <dd>{m.name}</dd>
            <dt>Email</dt>
            <dd>
              <a
                href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
              >
                {m.email}
              </a>
            </dd>
          </dl>
          <p style={{ whiteSpace: "pre-wrap", margin: "0 0 14px" }}>
            {m.message}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              className="adm-btn adm-btn-sm"
              href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
            >
              Reply by email
            </a>
            <form action={setMessageHandled}>
              <input type="hidden" name="id" value={m.id} />
              <input
                type="hidden"
                name="handled"
                value={m.handled ? "false" : "true"}
              />
              <button className="adm-btn adm-btn-light adm-btn-sm" type="submit">
                {m.handled ? "Mark as not done" : "Mark as done"}
              </button>
            </form>
            <form action={deleteMessage}>
              <input type="hidden" name="id" value={m.id} />
              <ConfirmButton
                className="adm-btn adm-btn-danger adm-btn-sm"
                message="Delete this message? This cannot be undone."
              >
                Delete
              </ConfirmButton>
            </form>
          </div>
        </details>
      ))}
    </>
  );
}
