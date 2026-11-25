import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Globe2,
} from "lucide-react";
import { photos } from "@/lib/catalog";
import { WhyUs } from "@/components/home/why-us";
import { Newsletter } from "@/components/newsletter";
export const metadata: Metadata = { title: "Our Story" };
export default function AboutPage() {
  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <span>About us</span>
          </div>
          <p className="eyebrow">A LITTLE ABOUT QADRIYA TRADERS</p>
          <h1>For every chapter of your journey.</h1>
          <p>
            More than books and stationery. A little inspiration for what comes
            next.
          </p>
        </div>
      </section>
      <section className="container about-hero">
        <div>
          <p className="eyebrow">OUR STORY</p>
          <h1>
            Good things begin
            <br />
            with curiosity.
          </h1>
          <p>
            Qadriya Traders is a business built around a simple idea: the
            everyday things we learn with, write with, and create with should
            feel a little special.
          </p>
          <p>
            Through import and local trade, we bring together books, stationery,
            educational supplies, and school and office essentials. From a
            student’s first notebook to a professional’s favourite pen, our
            collection is chosen to support every chapter of life.
          </p>
          <p>
            We believe in quality, honest value, and personal service. Whether
            you’re finding one perfect item or stocking up for a whole school,
            we’re here to help.
          </p>
          <Link
            href="/shop"
            className="button button-primary"
            style={{ marginTop: 25 }}
          >
            Discover our collection <ArrowRight size={17} />
          </Link>
        </div>
        <img
          src={photos.study}
          alt="Books and stationery thoughtfully arranged in a welcoming study space"
        />
      </section>
      <section className="about-values">
        <div className="container">
          <p className="eyebrow">WHAT WE STAND FOR</p>
          <h2>Small details. Meaningful differences.</h2>
          <div className="values-grid">
            <article className="value-card">
              <BookOpen size={28} strokeWidth={1.4} />
              <h3>Learning, for everyone.</h3>
              <p>
                From school books to university essentials, we make it easier to
                find the tools that turn curiosity into knowledge.
              </p>
            </article>
            <article className="value-card">
              <Globe2 size={28} strokeWidth={1.4} />
              <h3>Thoughtfully sourced.</h3>
              <p>
                Our mix of imported and locally traded products brings together
                variety, dependable quality, and everyday value.
              </p>
            </article>
            <article className="value-card">
              <HeartHandshake size={28} strokeWidth={1.4} />
              <h3>A personal touch.</h3>
              <p>
                We’re real people who care about your experience. Have a
                question or a special request? Let’s talk.
              </p>
            </article>
          </div>
        </div>
      </section>
      <WhyUs />
      <Newsletter />
    </>
  );
}
