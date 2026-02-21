import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroCarousel from "./components/HeroCarousel";
import ShopBySection from "./components/ShopBySection";
import ShopByCategoryBar from "./components/ShopByCategoryBar";
import ProductCarousel from "./components/ProductCarousel";
import { BEST_SELLERS } from "./data/mockProducts";
import ProductDetailPage from "./pages/ProductDetailPage";
// function Home() {
//   return (
//     <div className="mx-auto max-w-7xl px-4 py-10">
//       <h1 className="text-3xl font-bold">Home</h1>
//       <p className="mt-2 text-gray-600">
//         Next: hero banner + category tiles + product sections.
//       </p>
//     </div>
//   );
// }

function Home() {
  const heroSlides = [
    {
      title: "Send gifts, cakes, flowers, and groceries",
      subtitle:
        "A premium way to celebrate and support family — delivered fast.",
      cta: "Shop Holidays & Occasions",
      href: "/c/holidays-occasions",
      imageUrl:
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1600&q=80",
    },
  ];

  const shopByOccasion = [
    {
      title: "Birthday Gifts",
      href: "/c/birthday",
      imageUrl:
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Thank You",
      href: "/c/thank-you",
      imageUrl:
        "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Congratulations",
      href: "/c/congratulations",
      imageUrl:
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Get Well Soon",
      href: "/c/get-well",
      imageUrl:
        "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Sympathy",
      href: "/c/sympathy",
      imageUrl:
        "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Valentine’s",
      href: "/c/valentines",
      imageUrl:
        "https://images.unsplash.com/photo-1518552781329-7fcb0b1e9d86?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // “rest of categories” that you don’t want in the navbar:
  const moreToExplore = [
    {
      title: "Personal Care & Beauty",
      href: "/c/personal-care",
      imageUrl:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Baby & Kids",
      href: "/c/baby-kids",
      imageUrl:
        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Experiences & Services",
      href: "/c/experiences",
      imageUrl:
        "https://images.unsplash.com/photo-1529419412599-7bb870e11810?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Gift Cards & Utilities",
      href: "/c/gift-cards",
      imageUrl:
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "New & Popular",
      href: "/c/new-popular",
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Best Sellers",
      href: "/c/best-sellers",
      imageUrl:
        "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <main>
      <HeroCarousel slides={heroSlides} />

      {/* NEW GiftTree-style category bar */}
      {/* <ShopByCategoryBar /> */}
      <ShopByCategoryBar />
      <ProductCarousel title="Best Sellers" products={BEST_SELLERS} />
      <ShopBySection
        title="Shop By Occasion"
        accentWord="Occasion"
        tiles={shopByOccasion}
      />
    </main>
    // <main>
    //   <HeroCarousel slides={heroSlides} />

    //   <ShopBySection
    //     title="Shop By Occasion"
    //     accentWord="Occasion"
    //     tiles={shopByOccasion}
    //   />

    //   <ShopBySection title="More to Explore" tiles={moreToExplore} />
    // </main>
  );
}

function Category() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Category page</h1>
      <p className="mt-2 text-gray-600">Next: filters + product grid cards.</p>
    </div>
  );
}

function Cart() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Cart</h1>
    </div>
  );
}

function Account() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Account</h1>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/c/:slug" element={<Category />} />
        <Route path="/p/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
  );
}
