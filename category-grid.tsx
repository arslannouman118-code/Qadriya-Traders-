import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/catalog";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../reveal";

export function CategoryGrid({ all = false }: { all?: boolean }) {
  const featuredIds = [
    "school-books",
    "notebooks",
    "pens-pencils",
    "art-craft",
    "school-bags",
    "office-stationery",
  ];
  const items = all
    ? categories
    : featuredIds.map((id) => categories.find((c) => c.id === id)!);
  return (
    <section
      className={`section category-section ${all ? "all-categories" : ""}`}
    >
      <div className="container">
        {!all && (
          <Reveal>
            <SectionHeading
              eyebrow="A WORLD OF POSSIBILITIES"
              title="Find your next favourite"
              description="For school days, workdays, and everything in between."
              link="/categories"
              linkText="View all categories"
            />
          </Reveal>
        )}
        <div className="category-grid">
          {items.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.04}>
              <Link
                href={`/shop?category=${category.id}`}
                className="category-card"
              >
                <div
                  className="category-image"
                  style={{ background: category.color }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                  />
                  <span>
                    <ArrowUpRight size={19} />
                  </span>
                </div>
                <h3>{category.shortName}</h3>
                {all && <p>{category.description}</p>}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
