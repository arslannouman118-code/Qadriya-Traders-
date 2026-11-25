import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  linkText,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: string;
  linkText?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="section-description">{description}</p>}
      </div>
      {link && (
        <Link href={link} className="text-link">
          {linkText || "Explore collection"} <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
