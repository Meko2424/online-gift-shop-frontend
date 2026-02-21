import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { ProductDetail } from "../data/mockProductDetails";
import { PRODUCT_DETAILS } from "../data/mockProductDetails";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function Stars({ rating = 0 }: { rating?: number }) {
  const full = Math.floor(rating);
  const empty = Math.max(0, 5 - full);

  return (
    <div className="flex items-center gap-2">
      <div className="text-amber-400">
        {Array.from({ length: full }).map((_, i) => (
          <span key={`f-${i}`}>★</span>
        ))}
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

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
      {children}
    </span>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const product: ProductDetail | undefined = useMemo(
    () => PRODUCT_DETAILS.find((p) => p.slug === slug),
    [slug],
  );

  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Link className="mt-4 inline-block underline underline-offset-4" to="/">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/c/best-sellers" className="hover:text-black">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="rounded-2xl bg-gray-50 p-6">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="mx-auto h-[420px] w-full object-contain"
              />
            </div>

            {/* Thumbnails placeholder (future) */}
            <div className="mt-6 grid grid-cols-4 gap-3 opacity-60">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl border bg-gray-50" />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {product.badges?.map((b) => (
                <Badge key={b}>{b}</Badge>
              ))}
              {product.type === "bundle" ? <Badge>Combo Package</Badge> : null}
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <Stars rating={product.rating} />
              {product.reviewCount ? (
                <span className="text-sm text-gray-600">
                  ({product.reviewCount} reviews)
                </span>
              ) : null}
            </div>

            <div className="mt-6 flex items-end gap-3">
              {product.compareAtPrice ? (
                <span className="text-gray-400 line-through">
                  {formatMoney(product.compareAtPrice)}
                </span>
              ) : null}
              <span className="text-3xl font-semibold text-gray-900">
                {formatMoney(product.price)}
              </span>
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Bundle breakdown */}
            {product.type === "bundle" && product.components?.length ? (
              <div className="mt-8 rounded-2xl border bg-gray-50 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  What’s included
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  This combo is fulfilled using the items below.
                </p>

                <ul className="mt-4 space-y-3">
                  {product.components.map((c) => (
                    <li
                      key={c.sku}
                      className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500">SKU: {c.sku}</p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        × {c.qty}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 text-xs text-gray-600">
                  Inventory note (later): bundle availability is computed from
                  component stock.
                </div>
              </div>
            ) : null}

            {/* Quantity + Add to cart */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="inline-flex items-center rounded-full border bg-white px-3 py-2">
                <button
                  type="button"
                  className="h-9 w-9 rounded-full hover:bg-gray-50"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <div className="w-12 text-center font-semibold">{qty}</div>
                <button
                  type="button"
                  className="h-9 w-9 rounded-full hover:bg-gray-50"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="flex-1 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900"
                onClick={() =>
                  alert(`Mock: Added ${qty} × "${product.name}" to cart`)
                }
              >
                Add to Cart
              </button>
            </div>

            {/* Delivery / notes */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-sm font-semibold">Delivery</p>
                <p className="mt-1 text-sm text-gray-600">
                  Choose delivery date at checkout.
                </p>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-sm font-semibold">Message</p>
                <p className="mt-1 text-sm text-gray-600">
                  Add a gift note during checkout.
                </p>
              </div>
            </div>

            {/* Supplier note for cakes (future) */}
            <div className="mt-6 text-xs text-gray-500">
              Future: For made-to-order items (e.g., cakes), the system will
              notify suppliers on order.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
