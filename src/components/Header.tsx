import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { MENU } from "../data/menu";
import type { MenuCategory } from "../data/menu";
import { useCart } from "../cart/cart";

function classNames(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <PromoStrip />
      <TopBar />
      <RedMegaNav />
    </header>
  );
}

function PromoStrip() {
  return (
    <div className="bg-black text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between gap-3">
        <p className="truncate">
          Delivering gifts & groceries — fast, fresh, and reliable.
        </p>
        <div className="hidden sm:flex items-center gap-4">
          <Link className="underline underline-offset-4" to="/c/new-arrivals">
            New Arrivals
          </Link>
          <Link className="underline underline-offset-4" to="/c/best-sellers">
            Best Sellers
          </Link>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  const { itemsCount } = useCart();
  return (
    <div className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
        <Link
          to="/"
          className="font-bold text-xl tracking-tight whitespace-nowrap"
        >
          BoleGifts
        </Link>

        {/* Centered search like GiftTree */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-2xl">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <Search size={18} />
              </span>
              <input
                // className="w-full rounded-full border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-black"
                className="w-full rounded-full border border-search-field bg-white py-2.5 pl-10 pr-4 text-sm outline-none  "
                placeholder="Search gifts, grocery, cakes, flowers…"
              />
            </label>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/account"
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label="Account"
          >
            <User size={20} />
          </Link>
          <Link
            to="/cart"
            className="relative isolate rounded-full p-2 hover:bg-gray-100"
            aria-label="Cart"
          >
            {/* <ShoppingCart size={20} /> */}
            <ShoppingCart size={20} />
            {itemsCount > 0 ? (
              <span className="pointer-events-none absolute -right-1 -top-1 z-10 grid h-5 min-w-[20px] place-items-center rounded-full bg-black px-1 text-[11px] font-bold leading-none text-white">
                {itemsCount > 99 ? "99+" : itemsCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </div>
  );
}

function RedMegaNav() {
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  const navLabels = new Set([
    "Food & Grocery",
    "Cakes & Bakery",
    "Flowers & Balloons",
    "Holidays & Occasions",
    "Combo Packages",
  ]);

  const categories = useMemo(
    () => MENU.filter((c) => navLabels.has(c.label)),
    [],
  );

  const activeCategory = useMemo(
    () => categories.find((c) => c.label === openLabel) ?? null,
    [categories, openLabel],
  );

  return (
    <nav className="bg-primary-brand  text-white">
      {/* <nav className="bg-gradient-to-b from-rose-600 to-rose-700 text-white"> */}
      {/* anchor for dropdown */}
      <div className="relative" onMouseLeave={() => setOpenLabel(null)}>
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex items-center justify-center gap-10 py-3 text-sm font-semibold tracking-wide">
            {categories.map((cat) => (
              <li
                key={cat.label}
                onMouseEnter={() => setOpenLabel(cat.label)}
                className="relative"
              >
                <NavLink
                  to={cat.href}
                  className={({ isActive }) =>
                    classNames(
                      // "inline-flex items-center gap-2 opacity-95 hover:opacity-100",
                      // isActive ? "opacity-100" : "",
                      "group relative inline-flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200",
                      "text-white/90 hover:text-white",
                      "hover:bg-white/10",
                      isActive ? "text-white bg-white/15" : "",
                    )
                  }
                >
                  {cat.label}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
                  {/* <span className="text-white/90">▾</span> */}
                  <ChevronDown
                    size={14}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* dropdown layer */}
        {activeCategory && (
          <div className="absolute left-0 right-0 top-full">
            <div className="border-t border-black/10 bg-white/95 text-gray-900 backdrop-blur">
              <div className="mx-auto max-w-7xl px-4 py-6">
                <MegaMenuGrid category={activeCategory} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function MegaMenuGrid({ category }: { category: MenuCategory }) {
  return (
    <div className="rounded-2xl border bg-white shadow-lg p-6">
      <div className="flex items-start gap-10">
        {/* Groups in columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 flex-1">
          {category.groups.map((g) => (
            <div key={g.title}>
              <p className="text-sm font-semibold text-gray-900">{g.title}</p>
              <ul className="mt-3 space-y-2">
                {g.items.map((it) => (
                  <li key={it.href}>
                    <Link
                      to={it.href}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Optional featured column */}
        {category.featured?.length ? (
          <div className="hidden lg:block w-64">
            <p className="text-sm font-semibold text-gray-900">Featured</p>
            <div className="mt-3 space-y-3">
              {category.featured.map((f) => (
                <Link
                  key={f.href}
                  to={f.href}
                  className="block rounded-xl border p-4 hover:bg-gray-50"
                >
                  <p className="font-semibold text-sm">{f.title}</p>
                  {f.subtitle ? (
                    <p className="text-xs text-gray-600 mt-1">{f.subtitle}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <Link
          to={category.href}
          className="text-sm font-semibold underline underline-offset-4"
        >
          Shop all {category.label}
        </Link>
      </div>
    </div>
  );
}
