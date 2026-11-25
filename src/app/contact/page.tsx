import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { ContactForm } from "@/components/contact/contact-client";
import { business, whatsappUrl } from "@/lib/business";
export const metadata: Metadata = { title: "Contact Us" };
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const subject = typeof params.subject === "string" ? params.subject : "";
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <span>Contact</span>
          </div>
          <p className="eyebrow">A CONVERSATION STARTS HERE</p>
          <h1>We’re happy to hear from you.</h1>
          <p>A question, a big order, or just a hello — we’re here to help.</p>
        </div>
      </section>
      <div className="container contact-layout">
        <div className="contact-info">
          <h2>Let’s talk.</h2>
          <p>
            Looking for a particular book or planning supplies for your school
            or office? Tell us what you need. We’ll help you find the right fit.
          </p>
          <div className="contact-detail">
            <MapPin size={22} />
            <div>
              <strong>Visit our store</strong>
              <p>{business.address}</p>
            </div>
          </div>
          <div className="contact-detail">
            <Phone size={21} />
            <div>
              <strong>Give us a call</strong>
              <p>
                <a href={`tel:${business.phone.replace(/\s/g, "")}`}>
                  {business.phone}
                </a>
              </p>
            </div>
          </div>
          <div className="contact-detail">
            <Mail size={21} />
            <div>
              <strong>Drop us an email</strong>
              <p>
                <a href={`mailto:${business.email}`}>{business.email}</a>
              </p>
            </div>
          </div>
          <div className="contact-detail">
            <Clock size={21} />
            <div>
              <strong>Opening hours</strong>
              <p>{business.hours}</p>
              {business.hoursNote && <small>{business.hoursNote}</small>}
            </div>
          </div>
          <a
            href={whatsappUrl(
              "Hello Qadriya Traders! I’d like to enquire about your products.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary"
          >
            <MessageCircle size={17} /> Chat on WhatsApp{" "}
            <ArrowUpRight size={16} />
          </a>
        </div>
        <ContactForm key={subject} subject={subject} />
      </div>
      <div className="container location-panel">
        <MapPin size={36} strokeWidth={1.3} />
        <div>
          <h3>Find your way to Qadriya Traders.</h3>
          <p>{business.address}</p>
        </div>
      </div>
    </>
  );
}