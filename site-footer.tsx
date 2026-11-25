import Link from "next/link";
import { ArrowUpRight, MessageCircle, Mail, MapPin } from "lucide-react";
import { Brand } from "./site-header";
import { business, whatsappUrl } from "@/lib/business";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Brand />
            <p>
              Your everyday destination for books,
              <br />
              stationery, and a little inspiration.
            </p>
            <span className="footer-promise">
              Thoughtfully chosen. For you.
            </span>
            <a
              href={whatsappUrl(
                "Hello Qadriya Traders! I would like to know more about your products.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp"
            >
              <MessageCircle size={17} /> Let’s chat on WhatsApp{" "}
              <ArrowUpRight size={14} />
            </a>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/shop">Shop all products</Link>
            <Link href="/categories">Our categories</Link>
            <Link href="/shop?sort=newest">New arrivals</Link>
            <Link href="/shop?offer=true">Special offers</Link>
          </div>
          <div>
            <h3>A little about us</h3>
            <Link href="/about">Our story</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="/book-binding">Book binding</Link>
            <Link href="/contact?subject=Bulk%20order%20enquiry">
              Bulk & school orders
            </Link>
            <Link href="/contact?subject=Delivery%20and%20returns">
              Delivery & returns
            </Link>
          </div>
          <div>
            <h3>We’re here for you</h3>
            <p>
              <MapPin size={16} />
              {business.address || "Store address to be added"}
            </p>
            <p>
              <Mail size={16} />
              {business.email || "Email address to be added"}
            </p>
            <p className="footer-hours">{business.hours}</p>
            <span className="footer-hours-note">{business.hoursNote}</span>
            <Link href="/contact" className="footer-contact">
              Get in touch <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Qadriya Traders. All rights reserved.
          </p>
          <p>
            Made for learning. Made for creating. Made for you. <span>✦</span>
          </p>
          <div>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms & conditions</Link>
          </div>
        </div>
        <p className="catalog-note">
          Sample catalog and prices. Product availability and business details
          are subject to confirmation.
        </p>
      </div>
    </footer>
  );
}