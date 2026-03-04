import { Link } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { useCart } from "../cart/cart";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const cart = useCart();

  // show total quantity like (2)
  const itemsCount = cart.items.reduce((n, it) => n + it.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[60] h-full w-[min(420px,100vw)] bg-white shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">
            Your Cart{" "}
            <span className="font-normal text-gray-500">({itemsCount})</span>
          </h2>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close cart drawer"
          >
            <span className="text-sm text-gray-700">Close</span>
            <X size={18} />
          </button>
        </div>

        <div className="h-[calc(100%-220px)] overflow-auto px-5 py-4">
          {cart.items.length === 0 ? (
            <p className="text-sm text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="divide-y">
              {cart.items.map((it) => (
                <div key={it.key ?? it.product_id} className="py-4">
                  <div className="flex gap-3">
                    <img
                      src={
                        it.image_url ||
                        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={it.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      {/* name + trash on same row */}
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {it.name}
                        </p>

                        <button
                          type="button"
                          className="shrink-0 rounded-full p-2 hover:bg-gray-100"
                          aria-label={`Remove ${it.name}`}
                          onClick={() => cart.removeItem(it.product_id)}
                          // onClick={() =>
                          //   cart.removeItem(it.key ?? String(it.product_id))
                          // }
                        >
                          <Trash2 size={16} className="text-gray-600" />
                        </button>
                      </div>

                      {/* qty left, total price right */}
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-600">Qty: {it.qty}</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatMoney(it.unit_price * it.qty)}
                        </p>
                      </div>

                      {it.delivery_date ? (
                        <p className="mt-1 text-xs text-gray-500">
                          Delivery: {it.delivery_date}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-semibold">
              {formatMoney(cart.subtotal)}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
            >
              Continue Shopping
            </button>

            {/* NEW: checkout button right under Continue Shopping */}
            <Link
              // to="/checkout/details"
              to="/checkout"
              onClick={onClose}
              className="text-center rounded-full bg-primary-brand px-5 py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-60"
            >
              Checkout
            </Link>

            {/* keep View Cart as an option */}
            <Link
              to="/cart"
              onClick={onClose}
              className="text-center rounded-full border bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
            >
              View Cart
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
