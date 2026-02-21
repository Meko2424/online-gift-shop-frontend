export type MenuItem = { label: string; href: string };
export type MenuGroup = { title: string; items: MenuItem[] };

export type MenuCategory = {
  label: string;
  href: string;
  groups: MenuGroup[];
  featured?: { title: string; subtitle?: string; href: string }[];
};

export const MENU: MenuCategory[] = [
  {
    label: "Food & Grocery",
    href: "/c/food-grocery",
    groups: [
      {
        title: "Fresh Foods",
        items: [
          {
            label: "Meat & Poultry (Chicken, Goat, Sheep)",
            href: "/c/meat-poultry",
          },
          { label: "Fish & Seafood", href: "/c/fish-seafood" },
        ],
      },
      {
        title: "Fruits & Vegetables",
        items: [{ label: "Shop All", href: "/c/fruits-vegetables" }],
      },
      {
        title: "Dairy & Eggs",
        items: [{ label: "Shop All", href: "/c/dairy-eggs" }],
      },
      {
        title: "Bakery & Bread",
        items: [
          { label: "Injera", href: "/c/injera" },
          { label: "Breads", href: "/c/breads" },
        ],
      },
      {
        title: "Grains & Staples",
        items: [
          { label: "Teff & Flour", href: "/c/teff-flour" },
          { label: "Rice & Pasta", href: "/c/rice-pasta" },
        ],
      },
      {
        title: "Spices & Condiments",
        items: [
          { label: "Spices (Baltina)", href: "/c/spices-baltina" },
          { label: "Salt & Sugar", href: "/c/salt-sugar" },
        ],
      },
      {
        title: "Beverages",
        items: [
          { label: "Water", href: "/c/water" },
          { label: "Soft Drinks & Soda", href: "/c/soft-drinks" },
          { label: "Juice", href: "/c/juice" },
          { label: "Coffee & Tea", href: "/c/coffee-tea" },
        ],
      },
      {
        title: "Snacks & Sweets",
        items: [
          { label: "Candy", href: "/c/candy" },
          { label: "Chocolate", href: "/c/chocolate" },
        ],
      },
      {
        title: "Health & Safety",
        items: [
          { label: "Masks", href: "/c/masks" },
          { label: "Sanitizers", href: "/c/sanitizers" },
          { label: "Gloves", href: "/c/gloves" },
        ],
      },
    ],
    featured: [
      {
        title: "Best Sellers",
        subtitle: "Top grocery picks",
        href: "/c/best-sellers",
      },
      {
        title: "New Arrivals",
        subtitle: "Freshly added",
        href: "/c/new-arrivals",
      },
    ],
  },

  {
    label: "Cakes & Bakery",
    href: "/c/cakes-bakery",
    groups: [
      {
        title: "Cakes",
        items: [
          { label: "Classic Cakes", href: "/c/classic-cakes" },
          { label: "Custom & Design Cakes", href: "/c/custom-cakes" },
          { label: "Fasting Cakes", href: "/c/fasting-cakes" },
        ],
      },
      {
        title: "Hotel Cakes",
        items: [
          { label: "Sheraton Cakes", href: "/c/sheraton-cakes" },
          { label: "Hilton Cakes", href: "/c/hilton-cakes" },
          { label: "London Cakes", href: "/c/london-cakes" },
        ],
      },
      {
        title: "Pastries",
        items: [{ label: "Donuts & Pastries", href: "/c/donuts-pastries" }],
      },
    ],
  },

  {
    label: "Flowers & Balloons",
    href: "/c/flowers-balloons",
    groups: [
      {
        title: "Flowers",
        items: [{ label: "Flower Bouquets", href: "/c/flower-bouquets" }],
      },
      {
        title: "Balloons",
        items: [{ label: "Balloon Arrangements", href: "/c/balloons" }],
      },
      {
        title: "Romance",
        items: [{ label: "Romantic Gifts", href: "/c/romantic-gifts" }],
      },
    ],
  },

  {
    label: "Combo Packages",
    href: "/c/combo-packages",
    groups: [
      {
        title: "Combos",
        items: [
          { label: "Holiday Packages", href: "/c/holiday-packages" },
          { label: "Grocery Combos", href: "/c/grocery-combos" },
          {
            label: "Flower & Balloon Combos",
            href: "/c/flower-balloon-combos",
          },
          { label: "Special Gift Packages", href: "/c/special-gift-packages" },
          { label: "Seasonal Combos", href: "/c/seasonal-combos" },
        ],
      },
    ],
  },

  {
    label: "Holidays & Occasions",
    href: "/c/holidays-occasions",
    groups: [
      {
        title: "Occasions",
        items: [
          { label: "Birthday Gifts", href: "/c/birthday" },
          { label: "Anniversary Gifts", href: "/c/anniversary" },
          { label: "Valentine’s Gifts", href: "/c/valentines" },
          { label: "Romantic Gifts", href: "/c/romantic-gifts" },
          { label: "Congratulations", href: "/c/congratulations" },
          { label: "Graduation", href: "/c/graduation" },
          { label: "Get Well Soon", href: "/c/get-well" },
          { label: "Sympathy & Condolences", href: "/c/sympathy" },
          { label: "Thank You / Thinking of You", href: "/c/thank-you" },
        ],
      },
      {
        title: "Seasons",
        items: [
          { label: "Holiday Specials", href: "/c/holiday-specials" },
          { label: "Fasting Season", href: "/c/fasting-season" },
          { label: "Religious Holidays", href: "/c/religious-holidays" },
        ],
      },
    ],
  },

  {
    label: "Personal Care & Beauty",
    href: "/c/personal-care",
    groups: [
      {
        title: "Perfumes",
        items: [
          { label: "Men’s Fragrance", href: "/c/mens-fragrance" },
          { label: "Women’s Fragrance", href: "/c/womens-fragrance" },
        ],
      },
      {
        title: "Beauty",
        items: [
          { label: "Cosmetics & Makeup", href: "/c/cosmetics" },
          { label: "Hair Care", href: "/c/hair-care" },
        ],
      },
      {
        title: "Body Care",
        items: [
          { label: "Soap", href: "/c/soap" },
          { label: "Lotion", href: "/c/lotion" },
          { label: "Vaseline", href: "/c/vaseline" },
          { label: "Spa Packages", href: "/c/spa" },
        ],
      },
    ],
  },

  {
    label: "Baby & Kids",
    href: "/c/baby-kids",
    groups: [
      {
        title: "Baby Essentials",
        items: [
          { label: "Diapers", href: "/c/diapers" },
          { label: "Wipes", href: "/c/wipes" },
          { label: "Formula Milk", href: "/c/formula" },
          { label: "Bottles", href: "/c/bottles" },
        ],
      },
      {
        title: "Kids",
        items: [
          { label: "Toys", href: "/c/toys" },
          { label: "Kids Gift Sets", href: "/c/kids-gift-sets" },
        ],
      },
      {
        title: "School Supplies",
        items: [
          { label: "School Bags", href: "/c/school-bags" },
          { label: "Notebooks", href: "/c/notebooks" },
          { label: "Lunch Boxes", href: "/c/lunch-boxes" },
          { label: "Crayons & Stationery", href: "/c/stationery" },
        ],
      },
    ],
  },

  {
    label: "Experiences & Services",
    href: "/c/experiences",
    groups: [
      {
        title: "Tickets",
        items: [
          { label: "Resort & Water Park Tickets", href: "/c/resort-tickets" },
          { label: "Kuriftu Water Park", href: "/c/kuriftu-water-park" },
        ],
      },
      {
        title: "Services",
        items: [
          { label: "Event Packages", href: "/c/event-packages" },
          { label: "Experience Gifts", href: "/c/experience-gifts" },
        ],
      },
    ],
  },

  {
    label: "Gift Cards & Utilities",
    href: "/c/gift-cards",
    groups: [
      {
        title: "Gift Cards",
        items: [{ label: "Gift Cards", href: "/c/gift-cards" }],
      },
      {
        title: "Utilities",
        items: [
          { label: "Mobile Recharge", href: "/c/mobile-recharge" },
          { label: "Phone Cards", href: "/c/phone-cards" },
        ],
      },
    ],
  },

  {
    label: "New & Popular",
    href: "/c/new-popular",
    groups: [
      {
        title: "Discover",
        items: [
          { label: "New Arrivals", href: "/c/new-arrivals" },
          { label: "Best Sellers", href: "/c/best-sellers" },
          { label: "Trending Gifts", href: "/c/trending" },
        ],
      },
    ],
  },
];
