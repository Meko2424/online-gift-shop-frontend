import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet, apiPost } from "../lib/api";

type SupplierJobStatus = "REQUESTED" | "READY" | "PICKED_UP" | "CANCELLED";

type SupplierJobOut = {
  id: number;
  supplier_id: number;
  order_id: number;
  order_item_id: number;
  product_id: number;
  qty: number;
  status: SupplierJobStatus;
  note: string | null;
};

function StatusBadge({ status }: { status: SupplierJobStatus }) {
  const cls =
    status === "READY"
      ? "bg-green-50 text-green-700 border-green-200"
      : status === "PICKED_UP"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : status === "CANCELLED"
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-amber-50 text-amber-800 border-amber-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {status}
    </span>
  );
}

type JobStatusFilter = "" | "REQUESTED" | "READY" | "PICKED_UP" | "CANCELLED";

export default function AdminFulfillmentPage() {
  const [jobs, setJobs] = useState<SupplierJobOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<JobStatusFilter>("");
  const [orderId, setOrderId] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (orderId.trim()) params.set("order_id", orderId.trim());
    params.set("limit", "100");
    return params.toString();
  }, [status, orderId]);

  async function loadJobs() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet<SupplierJobOut[]>(
        `/api/supplier-jobs?${query}`,
      );
      setJobs(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load supplier jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, [query]);

  async function updateStatus(jobId: number, nextStatus: SupplierJobStatus) {
    setActionLoadingId(jobId);
    setError(null);
    try {
      await apiPost(
        `/api/supplier-jobs/${jobId}/status?status=${encodeURIComponent(nextStatus)}`,
        {},
      );
      await loadJobs();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update supplier job");
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
              Supplier / Fulfillment
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Track made-to-order supplier jobs and move them through the
              workflow.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as JobStatusFilter)}
              className="rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">All statuses</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="READY">READY</option>
              <option value="PICKED_UP">PICKED_UP</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Filter by order id"
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
              <p className="text-sm text-gray-600">Loading supplier jobs…</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <p className="text-sm text-gray-600">No supplier jobs found.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-3xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Supplier Job #{job.id}
                      </h2>
                      <StatusBadge status={job.status} />
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p>
                        Order:{" "}
                        <span className="font-semibold text-gray-900">
                          #{job.order_id}
                        </span>
                      </p>
                      <p>
                        Product ID:{" "}
                        <span className="font-semibold text-gray-900">
                          {job.product_id}
                        </span>
                      </p>
                      <p>
                        Qty:{" "}
                        <span className="font-semibold text-gray-900">
                          {job.qty}
                        </span>
                      </p>
                      <p>
                        Supplier ID:{" "}
                        <span className="font-semibold text-gray-900">
                          {job.supplier_id}
                        </span>
                      </p>
                      {job.note ? (
                        <p className="max-w-2xl">
                          Note:{" "}
                          <span className="text-gray-900">{job.note}</span>
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/order-success/${job.order_id}`}
                      className="rounded-full border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                    >
                      Open Order
                    </Link>

                    {job.status === "REQUESTED" ? (
                      <button
                        type="button"
                        onClick={() => updateStatus(job.id, "READY")}
                        disabled={actionLoadingId === job.id}
                        className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                      >
                        {actionLoadingId === job.id
                          ? "Working..."
                          : "Mark Ready"}
                      </button>
                    ) : null}

                    {job.status === "READY" ? (
                      <button
                        type="button"
                        onClick={() => updateStatus(job.id, "PICKED_UP")}
                        disabled={actionLoadingId === job.id}
                        className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                      >
                        {actionLoadingId === job.id
                          ? "Working..."
                          : "Mark Picked Up"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
