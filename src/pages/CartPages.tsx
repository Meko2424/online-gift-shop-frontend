import { Link } from "react-router-dom";
import { useCart } from "../cart/cart";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function CartPage() {
  const cart = useCart();

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Cart
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Review your items before checkout.
            </p>
          </div>
          {cart.items.length ? (
            <button
              type="button"
              className="text-sm font-semibold underline underline-offset-4 text-gray-700 hover:text-black"
              onClick={cart.clear}
            >
              Clear cart
            </button>
          ) : null}
        </div>

        {!cart.items.length ? (
          <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-700">Your cart is empty.</p>
            <Link
              className="mt-4 inline-block rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900"
              to="/"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {cart.items.map((it) => (
                <div
                  key={it.product_id}
                  className="rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-50 p-2">
                      <img
                        src={
                          it.image_url ||
                          "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={it.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        to={`/p/${it.slug}`}
                        className="font-semibold text-gray-900 hover:underline"
                      >
                        {it.name}
                      </Link>
                      <div className="mt-1 text-sm text-gray-600">
                        {formatMoney(it.unit_price)} each
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center rounded-full border bg-white px-3 py-2">
                          <button
                            type="button"
                            className="h-9 w-9 rounded-full hover:bg-gray-50"
                            onClick={() =>
                              cart.setQty(
                                it.product_id,
                                Math.max(1, it.qty - 1),
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <div className="w-12 text-center font-semibold">
                            {it.qty}
                          </div>
                          <button
                            type="button"
                            className="h-9 w-9 rounded-full hover:bg-gray-50"
                            onClick={() =>
                              cart.setQty(it.product_id, it.qty + 1)
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          className="text-sm font-semibold text-gray-700 hover:text-black underline underline-offset-4"
                          onClick={() => cart.removeItem(it.product_id)}
                        >
                          Remove
                        </button>

                        <div className="ml-auto text-sm font-semibold text-gray-900">
                          {formatMoney(it.unit_price * it.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Order summary
              </h2>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {formatMoney(cart.subtotal)}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-600">Calculated at checkout</span>
              </div>

              <div className="mt-4 border-t pt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatMoney(cart.subtotal)}
                </span>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900"
                onClick={() =>
                  alert("Next step: Checkout flow (create order + pay)")
                }
              >
                Checkout
              </button>

              <Link
                to="/"
                className="mt-4 block text-center text-sm font-semibold underline underline-offset-4 text-gray-700 hover:text-black"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
