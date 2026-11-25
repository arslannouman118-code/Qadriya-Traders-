import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { photos } from "@/lib/catalog";
import { Reveal } from "../reveal";
export function Offer() {
  return (
    <section className="container offer-section">
      <Reveal>
        <div className="offer-banner">
          <div className="offer-copy">
            <p className="eyebrow">
              <Sparkles size={15} /> A LITTLE TREAT FOR YOUR EVERYDAY
            </p>
            <h2>
              Big ideas.
              <br />
              <em>Little prices.</em>
            </h2>
            <p>
              Fresh starts shouldn’t cost a fortune. Discover our
              <br className="desktop-break" /> handpicked essentials at even
              lovelier prices.
            </p>
            <Link href="/shop?offer=true" className="button button-primary">
              Explore special offers <ArrowRight size={17} />
            </Link>
            <span className="offer-note">
              Good finds. Limited-time savings.
            </span>
          </div>
          <div className="offer-image">
            <img
              src={photos.stationery}
              alt="A thoughtfully arranged notebook, pen and stationery set"
              loading="lazy"
            />
            <div className="offer-seal">
              <span>UP TO</span>
              <strong>25%</strong>
              <span>OFF SELECTED FINDS</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
