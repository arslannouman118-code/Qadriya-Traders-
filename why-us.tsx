import Link from "next/link";
import {
  BadgeCheck,
  HeartHandshake,
  PackageCheck,
  Sparkles,
  ArrowRight,
  Quote,
} from "lucide-react";
import { Reveal } from "../reveal";
import { photos } from "@/lib/catalog";

export function WhyUs() {
  return (
    <section className="section why-section">
      <div className="container why-inner">
        <Reveal className="why-image">
          <img
            src={photos.study}
            alt="A thoughtful study space with books, notebooks and stationery"
            loading="lazy"
          />
          <div className="why-image-caption">
            <Sparkles size={22} />
            <span>
              More than a store.
              <br />
              <strong>A part of your journey.</strong>
            </span>
          </div>
        </Reveal>
        <Reveal className="why-copy">
          <p className="eyebrow">THE QADRIYA TRADERS DIFFERENCE</p>
          <h2>
            Good things begin
            <br />
            with a little care.
          </h2>
          <p>
            We believe the right book can open a world, and the right pen can
            start a story. That’s why we bring together everyday essentials that
            make learning and creating a little more joyful.
          </p>
          <div className="why-features">
            <div>
              <BadgeCheck />
              <span>
                <strong>Quality, without compromise</strong>
                <small>Thoughtfully sourced. Carefully selected.</small>
              </span>
            </div>
            <div>
              <HeartHandshake />
              <span>
                <strong>People before everything</strong>
                <small>Friendly service, from our family to yours.</small>
              </span>
            </div>
            <div>
              <PackageCheck />
              <span>
                <strong>Value in every find</strong>
                <small>Honest prices for your everyday essentials.</small>
              </span>
            </div>
          </div>
          <Link href="/about" className="text-link">
            A little more about us <ArrowRight size={17} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Community() {
  return (
    <section className="community-section">
      <div className="container">
        <Reveal>
          <div className="community-heading">
            <p className="eyebrow">OUR GROWING COMMUNITY</p>
            <h2>Good things are better shared.</h2>
            <p>Every customer has a story. We’d love to be part of yours.</p>
          </div>
          <div className="community-card">
            <Quote size={34} strokeWidth={1} />
            <h3>Your story belongs here.</h3>
            <p>
              Have you found something you love at Qadriya Traders?
              <br />
              Share your experience and help our community grow.
            </p>
            <Link
              href="/contact?subject=Share%20my%20experience"
              className="text-link"
            >
              Share your experience <ArrowRight size={17} />
            </Link>
            <span className="community-note">
              Real stories from our customers will appear here.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
