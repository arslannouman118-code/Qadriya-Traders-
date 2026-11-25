import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function PrivacyPage() {
  return (
    <article className="container legal-page">
      <p className="eyebrow">YOUR TRUST MATTERS</p>
      <h1>Privacy policy</h1>
      <p>
        Qadriya Traders respects your privacy. This page explains what
        information this website collects and how it is used.
      </p>
      <h2>Information you share</h2>
      <p>
        When you place an order, we collect your name, email, phone number,
        delivery address, and order details to process and confirm your
        purchase. When you contact us, we store your name, email, subject, and
        message so we can respond.
      </p>
      <h2>Newsletter subscriptions</h2>
      <p>
        If you subscribe, we store your email address to send product updates
        and offers. You can request removal at any time through our contact
        form.
      </p>
      <h2>Local storage</h2>
      <p>
        Your shopping bag and saved favourites are stored in your browser so
        they are there when you return. We do not use advertising trackers or
        sell your personal information.
      </p>
      <h2>External services</h2>
      <p>
        WhatsApp links open an external service. Any message you send through
        WhatsApp is subject to WhatsApp’s own privacy policy. Product
        photography and fonts may be loaded from external providers.
      </p>
      <h2>Questions or deletion requests</h2>
      <p>
        To ask about your information, correct it, or request deletion, please
        use our contact form and select “General enquiry”.
      </p>
    </article>
  );
}
