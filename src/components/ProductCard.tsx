import { Link } from "react-router-dom";
//import { useCart } from "../cart/cart";

export type Product = {
  id: string;
  name: string;
  href: string;
  imageUrl: string;
  price: number;
  compareAtPrice?: number; // old price (optional)
  rating?: number; // 0-5 (optional)
  badge?: string; // e.g. "Best Seller", "$20 OFF"
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function Stars({ rating = 0 }: { rating?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex text-amber-400">
        {Array.from({ length: full }).map((_, i) => (
          <span key={`f-${i}`}>★</span>
        ))}
        {half ? <span>☆</span> : null}
        {Array.from({ length: empty }).map((_, i) => (
          <span key={`e-${i}`} className="text-amber-200">
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-gray-700">
        {rating ? rating.toFixed(1) : ""}
      </span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  // const cart = useCart();
  return (
    <div className="relative flex h-full flex-col rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Badge */}
      {product.badge ? (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-900 shadow ring-1 ring-black/5">
          {product.badge}
        </div>
      ) : null}

      <Link to={product.href} className="block">
        <div className="p-5">
          <div className="rounded-xl bg-gray-50 p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="mx-auto h-52 w-full object-contain"
              loading="lazy"
            />
          </div>

          <h3 className="mt-5 line-clamp-2 text-lg font-semibold text-gray-900">
            {product.name}
          </h3>

          <div className="mt-3">
            <Stars rating={product.rating ?? 0} />
          </div>

          <div className="mt-4 flex items-end gap-3">
            {product.compareAtPrice ? (
              <span className="text-sm text-gray-400 line-through">
                {formatMoney(product.compareAtPrice)}
              </span>
            ) : null}
            <span className="text-xl font-semibold text-gray-900">
              {formatMoney(product.price)}
            </span>
          </div>
        </div>
      </Link>

      {/*<div className="mt-auto px-5 pb-5">
        <button
          type="button"
          className="w-full rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-900"
          //
          onClick={() =>
            cart.addItem(
              {
                product_id: Number(product.id),
                slug: product.href.replace("/p/", ""),
                name: product.name,
                image_url: product.imageUrl,
                unit_price: product.price,
                product_type: product.badge === "Combo" ? "bundle" : "simple",
              },
              1,
            )
          }
        >
          Add to Cart
        </button> 
      </div>*/}
    </div>
  );
}
//==========================================================
// import { Link } from "react-router-dom";
// import type { ProductListOut } from "../types/api";

// function formatMoney(n: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(n);
// }

// const FALLBACK_IMG =
//   "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80";

// export default function ProductCard({ product }: { product: ProductListOut }) {
//   return (
//     <Link
//       to={`/p/${product.slug}`}
//       className="group block rounded-3xl border bg-white p-4 shadow-sm hover:shadow-md transition"
//     >
//       <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-50">
//         <img
//           src={product.image_url || FALLBACK_IMG}
//           alt={product.name}
//           className="h-full w-full object-cover transition group-hover:scale-[1.02]"
//           loading="lazy"
//         />
//       </div>

//       <div className="mt-4">
//         <p className="text-sm font-semibold text-gray-900 line-clamp-2">
//           {product.name}
//         </p>
//         <div className="mt-2 flex items-end justify-between">
//           <p className="text-sm font-semibold">{formatMoney(product.price)}</p>
//           {product.compare_at_price ? (
//             <p className="text-xs text-gray-400 line-through">
//               {formatMoney(product.compare_at_price)}
//             </p>
//           ) : null}
//         </div>
//       </div>
//     </Link>
//   );
// }
