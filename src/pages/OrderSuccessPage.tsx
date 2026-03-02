import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGet } from "../lib/api";
import type { OrderOut } from "../types/api";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<OrderOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const idNum = useMemo(() => Number(orderId), [orderId]);

  useEffect(() => {
    if (!orderId || !Number.isFinite(idNum)) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiGet<OrderOut>(`/api/orders/${orderId}`)
      .then((data) => {
        if (!cancelled) setOrder(data);
      })
      .catch((e: any) => {
        if (!cancelled) setError(e?.message ?? "Failed to load order");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, idNum]);

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-14">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-gray-900">
            🎉 Order placed
          </h1>
          <p className="mt-2 text-gray-600">
            Thanks! Your order has been created successfully.
          </p>

          {loading ? (
            <div className="mt-6 text-sm text-gray-600">
              Loading order details…
            </div>
          ) : error ? (
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-900">
                Couldn’t load order
              </p>
              <p className="mt-2 text-sm text-gray-600">{error}</p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/"
                  className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-900"
                >
                  Continue shopping
                </Link>
                <Link
                  to="/cart"
                  className="rounded-full border bg-white px-5 py-3 text-sm font-semibold hover:bg-gray-50"
                >
                  View cart
                </Link>
              </div>
            </div>
          ) : !order ? (
            <div className="mt-6 text-sm text-gray-600">Order not found.</div>
          ) : (
            <>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-gray-50 p-5">
                  <p className="text-xs font-semibold tracking-[0.2em] text-gray-500">
                    ORDER
                  </p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    #{order.id}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Status: {order.status}
                  </p>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-5">
                  <p className="text-xs font-semibold tracking-[0.2em] text-gray-500">
                    CUSTOMER
                  </p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {order.customer_name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {order.customer_phone}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900">Items</h2>

                <div className="mt-4 divide-y">
                  {order.items.map((it) => (
                    <div
                      key={it.id}
                      className="py-4 flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          Product #{it.product_id}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {it.product_type.toUpperCase()} •{" "}
                          {it.fulfillment_type}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          Qty:{" "}
                          <span className="font-semibold text-gray-900">
                            {it.qty}
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {formatMoney(it.unit_price)} each
                        </p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {formatMoney(it.unit_price * it.qty)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t pt-4">
                  <p className="text-sm font-semibold text-gray-900">Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatMoney(order.total_amount)}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900"
                >
                  Continue shopping
                </Link>
                <Link
                  to={`/account`} // later: customer order history
                  className="rounded-full border bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50"
                >
                  View account
                </Link>
              </div>

              <p className="mt-6 text-xs text-gray-500">
                Next: show supplier jobs (cakes) + fulfillment steps on this
                page.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
