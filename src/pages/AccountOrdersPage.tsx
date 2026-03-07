import { useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";
import type { OrderOut } from "../types/api";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function StatusBadge({ status }: { status: OrderOut["status"] }) {
  const cls =
    status === "COMPLETED"
      ? "bg-green-50 text-green-700 border-green-200"
      : status === "FULFILLING"
        ? "bg-amber-50 text-amber-800 border-amber-200"
        : status === "PAID"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : status === "CANCELLED"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80";

export default function AccountOrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiGet<OrderOut[]>(
        `/api/orders/history?phone=${encodeURIComponent(phone.trim())}`,
      );
      setOrders(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-gray-900">
            Order History
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your phone number to view previous orders.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex flex-col gap-3 sm:flex-row"
          >
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="flex-1 rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {!loading && !error && orders.length === 0 ? (
            <div className="mt-8 text-sm text-gray-500">No orders yet.</div>
          ) : null}

          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border bg-gray-50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h2>
                      <StatusBadge status={order.status} />
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      Placed on{" "}
                      {new Date(order.created_at).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {order.gift_message ? (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        Gift message: {order.gift_message}
                      </p>
                    ) : null}
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatMoney(order.total_amount)}
                    </p>
                    <Link
                      to={`/order-success/${order.id}`}
                      className="mt-3 inline-block text-sm font-semibold underline underline-offset-4"
                    >
                      View Order
                    </Link>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl bg-white p-3"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-xl bg-gray-50 flex-shrink-0">
                        <img
                          src={item.image_url || FALLBACK_IMG}
                          alt={item.product_name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.onerror = null;
                            img.src = FALLBACK_IMG;
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          Qty: {item.qty}
                          {item.delivery_date
                            ? ` · Delivery: ${item.delivery_date}`
                            : ""}
                        </p>
                      </div>

                      <div className="text-sm font-semibold text-gray-900">
                        {formatMoney(item.unit_price * item.qty)}
                      </div>
                    </div>
                  ))}

                  {order.items.length > 3 ? (
                    <p className="text-xs text-gray-500">
                      +{order.items.length - 3} more item(s)
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
