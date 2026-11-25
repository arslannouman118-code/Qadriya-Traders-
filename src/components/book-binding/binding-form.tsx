"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const bindingTypes = [
  "Hard cover binding",
  "Soft cover / paperback",
  "Spiral binding",
  "Thread sewn binding",
  "Not sure — please advise",
  "Other",
];

export function BindingForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await fetch("/api/book-binding", {
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
          <h3>Thank you, we’ve got your request.</h3>
          <p>
            We’ll contact you soon by email or phone to confirm the details of
            your order.
          </p>
          <button
            className="button button-outline"
            onClick={() => setSuccess(false)}
          >
            Send another request
          </button>
        </div>
      </div>
    );

  return (
    <form className="contact-form" onSubmit={submit}>
      <h2>Tell us about your books.</h2>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="bb-name">Your name *</label>
          <input
            id="bb-name"
            name="name"
            required
            minLength={2}
            maxLength={120}
            placeholder="Full name"
            autoComplete="name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="bb-phone">Phone / WhatsApp number *</label>
          <input
            id="bb-phone"
            name="phone"
            type="tel"
            required
            minLength={7}
            maxLength={25}
            placeholder="+92 300 1234567"
            autoComplete="tel"
          />
        </div>
        <div className="form-field">
          <label htmlFor="bb-email">Email address</label>
          <input
            id="bb-email"
            name="email"
            type="email"
            maxLength={254}
            placeholder="you@example.com (optional)"
            autoComplete="email"
          />
        </div>
        <div className="form-field">
          <label htmlFor="bb-org">School / organisation</label>
          <input
            id="bb-org"
            name="organization"
            maxLength={160}
            placeholder="Optional"
            autoComplete="organization"
          />
        </div>
        <div className="form-field">
          <label htmlFor="bb-quantity">Number of books *</label>
          <input
            id="bb-quantity"
            name="quantity"
            type="number"
            inputMode="numeric"
            required
            min={1}
            max={1000000}
            placeholder="e.g. 200"
          />
        </div>
        <div className="form-field">
          <label htmlFor="bb-type">Type of binding *</label>
          <select id="bb-type" name="bindingType" required defaultValue="">
            <option value="" disabled>
              Select binding type
            </option>
            {bindingTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="bb-pages">Approx. pages per book</label>
          <input
            id="bb-pages"
            name="pages"
            maxLength={40}
            placeholder="e.g. 250 (optional)"
          />
        </div>
        <div className="form-field">
          <label htmlFor="bb-date">Needed by</label>
          <input id="bb-date" name="neededBy" type="date" />
        </div>
        <div className="form-field full">
          <label htmlFor="bb-details">More details</label>
          <textarea
            id="bb-details"
            name="details"
            maxLength={3000}
            placeholder="Book size, cover colour, anything printed on the cover, or any other requirement…"
          />
        </div>
        {/* Hidden field to catch spam bots. Real visitors never see or fill this. */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}
        >
          <label htmlFor="bb-website">Website</label>
          <input
            id="bb-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
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
        {loading ? "Sending your request…" : "Send request"}
        <ArrowRight size={17} />
      </button>
    </form>
  );
}