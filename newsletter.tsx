"use client";
import { useState } from "react";
import { ArrowRight, Mail, CheckCircle2 } from "lucide-react";
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Please try again.");
      setState("success");
      setMessage(data.message);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }
  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <div className="newsletter-copy">
          <span className="newsletter-icon">
            <Mail size={29} strokeWidth={1.3} />
          </span>
          <div>
            <p className="eyebrow">A LITTLE NOTE FROM US</p>
            <h2>Good finds. Straight to your inbox.</h2>
            <p>
              New arrivals, thoughtful offers, and a little inspiration. Just
              the good stuff.
            </p>
          </div>
        </div>
        <div className="newsletter-form-wrap">
          {state === "success" ? (
            <div className="newsletter-success">
              <CheckCircle2 size={23} />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={subscribe}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="newsletter-input">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={state === "loading"}>
                  {state === "loading" ? "Joining…" : "Count me in"}
                  <ArrowRight size={17} />
                </button>
              </div>
              <p className={state === "error" ? "form-error" : ""}>
                {state === "error"
                  ? message
                  : "By subscribing, you agree to receive updates. Unsubscribe anytime."}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
