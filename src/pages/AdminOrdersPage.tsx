import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPost } from "../lib/api";
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

type OrderStatusFilter =
  | ""
  | "PENDING"
  | "PAID"
  | "FULFILLING"
  | "COMPLETED"
  | "CANCELLED";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<OrderStatusFilter>("");
  const [phone, setPhone] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (phone.trim()) params.set("phone", phone.trim());
    params.set("limit", "100");
    return params.toString();
  }, [status, phone]);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<OrderOut[]>(`/api/orders?${query}`);
      setOrders(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, [query]);

  async function handleComplete(orderId: number) {
    setActionLoadingId(orderId);
    try {
      await apiPost(`/api/orders/${orderId}/complete`, {});
      await loadOrders();
    } catch (e: any) {
      setError(e?.message ?? "Failed to complete order");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleCancel(orderId: number) {
    setActionLoadingId(orderId);
    try {
      await apiPost(`/api/orders/${orderId}/cancel`, {});
      await loadOrders();
    } catch (e: any) {
      setError(e?.message ?? "Failed to cancel order");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Admin Orders
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Monitor, complete, and cancel orders.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatusFilter)}
              className="rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="FULFILLING">FULFILLING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Search by phone"
              className="rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">Loading orders…</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">No orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Order #{order.id}
                      </h2>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>
                        Customer:{" "}
                        <span className="font-semibold text-gray-900">
                          {order.customer_name ?? "—"}
                        </span>
                      </p>
                      <p>
                        Phone:{" "}
                        <span className="font-semibold text-gray-900">
                          {order.customer_phone ?? "—"}
                        </span>
                      </p>
                      <p>
                        Placed:{" "}
                        <span className="font-semibold text-gray-900">
                          {new Date(order.created_at).toLocaleString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </p>
                      {order.gift_message ? (
                        <p className="max-w-2xl">
                          Gift message:{" "}
                          <span className="text-gray-900">
                            {order.gift_message}
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatMoney(order.total_amount)}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId((prev) =>
                            prev === order.id ? null : order.id,
                          )
                        }
                        className="rounded-full border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                      >
                        {expandedId === order.id
                          ? "Hide Details"
                          : "View Details"}
                      </button>

                      <Link
                        to={`/order-success/${order.id}`}
                        className="rounded-full border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                      >
                        Open Customer View
                      </Link>

                      {order.status !== "COMPLETED" &&
                      order.status !== "CANCELLED" ? (
                        <button
                          type="button"
                          onClick={() => handleComplete(order.id)}
                          disabled={actionLoadingId === order.id}
                          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                        >
                          {actionLoadingId === order.id
                            ? "Working..."
                            : "Mark Completed"}
                        </button>
                      ) : null}

                      {order.status !== "COMPLETED" &&
                      order.status !== "CANCELLED" ? (
                        <button
                          type="button"
                          onClick={() => handleCancel(order.id)}
                          disabled={actionLoadingId === order.id}
                          className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                        >
                          Cancel Order
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {expandedId === order.id ? (
                  <div className="mt-6 rounded-2xl border bg-gray-50 p-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Items
                    </h3>

                    <div className="mt-4 space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 rounded-2xl bg-white p-3"
                        >
                          <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-50 flex-shrink-0">
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
                              {String(item.product_type).toUpperCase()} •{" "}
                              {item.fulfillment_type}
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
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
