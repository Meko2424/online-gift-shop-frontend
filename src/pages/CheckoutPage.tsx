import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/cart";
import { apiPost } from "../lib/api";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export default function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [warehouseId, setWarehouseId] = useState(3); // default warehouse
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!cart.items.length) {
    return (
      <main className="bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        </div>
      </main>
    );
  }

  async function handleCheckout() {
    if (!customerName || !customerPhone) {
      setError("Please enter your name and phone.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1 Create Order
      const order = await apiPost<any>("/api/orders", {
        warehouse_id: warehouseId,
        customer_name: customerName,
        customer_phone: customerPhone,
        items: cart.items.map((it) => ({
          product_id: it.product_id,
          qty: it.qty,
        })),
      });

      // 2 Mark as PAID
      await apiPost(`/api/orders/${order.order.id}/mark-paid`, {});

      // 3 Clear cart
      cart.clear();

      // 4 Redirect
      navigate(`/order-success/${order.order.id}`);
    } catch (e: any) {
      setError(e.message ?? "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10 grid lg:grid-cols-[1fr_380px] gap-8">
        {/* Left */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Checkout</h1>

          <div className="mt-6 space-y-4">
            <input
              placeholder="Full name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-full border px-4 py-3 text-sm focus:ring-2 focus:ring-black"
            />
            <input
              placeholder="Phone number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-full border px-4 py-3 text-sm focus:ring-2 focus:ring-black"
            />

            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(Number(e.target.value))}
              className="w-full rounded-full border px-4 py-3 text-sm"
            >
              <option value={3}>Main Warehouse</option>
            </select>
          </div>

          {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
        </div>

        {/* Right */}
        <aside className="rounded-2xl border bg-white p-6 shadow-sm h-fit">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="mt-4 space-y-2">
            {cart.items.map((it) => (
              <div key={it.product_id} className="flex justify-between text-sm">
                <span>
                  {it.name} × {it.qty}
                </span>
                <span>{formatMoney(it.unit_price * it.qty)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatMoney(cart.subtotal)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </aside>
      </div>
    </main>
  );
}
