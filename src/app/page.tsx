import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { Offer } from "@/components/home/offer";
import { WhyUs, Community } from "@/components/home/why-us";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { Newsletter } from "@/components/newsletter";
import { getProducts } from "@/lib/products";

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.filter((p) => p.featured);
  const newProducts = products.filter((p) => p.isNew);
  return (
    <>
      <Hero />
      <CategoryGrid />
      <section className="section bestsellers">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="LOVED FOR A REASON"
              title="Your everyday favourites"
              description="The little essentials that make a big difference."
              link="/shop?sort=popular"
              linkText="Shop bestsellers"
            />
          </Reveal>
          <div className="product-grid">
            {featuredProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.06}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Offer />
      <section className="section arrivals">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="FRESH ON OUR SHELVES"
              title="New finds, new possibilities"
              description="A little something new to inspire your everyday."
              link="/shop?sort=newest"
              linkText="Discover new arrivals"
            />
          </Reveal>
          <div className="product-grid">
            {newProducts.slice(0, 4).map((product, i) => (
              <Reveal key={product.id} delay={i * 0.06}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <WhyUs />
      <Community />
      <Newsletter />
    </>
  );
}
