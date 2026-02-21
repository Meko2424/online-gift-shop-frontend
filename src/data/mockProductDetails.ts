export type BundleComponent = {
  sku: string;
  name: string;
  qty: number;
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
  badges?: string[];
  categoryHref?: string;
  type: "simple" | "bundle";
  components?: BundleComponent[]; // only for bundle
};

export const PRODUCT_DETAILS: ProductDetail[] = [
  {
    id: "p1",
    slug: "premium-chocolate-gift-basket",
    name: "Premium Chocolate Gift Basket",
    description:
      "A premium selection of chocolates and sweets—perfect for birthdays, congratulations, and thank-you gifts.",
    imageUrl:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1600&q=80",
    price: 89.95,
    rating: 4.9,
    reviewCount: 214,
    badges: ["Customer Favorite"],
    type: "simple",
  },
  {
    id: "p2",
    slug: "celebration-combo",
    name: "Celebration Combo Package (Flowers + Cake)",
    description:
      "A beautiful bouquet paired with a celebration cake. A perfect all-in-one combo for birthdays and special moments.",
    imageUrl:
      "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1600&q=80",
    price: 149.95,
    compareAtPrice: 169.95,
    rating: 4.6,
    reviewCount: 97,
    badges: ["Best Seller"],
    type: "bundle",
    components: [
      { sku: "FLOW-ROSE-12", name: "Rose Bouquet (12 stems)", qty: 1 },
      { sku: "CAKE-CHOC-8", name: "Chocolate Cake (8 inch)", qty: 1 },
      { sku: "CARD-GREET", name: "Greeting Card", qty: 1 },
    ],
  },
];
