import type { Metadata } from "next";
import { getDeliverySettings } from "@/lib/settings";
import { deliveryTerms } from "@/lib/delivery";
export const metadata: Metadata = { title: "Terms & Conditions" };
export default async function TermsPage() {
  const delivery = await getDeliverySettings();
  return (
    <article className="container legal-page">
      <p className="eyebrow">THE LITTLE DETAILS</p>
      <h1>Terms & conditions</h1>
      <h2>Products and pricing</h2>
      <p>
        The catalog currently includes illustrative product information and
        prices for Qadriya Traders. Actual availability, specifications, and
        prices are subject to confirmation by our team before dispatch. Product
        photographs are representative.
      </p>
      <h2>Orders and payment</h2>
      <p>
        Submitting an order does not charge your account. We currently offer
        cash on delivery. Our team will contact you to confirm stock, the final
        total, and delivery arrangements.
      </p>
      <h2>Delivery</h2>
      <p>
        {deliveryTerms(delivery)} Delivery areas and estimated times will be confirmed
        with you before dispatch.
      </p>
      <h2>Returns and issues</h2>
      <p>
        If an item arrives damaged or incorrect, please contact us with your
        order reference and details of the issue. Our team will discuss the
        appropriate resolution. Please retain the original packaging where
        possible.
      </p>
      <h2>Bulk and school orders</h2>
      <p>
        For larger quantities, school requirements, or office supply enquiries,
        use the contact form and select “Bulk order enquiry”. Pricing and
        availability will be confirmed individually.
      </p>
      <h2>Business information</h2>
      <p>
        Verified contact details and opening hours will be published when
        available. Please confirm opening hours and location before visiting.
      </p>
    </article>
  );
}
