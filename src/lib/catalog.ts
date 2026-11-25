export type Category = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  image: string;
  color: string;
};
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  details: string[];
  badge?: string;
  featured?: boolean;
  isNew?: boolean;
  stock: number;
};

const photo = (id: string, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
export const photos = {
  hero: photo("6193081", 1400),
  notebook: photo("6991507"),
  stationery: photo("8099505", 1200),
  pastel: photo("6192763", 1000),
  books: photo("2002217"),
  bookStack: photo("34889792"),
  pencils: photo("627901"),
  pens: photo("29765813"),
  art: photo("4980474"),
  bag: photo("1546003"),
  office: photo("8099483"),
  files: photo("7718844"),
  paper: photo("5594264"),
  study: photo("5124870", 1200),
  journal: photo("8230968"),
  geometry: photo("15483356"),
};

export const categories: Category[] = [
  {
    id: "school-books",
    name: "School Books",
    shortName: "School & College Books",
    description: "Big discoveries start with a good book.",
    image: photos.books,
    color: "#e8e3db",
  },
  {
    id: "college-books",
    name: "College Books",
    shortName: "College Books",
    description: "Knowledge for your next chapter.",
    image: photos.bookStack,
    color: "#e9e3d8",
  },
  {
    id: "university-books",
    name: "University Books",
    shortName: "University Books",
    description: "Go deeper. Think bigger.",
    image: photo("159711"),
    color: "#dce8e7",
  },
  {
    id: "notebooks",
    name: "Notebooks & Registers",
    shortName: "Notebooks & Registers",
    description: "A fresh page for every possibility.",
    image: photos.notebook,
    color: "#e8e5d8",
  },
  {
    id: "pens-pencils",
    name: "Pens & Pencils",
    shortName: "Pens & Pencils",
    description: "Make your mark, beautifully.",
    image: photos.pens,
    color: "#eedfe2",
  },
  {
    id: "art-craft",
    name: "Art & Craft Supplies",
    shortName: "Art & Craft",
    description: "A little colour. A lot of imagination.",
    image: photos.pencils,
    color: "#e3e9dd",
  },
  {
    id: "geometry",
    name: "Geometry Boxes & Mathematical Instruments",
    shortName: "Geometry & Instruments",
    description: "Precision for bright minds.",
    image: photos.geometry,
    color: "#e6e8ec",
  },
  {
    id: "school-bags",
    name: "School Bags",
    shortName: "School Bags",
    description: "Carry your world with confidence.",
    image: photos.bag,
    color: "#eee3d8",
  },
  {
    id: "office-stationery",
    name: "Office Stationery",
    shortName: "Office Essentials",
    description: "Thoughtful tools for a productive day.",
    image: photos.office,
    color: "#dce8e6",
  },
  {
    id: "files-folders",
    name: "Files & Folders",
    shortName: "Files & Folders",
    description: "Everything in its happy place.",
    image: photos.files,
    color: "#e8dfd3",
  },
  {
    id: "paper-printing",
    name: "Paper & Printing Supplies",
    shortName: "Paper & Printing",
    description: "A better canvas for your ideas.",
    image: photos.paper,
    color: "#ede4e7",
  },
  {
    id: "educational-accessories",
    name: "Educational Accessories",
    shortName: "Educational Accessories",
    description: "Small tools. Wonderful discoveries.",
    image: photos.pastel,
    color: "#e6e9d9",
  },
];

export const products: Product[] = [
  {
    id: "everyday-notebook",
    name: "The Everyday Notebook",
    category: "notebooks",
    price: 149,
    originalPrice: 199,
    image: photos.notebook,
    description:
      "Meet your new everyday companion. A beautifully simple A5 notebook with smooth, easy-to-write-on pages and a sturdy cover. For morning thoughts, class notes, and your next big idea.",
    details: [
      "A5 size · 160 ruled pages",
      "70 GSM smooth, premium paper",
      "Lay-flat binding",
      "Durable kraft cover",
    ],
    badge: "BESTSELLER",
    featured: true,
    stock: 42,
  },
  {
    id: "classic-gel-pens",
    name: "SmoothFlow Gel Pens · Set of 5",
    category: "pens-pencils",
    price: 99,
    originalPrice: 125,
    image: photos.pens,
    description:
      "Make every word feel effortless. Our smooth-flow gel pens offer a consistent, clean line with a comfortable grip and quick-drying ink. A considered addition to every pencil case.",
    details: [
      "Set of 5 gel pens",
      "0.5 mm fine point",
      "Quick-drying black ink",
      "Comfortable, lightweight grip",
    ],
    badge: "20% OFF",
    featured: true,
    stock: 60,
  },
  {
    id: "artist-colour-pencils",
    name: "Artist Colour Pencils · 24 Shades",
    category: "art-craft",
    price: 249,
    originalPrice: 299,
    image: photos.pencils,
    description:
      "From the first doodle to a detailed masterpiece, find the perfect shade in this rich collection of 24 artist colour pencils. Soft, blendable pigment makes creativity feel natural.",
    details: [
      "24 carefully selected colours",
      "Rich, blendable pigment",
      "Durable, easy-sharpen leads",
      "Reusable storage tin",
    ],
    badge: "BESTSELLER",
    featured: true,
    stock: 28,
  },
  {
    id: "essential-school-set",
    name: "Essential School Book Set",
    category: "school-books",
    price: 499,
    originalPrice: 599,
    image: photos.books,
    description:
      "A thoughtfully curated set of reference books to support everyday learning. Clear explanations and practical exercises help students build confidence, one chapter at a time.",
    details: [
      "3 reference books",
      "English, Mathematics & Science",
      "Suitable for middle-school learners",
      "Illustrated explanations and exercises",
    ],
    badge: "SAVE Rs 100",
    featured: true,
    stock: 18,
  },
  {
    id: "pastel-notebook-set",
    name: "Pastel Dreams Notebook Set",
    category: "notebooks",
    price: 299,
    image: photos.pastel,
    description:
      "Three beautifully coordinated notebooks to bring a little calm to your day. Keep your plans, notes, and ideas neatly separated in soft, considered colours.",
    details: [
      "Set of 3 A5 notebooks",
      "80 ruled pages each",
      "Soft-touch covers",
      "Pastel colour palette",
    ],
    badge: "NEW",
    isNew: true,
    stock: 35,
  },
  {
    id: "canvas-backpack",
    name: "The Everyday Canvas Backpack",
    category: "school-bags",
    price: 799,
    originalPrice: 999,
    image: photos.bag,
    description:
      "Room for books, big ideas, and everything in between. A durable canvas backpack with considered compartments and comfortable straps for your daily adventures.",
    details: [
      "Water-resistant canvas",
      "Padded laptop sleeve",
      "Adjustable shoulder straps",
      "18 litre capacity",
    ],
    badge: "NEW",
    isNew: true,
    stock: 16,
  },
  {
    id: "desk-organiser",
    name: "Minimal Desk Essentials Kit",
    category: "office-stationery",
    price: 349,
    image: photos.office,
    description:
      "Give your workspace a fresh start. This coordinated desk kit keeps your everyday essentials together so you can focus on what matters.",
    details: [
      "Notebook, pen & desk accessories",
      "Coordinated neutral colours",
      "Compact and practical",
      "Ideal for home or office",
    ],
    badge: "NEW",
    isNew: true,
    stock: 22,
  },
  {
    id: "watercolour-set",
    name: "Creative Watercolour Set",
    category: "art-craft",
    price: 399,
    originalPrice: 449,
    image: photos.art,
    description:
      "Let your imagination flow with a compact watercolour set. Beautifully blendable colours and a versatile brush make it a lovely companion for beginners and hobbyists.",
    details: [
      "12 vibrant watercolour pans",
      "1 round brush included",
      "Compact travel-friendly case",
      "Suitable for ages 6+",
    ],
    badge: "NEW",
    isNew: true,
    stock: 25,
  },
  {
    id: "college-reference",
    name: "The College Study Companion",
    category: "college-books",
    price: 349,
    image: photos.bookStack,
    description:
      "A practical reference for students moving into higher education. Build strong study habits, organise your notes, and approach your coursework with confidence.",
    details: [
      "Comprehensive study guide",
      "Practical examples and exercises",
      "Paperback edition",
      "English language",
    ],
    stock: 20,
  },
  {
    id: "university-notes",
    name: "University Academic Planner",
    category: "university-books",
    price: 249,
    image: photo("159711"),
    description:
      "A structured academic planner for a more intentional semester. Plan lectures, track assignments, and keep your goals in sight.",
    details: [
      "Undated academic planner",
      "Semester and weekly views",
      "Assignment tracking pages",
      "A5 size",
    ],
    stock: 30,
  },
  {
    id: "geometry-box",
    name: "Precision Geometry Box",
    category: "geometry",
    price: 179,
    image: photos.geometry,
    description:
      "All the essentials for accurate drawing and mathematics, neatly packed in a sturdy metal tin. A dependable companion for the classroom.",
    details: [
      "Compass, divider and protractor",
      "15 cm ruler and set squares",
      "Metal storage case",
      "Suitable for school and college",
    ],
    stock: 40,
  },
  {
    id: "graphite-pencils",
    name: "Premium Graphite Pencils · Pack of 12",
    category: "pens-pencils",
    price: 89,
    image: photos.pencils,
    description:
      "Smooth-writing graphite pencils with strong leads and a comfortable natural finish. Perfect for sketching, note-taking, and everyday use.",
    details: [
      "12 HB pencils",
      "Smooth graphite core",
      "Easy to sharpen",
      "Responsibly sourced wood",
    ],
    stock: 75,
  },
  {
    id: "document-folder",
    name: "Classic Document Folder",
    category: "files-folders",
    price: 129,
    image: photos.files,
    description:
      "Keep important papers beautifully organised in this durable document folder. A simple, considered way to bring order to your desk or bag.",
    details: [
      "A4 size",
      "Durable polypropylene",
      "Secure button closure",
      "Holds up to 100 sheets",
    ],
    stock: 34,
  },
  {
    id: "a4-paper",
    name: "Premium A4 Printing Paper",
    category: "paper-printing",
    price: 299,
    originalPrice: 349,
    image: photos.paper,
    description:
      "Crisp, bright paper for sharp printing and smooth writing. A dependable everyday essential for home, school, and office.",
    details: [
      "500 sheets per ream",
      "A4 · 80 GSM",
      "Bright white finish",
      "Printer and copier compatible",
    ],
    stock: 50,
  },
  {
    id: "sticky-notes",
    name: "Pastel Sticky Notes Collection",
    category: "educational-accessories",
    price: 119,
    image: photos.pastel,
    description:
      "Little reminders, big possibilities. These soft-coloured sticky notes help you mark important pages and keep your ideas close at hand.",
    details: [
      "6 pastel shades",
      "100 sheets per pad",
      "Repositionable adhesive",
      "Easy-peel design",
    ],
    stock: 65,
  },
  {
    id: "hardcover-journal",
    name: "Thoughts & Ideas Hardcover Journal",
    category: "notebooks",
    price: 249,
    image: photos.journal,
    description:
      "A beautifully bound journal for your thoughts, plans, and everyday discoveries. The hardcover protects your ideas wherever life takes you.",
    details: [
      "192 lined pages",
      "Hardcover with elastic closure",
      "Ribbon bookmark",
      "A5 size",
    ],
    isNew: true,
    stock: 27,
  },
  {
    id: "school-dictionary",
    name: "Student English Dictionary",
    category: "school-books",
    price: 199,
    image: photos.books,
    description:
      "An accessible reference for curious learners, with clear definitions and everyday examples to help build a confident vocabulary.",
    details: [
      "Illustrated student edition",
      "Easy-to-follow definitions",
      "Common usage examples",
      "Durable paperback",
    ],
    stock: 32,
  },
  {
    id: "scientific-calculator",
    name: "Scientific Calculator",
    category: "geometry",
    price: 599,
    image: photos.office,
    description:
      "A dependable scientific calculator for school, college, and everyday problem-solving. Clear display and intuitive controls make calculations simple.",
    details: [
      "240 scientific functions",
      "Two-line LCD display",
      "Protective sliding cover",
      "Battery included",
    ],
    stock: 15,
  },
  {
    id: "office-register",
    name: "Classic Office Register",
    category: "notebooks",
    price: 179,
    image: photos.notebook,
    description:
      "Keep your records and notes together in a classic hardbound register. Generous pages and a sturdy spine make it an everyday essential.",
    details: [
      "A4 hardbound register",
      "192 ruled pages",
      "70 GSM paper",
      "Durable stitched binding",
    ],
    stock: 36,
  },
  {
    id: "craft-paper",
    name: "Creative Craft Paper Pack",
    category: "art-craft",
    price: 149,
    image: photos.art,
    description:
      "A colourful collection of quality craft papers for school projects, handmade cards, and creative afternoons.",
    details: [
      "20 sheets in 10 colours",
      "A4 size · 120 GSM",
      "Easy to cut and fold",
      "Suitable for all ages",
    ],
    stock: 45,
  },
  {
    id: "file-set",
    name: "Everyday File & Folder Set",
    category: "files-folders",
    price: 229,
    image: photos.files,
    description:
      "A practical set of folders that makes sorting paperwork a pleasure. Keep subjects, projects, and important documents in order.",
    details: [
      "Set of 3 A4 folders",
      "Assorted neutral colours",
      "Secure closure",
      "Durable, reusable material",
    ],
    stock: 28,
  },
  {
    id: "study-highlighters",
    name: "Soft-Tone Highlighter Set",
    category: "educational-accessories",
    price: 159,
    image: photos.pastel,
    description:
      "Highlight what matters with gentle, readable colours. These chisel-tip markers are kind to your pages and perfect for focused study.",
    details: [
      "Set of 6 pastel highlighters",
      "Chisel tip",
      "Low-smear ink",
      "Comfortable barrel",
    ],
    stock: 48,
  },
  {
    id: "school-bag-mini",
    name: "Little Explorer School Bag",
    category: "school-bags",
    price: 549,
    image: photos.bag,
    description:
      "A lightweight, comfortable backpack for little learners and their everyday adventures. Just the right size for books, a lunchbox, and a favourite toy.",
    details: [
      "12 litre capacity",
      "Lightweight and durable",
      "Padded shoulder straps",
      "Easy-access front pocket",
    ],
    stock: 21,
  },
  {
    id: "desk-notepad",
    name: "Daily Desk Notepad",
    category: "office-stationery",
    price: 129,
    image: photos.stationery,
    description:
      "A fresh start for each day. Plan priorities, capture reminders, and clear your mind with a beautifully simple tear-off notepad.",
    details: [
      "50 tear-off sheets",
      "A5 size",
      "Daily task layout",
      "Sturdy backing board",
    ],
    stock: 40,
  },
];

export const featuredProducts = products.filter((p) => p.featured);
export const newProducts = products.filter((p) => p.isNew);
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const formatPrice = (price: number) =>
  `Rs ${price.toLocaleString("en-PK")}`;