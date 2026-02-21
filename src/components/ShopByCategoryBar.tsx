import { Flame, Gift, Sparkles, Baby, Ticket, CreditCard } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

type Item = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

export default function ShopByCategoryBar() {
  const items: Item[] = [
    { label: "Best Sellers", href: "/c/best-sellers", Icon: Flame },
    { label: "Personal Care", href: "/c/personal-care", Icon: Sparkles },
    { label: "Baby & Kids", href: "/c/baby-kids", Icon: Baby },
    { label: "Experiences", href: "/c/experiences", Icon: Ticket },
    { label: "Gift Cards", href: "/c/gift-cards", Icon: CreditCard },
    { label: "New & Popular", href: "/c/new-popular", Icon: Gift },
  ];
  const location = useLocation();

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pt-10">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-gray-500">
            SHOP BY
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            CATEGORY
          </h2>
        </div>

        <div className="mt-8 rounded-3xl border bg-white shadow-sm">
          <div className="flex flex-wrap items-stretch justify-center gap-0 px-2 py-2">
            {items.map((it, idx) => (
              <div key={it.href} className="flex items-stretch">
                <NavLink
                  to={it.href}
                  className={({ isActive }) =>
                    [
                      "group flex flex-col items-center justify-center px-6 py-4 text-center",
                      "min-w-[160px] sm:min-w-[180px]",
                      "transition hover:bg-gray-50 rounded-2xl",
                      isActive ? "text-rose-600" : "text-gray-800",
                    ].join(" ")
                  }
                >
                  <it.Icon
                    size={22}
                    className="mb-2 text-gray-900 group-hover:text-gray-900"
                  />
                  <span className="text-sm font-medium">{it.label}</span>

                  {/* Active underline (GiftTree-like) */}
                  <span
                    className={[
                      "mt-3 h-[3px] w-16 rounded-full",
                      "group-hover:bg-rose-200/60",
                      // this makes it look selected
                      location.pathname === it.href
                        ? "bg-rose-600"
                        : "bg-transparent",
                    ].join(" ")}
                  />
                  <span className="sr-only">Go to {it.label}</span>
                </NavLink>

                {/* vertical divider */}
                {idx !== items.length - 1 && (
                  <div className="hidden sm:block my-4 w-px bg-rose-500/60" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Optional small “View all” link */}
        <div className="mt-3 text-center">
          <Link
            to="/c/new-popular"
            className="text-sm font-semibold text-gray-700 hover:text-black underline underline-offset-4"
          >
            View all categories
          </Link>
        </div>
      </div>
    </section>
  );
}
