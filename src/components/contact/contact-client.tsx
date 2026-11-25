"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
export function ContactForm({ subject = "" }: { subject?: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }
  if (success)
    return (
      <div className="contact-form">
        <div className="empty-state">
          <CheckCircle2 size={42} />
          <h3>Thanks for your little note.</h3>
          <p>Your message has been received. We’ll get back to you soon.</p>
          <button
            className="button button-outline"
            onClick={() => setSuccess(false)}
          >
            Send another message
          </button>
        </div>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={submit}>
      <h2>Send us a little note.</h2>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="contact-name">Your name *</label>
          <input
            id="contact-name"
            name="name"
            required
            minLength={2}
            maxLength={120}
            placeholder="Full name"
            autoComplete="name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">Email address *</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        <div className="form-field full">
          <label htmlFor="subject">What’s on your mind? *</label>
          <select
            id="subject"
            name="subject"
            required
            defaultValue={subject || ""}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {[
              "General enquiry",
              "Product availability",
              "Bulk order enquiry",
              "Delivery and returns",
              "Share my experience",
              "Something else",
            ].map((s) => (
              <option key={s}>{s}</option>
            ))}
            {subject &&
              ![
                "General enquiry",
                "Product availability",
                "Bulk order enquiry",
                "Delivery and returns",
                "Share my experience",
                "Something else",
              ].includes(subject) && <option>{subject}</option>}
          </select>
        </div>
        <div className="form-field full">
          <label htmlFor="message">Your message *</label>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            placeholder="Tell us how we can help…"
          />
        </div>
      </div>
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      <button
        className="button button-primary"
        disabled={loading}
        type="submit"
      >
        {loading ? "Sending your note…" : "Send message"}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}
