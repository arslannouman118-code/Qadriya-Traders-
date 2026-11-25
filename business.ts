// Business information shown across the website.
export const business = {
  name: "Qadriya Traders",
  tagline: "Books, stationery & a little inspiration.",
  description:
    "Qadriya Traders brings together books, stationery, and educational essentials through import and local trade. Thoughtfully chosen for students, creators, and everyday dreamers.",
  phone: "+923007694027",
  email: "haqdilawar@gmail.com",
  address: "P Block 38, House No. 2260, Samanabad, Faisalabad (Near Farooqia Masjid)",
  hours: "Monday – Saturday: 9:00 AM – 7:00 PM",
  hoursNote: "",
  currency: "PKR",
  freeDeliveryThreshold: 999,
  deliveryFee: 49,
};

export function whatsappUrl(message: string) {
  const phone = business.phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}