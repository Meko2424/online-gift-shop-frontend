import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPost } from "../lib/api";

type PurchaseOrderStatus = "CREATED" | "SUBMITTED" | "RECEIVED" | "CANCELLED";

type PurchaseOrderLineOut = {
  id: number;
  product_id: number;
  qty: number;
  unit_cost: number;
  line_total: number;
};

type PurchaseOrderOut = {
  id: number;
  supplier_id: number;
  supplier_job_id: number | null;
  status: PurchaseOrderStatus;
  note: string | null;
  created_at: string;
  lines: PurchaseOrderLineOut[];
};

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function StatusBadge({ status }: { status: PurchaseOrderStatus }) {
  const cls =
    status === "RECEIVED"
      ? "bg-green-50 text-green-700 border-green-200"
      : status === "SUBMITTED"
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

type POStatusFilter = "" | "CREATED" | "SUBMITTED" | "RECEIVED" | "CANCELLED";

export default function AdminPurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<POStatusFilter>("");
  const [supplierJobId, setSupplierJobId] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (supplierJobId.trim())
      params.set("supplier_job_id", supplierJobId.trim());
    params.set("limit", "100");
    return params.toString();
  }, [status, supplierJobId]);

  async function loadPurchaseOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<PurchaseOrderOut[]>(
        `/api/purchase-orders?${query}`,
      );
      setPurchaseOrders(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPurchaseOrders();
  }, [query]);

  async function handleSubmit(poId: number) {
    setActionLoadingId(poId);
    setError(null);
    try {
      await apiPost(`/api/purchase-orders/${poId}/submit`, {});
      await loadPurchaseOrders();
    } catch (e: any) {
      setError(e?.message ?? "Failed to submit purchase order");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleReceive(poId: number) {
    setActionLoadingId(poId);
    setError(null);
    try {
      await apiPost(`/api/purchase-orders/${poId}/receive`, {});
      await loadPurchaseOrders();
    } catch (e: any) {
      setError(e?.message ?? "Failed to receive purchase order");
    } finally {
      setActionLoadingId(null);
    }
  }

  function getTotal(po: PurchaseOrderOut) {
    return po.lines.reduce((sum, line) => sum + line.line_total, 0);
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Purchase Orders
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Track procurement flow from created to received.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as POStatusFilter)}
              className="rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All statuses</option>
              <option value="CREATED">CREATED</option>
              <option value="SUBMITTED">SUBMITTED</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <input
              value={supplierJobId}
              onChange={(e) => setSupplierJobId(e.target.value)}
              placeholder="Filter by supplier job id"
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
              <p className="text-sm text-gray-600">Loading purchase orders…</p>
            </div>
          ) : purchaseOrders.length === 0 ? (
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">No purchase orders found.</p>
            </div>
          ) : (
            purchaseOrders.map((po) => (
              <div
                key={po.id}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Purchase Order #{po.id}
                      </h2>
                      <StatusBadge status={po.status} />
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>
                        Supplier ID:{" "}
                        <span className="font-semibold text-gray-900">
                          {po.supplier_id}
                        </span>
                      </p>

                      {po.supplier_job_id !== null ? (
                        <p>
                          Supplier Job ID:{" "}
                          <span className="font-semibold text-gray-900">
                            {po.supplier_job_id}
                          </span>
                        </p>
                      ) : null}

                      <p>
                        Created:{" "}
                        <span className="font-semibold text-gray-900">
                          {new Date(po.created_at).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>

                      {po.note ? (
                        <p className="max-w-2xl">
                          Note: <span className="text-gray-900">{po.note}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatMoney(getTotal(po))}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId((prev) =>
                            prev === po.id ? null : po.id,
                          )
                        }
                        className="rounded-full border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                      >
                        {expandedId === po.id ? "Hide Details" : "View Details"}
                      </button>

                      {po.supplier_job_id !== null ? (
                        <Link
                          to={`/admin/fulfillment`}
                          className="rounded-full border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                        >
                          Open Fulfillment
                        </Link>
                      ) : null}

                      {po.status === "CREATED" ? (
                        <button
                          type="button"
                          onClick={() => handleSubmit(po.id)}
                          disabled={actionLoadingId === po.id}
                          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                        >
                          {actionLoadingId === po.id
                            ? "Working..."
                            : "Mark Submitted"}
                        </button>
                      ) : null}

                      {po.status === "SUBMITTED" ? (
                        <button
                          type="button"
                          onClick={() => handleReceive(po.id)}
                          disabled={actionLoadingId === po.id}
                          className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                        >
                          {actionLoadingId === po.id
                            ? "Working..."
                            : "Mark Received"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                {expandedId === po.id ? (
                  <div className="mt-6 rounded-2xl border bg-gray-50 p-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Lines
                    </h3>

                    <div className="mt-4 space-y-3">
                      {po.lines.map((line) => (
                        <div
                          key={line.id}
                          className="flex items-center justify-between rounded-2xl bg-white p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              Product ID: {line.product_id}
                            </p>
                            <p className="mt-1 text-xs text-gray-600">
                              Qty: {line.qty} · Unit Cost:{" "}
                              {formatMoney(line.unit_cost)}
                            </p>
                          </div>

                          <div className="text-sm font-semibold text-gray-900">
                            {formatMoney(line.line_total)}
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
