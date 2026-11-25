import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container not-found">
      <p className="eyebrow">A LITTLE DETOUR</p>
      <h1>This page turned a corner.</h1>
      <p>
        We couldn’t find what you were looking for. There’s plenty more to
        discover.
      </p>
      <Link href="/shop" className="button button-primary">
        Back to the shop <ArrowRight size={17} />
      </Link>
    </div>
  );
}
