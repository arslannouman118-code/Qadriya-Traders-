"use client";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  BadgeCheck,
  Truck,
  HeartHandshake,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { photos } from "@/lib/catalog";

export function Hero() {
  const reduced = useReducedMotion();
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <motion.div
            className="hero-copy"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="eyebrow">
              <span /> FOR THE CURIOUS. THE CREATIVE. YOU.
            </p>
            <h1>
              Everything You Need
              <br />
              to Learn, Create
              <br />
              <em>& Grow.</em>
              <svg
                className="heading-spark"
                viewBox="0 0 48 48"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M24 3v13M24 32v13M3 24h13M32 24h13M9 9l9 9M30 30l9 9M9 39l9-9M30 18l9-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </h1>
            <p className="hero-description">
              From the first page to the next big idea — discover thoughtfully
              chosen books, stationery, and everyday essentials at Qadriya
              Traders.
            </p>
            <div className="hero-buttons">
              <Link href="/shop" className="button button-primary">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link href="/categories" className="button button-outline">
                Explore Products <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-trust">
              <span className="trust-icon">
                <BadgeCheck size={19} />
              </span>
              <span>
                Thoughtfully chosen. Honestly priced. Always here for you.
              </span>
            </div>
          </motion.div>
          <motion.div
            className="hero-visual"
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="hero-photo">
              <img
                src={photos.hero}
                alt="Beautifully arranged pastel notebooks, pens, and stationery for a fresh start"
                fetchPriority="high"
              />
              <div className="hero-photo-tint" />
            </div>
            <div className="hero-sticker">
              <Sparkles size={21} strokeWidth={1.3} />
              <span>
                A FRESH PAGE.
                <br />A NEW POSSIBILITY.
              </span>
            </div>
            <div className="hero-note">
              <span className="note-icon">
                <BookOpen size={28} strokeWidth={1.3} />
              </span>
              <div>
                <strong>For every chapter of life.</strong>
                <span>Little essentials. Endless possibilities.</span>
              </div>
              <span className="note-star">✦</span>
            </div>
            <svg
              className="hero-doodle"
              viewBox="0 0 100 100"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 70C27 83 51 85 62 68C79 42 39 15 30 36C23 53 64 63 84 33M73 33l12-3-2 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>
      </section>
      <section className="benefits">
        <div className="container benefits-inner">
          <div>
            <BookOpen />
            <span>
              <strong>Something for everyone</strong>
              <small>Books to everyday essentials</small>
            </span>
          </div>
          <div>
            <BadgeCheck />
            <span>
              <strong>Quality you can trust</strong>
              <small>Carefully selected, always</small>
            </span>
          </div>
          <div>
            <Truck />
            <span>
              <strong>Delivered with care</strong>
              <small>Free delivery on orders Rs 999+</small>
            </span>
          </div>
          <div>
            <HeartHandshake />
            <span>
              <strong>A personal touch</strong>
              <small>Real people. Happy to help.</small>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}