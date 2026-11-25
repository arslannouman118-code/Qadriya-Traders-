export type ProductInput = {
  id?: string;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  badge: string;
  description: string;
  details: string;
  featured: boolean;
  isNew: boolean;
  active: boolean;
  /** A freshly chosen photo, as a resized JPEG data URL. */
  imageData: string;
};

export type SaveResult = { ok: true } | { ok: false; error: string };
