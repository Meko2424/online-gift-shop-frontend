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

function StatusBadge({ status }: { status: string }) {
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
                  <div className="mt-2">
                    <StatusBadge status={order.status} />
                  </div>
                  {order.warehouse_id !== null ? (
                    <p className="mt-2 text-sm text-gray-600">
                      Warehouse: {order.warehouse_id}
                    </p>
                  ) : null}
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
                  <p className="mt-2 text-xs text-gray-500">
                    Placed at:{" "}
                    {new Date(order.created_at).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border p-6">
                <h2 className="text-lg font-semibold text-gray-900">Items</h2>

                <div className="mt-4 divide-y">
                  {order.items.map((it) => {
                    const lineRevenue = it.unit_price * it.qty;
                    const cogs = it.cogs_total ?? null;
                    const profit = cogs !== null ? lineRevenue - cogs : null;
                    const margin =
                      profit !== null && lineRevenue > 0
                        ? (profit / lineRevenue) * 100
                        : null;

                    return (
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
                            {formatMoney(lineRevenue)}
                          </p>

                          {it.cogs_total !== null ? (
                            <>
                              <p className="mt-2 text-xs text-gray-600">
                                COGS:{" "}
                                <span className="font-semibold text-gray-900">
                                  {formatMoney(it.cogs_total)}
                                </span>
                              </p>
                              <p className="mt-1 text-xs text-gray-600">
                                Profit:{" "}
                                <span className="font-semibold text-gray-900">
                                  {formatMoney(lineRevenue - it.cogs_total)}
                                </span>
                                {margin !== null ? (
                                  <span className="text-gray-500">
                                    {" "}
                                    ({margin.toFixed(1)}%)
                                  </span>
                                ) : null}
                              </p>
                            </>
                          ) : (
                            <p className="mt-2 text-xs text-gray-500">
                              COGS will appear after cost snapshots are
                              recorded.
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
                  to="/account"
                  className="rounded-full border bg-white px-6 py-3 text-sm font-semibold hover:bg-gray-50"
                >
                  View account
                </Link>
              </div>

              <p className="mt-6 text-xs text-gray-500">
                Next: include product name/slug in OrderItemOut so we can show
                real item names here instead of Product #id.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
