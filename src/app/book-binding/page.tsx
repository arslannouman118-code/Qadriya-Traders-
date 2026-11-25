import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  BookOpen,
  ClipboardList,
  Phone,
  Clock,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { BindingForm } from "@/components/book-binding/binding-form";
import { business, whatsappUrl } from "@/lib/business";

export const metadata: Metadata = {
  title: "Book Binding",
  description:
    "Need books bound in bulk? Share your requirement with Qadriya Traders and we will get back to you.",
};

export default function BookBindingPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <span>Book Binding</span>
          </div>
          <p className="eyebrow">BULK BOOK BINDING</p>
          <h1>Books to bind? Leave it with us.</h1>
          <p>
            Schools, libraries, offices and students — tell us what you need
            and we’ll get back to you.
          </p>
        </div>
      </section>
      <div className="container contact-layout">
        <div className="contact-info">
          <h2>How it works.</h2>
          <p>
            Fill in the form with your requirement. It takes only a minute, and
            there’s no obligation.
          </p>
          <div className="contact-detail">
            <ClipboardList size={22} />
            <div>
              <strong>1. Tell us what you need</strong>
              <p>
                Number of books, the type of binding and when you need them.
              </p>
            </div>
          </div>
          <div className="contact-detail">
            <Phone size={21} />
            <div>
              <strong>2. We get in touch</strong>
              <p>
                We’ll reach you by email or call you on the number you give, to
                confirm the details and the price.
              </p>
            </div>
          </div>
          <div className="contact-detail">
            <BookOpen size={21} />
            <div>
              <strong>3. We bind your books</strong>
              <p>Once everything is agreed, we get to work on your order.</p>
            </div>
          </div>
          <div className="contact-detail">
            <Clock size={21} />
            <div>
              <strong>Opening hours</strong>
              <p>{business.hours}</p>
            </div>
          </div>
          <a
            href={whatsappUrl(
              "Hello Qadriya Traders! I’d like to enquire about book binding.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary"
          >
            <MessageCircle size={17} /> Ask on WhatsApp{" "}
            <ArrowUpRight size={16} />
          </a>
        </div>
        <BindingForm />
      </div>
    </>
  );
}