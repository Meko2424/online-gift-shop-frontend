import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../lib/api";
import { useCart } from "../cart/cart";
import type { OrderOut } from "../types/api";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80";

type OrderCreatePayload = {
  warehouse_id: number;
  customer_name: string;
  customer_phone: string;
  gift_message?: string | null;
  items: Array<{
    product_id: number;
    qty: number;
    delivery_date?: string | null;
  }>;
};

type MarkPaidResponse = {
  ok: boolean;
  message: string;
  order_id: number;
  status: string;
};

export default function PaymentPage() {
  const nav = useNavigate();
  const cart = useCart();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const subtotal = useMemo(
    () => cart.items.reduce((sum, it) => sum + it.unit_price * it.qty, 0),
    [cart.items],
  );

  const itemsCount = useMemo(
    () => cart.items.reduce((n, it) => n + it.qty, 0),
    [cart.items],
  );

  const checkoutMeta = useMemo(() => {
    try {
      const raw = localStorage.getItem("bg_checkout_meta");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  async function handlePayNow() {
    setErr(null);

    if (cart.items.length === 0) {
      setErr("Your cart is empty.");
      return;
    }

    if (
      !checkoutMeta?.firstName ||
      !checkoutMeta?.lastName ||
      !checkoutMeta?.phone1
    ) {
      setErr(
        "Missing recipient info. Please go back and fill Checkout Details.",
      );
      return;
    }

    const missingDate = cart.items.find((it) => !it.delivery_date);
    if (missingDate) {
      setErr(
        `Missing delivery date for "${missingDate.name}". Please re-add item.`,
      );
      return;
    }

    if (!cardName.trim()) {
      setErr("Please enter name on card.");
      return;
    }
    if (cardNumber.replace(/\s/g, "").length < 12) {
      setErr("Please enter a valid card number.");
      return;
    }
    if (!exp.trim()) {
      setErr("Please enter expiry.");
      return;
    }
    if (cvv.trim().length < 3) {
      setErr("Please enter CVV.");
      return;
    }

    const WAREHOUSE_ID = 3;

    const payload: OrderCreatePayload = {
      warehouse_id: WAREHOUSE_ID,
      customer_name:
        `${checkoutMeta.firstName} ${checkoutMeta.lastName}`.trim(),
      customer_phone: String(checkoutMeta.phone1),
      gift_message: checkoutMeta.giftMessage
        ? String(checkoutMeta.giftMessage)
        : null,
      items: cart.items.map((it) => ({
        product_id: it.product_id,
        qty: it.qty,
        delivery_date: it.delivery_date ?? null,
      })),
    };

    setLoading(true);
    try {
      const created = await apiPost<{ order: OrderOut }>(
        "/api/orders",
        payload,
      );

      const paid = await apiPost<MarkPaidResponse>(
        `/api/orders/${created.order.id}/mark-paid`,
        {},
      );

      cart.clear();
      try {
        localStorage.removeItem("bg_checkout_meta");
      } catch {
        // ignore
      }

      nav(`/order-success/${paid.order_id}`);
    } catch (e: any) {
      setErr(e?.message ?? "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Payment</h1>
          <Link
            to="/checkout/details"
            className="text-sm underline underline-offset-4"
          >
            Back to Checkout Details
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Payment Information</h2>
            <p className="mt-1 text-sm text-gray-600">
              For now, this is a mock payment screen. Later we’ll integrate
              Stripe/Chapa.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <label className="text-sm">
                <span className="font-medium">Name on Card</span>
                <input
                  className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </label>

              <label className="text-sm">
                <span className="font-medium">Card Number</span>
                <input
                  className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                />
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="font-medium">Expiry</span>
                  <input
                    className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                    placeholder="MM/YY"
                  />
                </label>

                <label className="text-sm">
                  <span className="font-medium">CVV</span>
                  <input
                    className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                  />
                </label>
              </div>
            </div>

            {err ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            <div className="mt-6">
              <button
                type="button"
                onClick={handlePayNow}
                disabled={loading}
                className="w-full rounded-full bg-primary-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-80 disabled:opacity-60"
              >
                {loading ? "Processing…" : "PAY NOW"}
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <p className="mt-1 text-sm text-gray-600">{itemsCount} item(s)</p>

            <div className="mt-5 space-y-4">
              {cart.items.map((it) => (
                <div key={it.product_id} className="flex items-start gap-3">
                  <div className="h-14 w-14 overflow-hidden rounded-2xl bg-gray-50 flex-shrink-0">
                    <img
                      src={it.image_url || FALLBACK_IMG}
                      alt={it.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = FALLBACK_IMG;
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{it.name}</p>
                    <p className="mt-1 text-xs text-gray-600">
                      Qty: {it.qty}
                      {it.delivery_date
                        ? ` · Delivery: ${it.delivery_date}`
                        : ""}
                    </p>
                  </div>

                  <div className="text-sm font-semibold">
                    {formatMoney(it.unit_price * it.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatMoney(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Taxes/fees and delivery will be added later.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
