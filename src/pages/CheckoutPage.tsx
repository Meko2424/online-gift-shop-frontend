// import { useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import { apiPost } from "../lib/api";
// import { useCart } from "../cart/cart";
// import type { OrderOut } from "../types/api";

// function formatMoney(n: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(n);
// }

// const CITY_OPTIONS = ["Addis Ababa", "Lega Tafo", "Sululta", "Hawasa"] as const;

// // ✅ local type (so you don't need OrderCreateIn export yet)
// type OrderCreatePayload = {
//   warehouse_id: number;
//   customer_name: string;
//   customer_phone: string;
//   items: Array<{ product_id: number; qty: number }>;
// };

// export default function CheckoutPage() {
//   const nav = useNavigate();
//   const cart = useCart();

//   // Recipient
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [city, setCity] = useState<(typeof CITY_OPTIONS)[number] | "">("");
//   const [region, setRegion] = useState("");
//   const [phone1, setPhone1] = useState("");
//   const [phone2, setPhone2] = useState("");

//   // Gift note
//   const [giftMessage, setGiftMessage] = useState("");

//   // Ops
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   const subtotal = useMemo(
//     () => cart.items.reduce((sum, it) => sum + it.unit_price * it.qty, 0),
//     [cart.items],
//   );
//   const itemsCount = useMemo(
//     () => cart.items.reduce((n, it) => n + it.qty, 0),
//     [cart.items],
//   );

//   async function handleSaveAndContinue() {
//     setErr(null);

//     if (cart.items.length === 0) {
//       setErr("Your cart is empty.");
//       return;
//     }

//     if (!firstName.trim() || !lastName.trim()) {
//       setErr("Please enter recipient first and last name.");
//       return;
//     }
//     if (!city) {
//       setErr("Please select a city.");
//       return;
//     }
//     if (!region.trim()) {
//       setErr("Please enter a region.");
//       return;
//     }
//     if (!phone1.trim()) {
//       setErr("Please enter a phone number.");
//       return;
//     }

//     // Save extra fields locally for now
//     try {
//       localStorage.setItem(
//         "bg_checkout_meta",
//         JSON.stringify({
//           firstName,
//           lastName,
//           city,
//           region,
//           phone1,
//           phone2,
//           giftMessage,
//         }),
//       );
//     } catch {
//       // ignore
//     }

//     // ✅ for now: one warehouse
//     const WAREHOUSE_ID = 3;

//     const payload: OrderCreatePayload = {
//       warehouse_id: WAREHOUSE_ID,
//       customer_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
//       customer_phone: phone1.trim(),
//       items: cart.items.map((it) => ({
//         product_id: it.product_id,
//         qty: it.qty,
//       })),
//     };

//     setLoading(true);

//     try {
//       const res = await apiPost<{ order: OrderOut }>("/api/orders", payload);
//       cart.clear();
//       nav(`/checkout/payment/${res.order.id}`);
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to place order");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <main className="bg-gray-50">
//       <div className="mx-auto max-w-7xl px-4 py-10">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
//           <Link to="/cart" className="text-sm underline underline-offset-4">
//             Back to cart
//           </Link>
//         </div>

//         <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
//           <div className="rounded-3xl border bg-white p-6 shadow-sm">
//             <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//               <section>
//                 <h2 className="text-lg font-semibold">Recipient Information</h2>
//                 <p className="mt-1 text-sm text-gray-600">
//                   Enter who should receive the gift.
//                 </p>

//                 <div className="mt-5 grid grid-cols-1 gap-4">
//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <label className="text-sm">
//                       <span className="font-medium">First Name</span>
//                       <input
//                         className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
//                         value={firstName}
//                         onChange={(e) => setFirstName(e.target.value)}
//                       />
//                     </label>
//                     <label className="text-sm">
//                       <span className="font-medium">Last Name</span>
//                       <input
//                         className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
//                         value={lastName}
//                         onChange={(e) => setLastName(e.target.value)}
//                       />
//                     </label>
//                   </div>

//                   <label className="text-sm">
//                     <span className="font-medium">City</span>
//                     <select
//                       className="mt-1 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
//                       value={city}
//                       onChange={(e) => setCity(e.target.value as any)}
//                     >
//                       <option value="">Select city…</option>
//                       {CITY_OPTIONS.map((c) => (
//                         <option key={c} value={c}>
//                           {c}
//                         </option>
//                       ))}
//                     </select>
//                   </label>

//                   <label className="text-sm">
//                     <span className="font-medium">Region</span>
//                     <input
//                       className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
//                       value={region}
//                       onChange={(e) => setRegion(e.target.value)}
//                     />
//                   </label>

//                   <label className="text-sm">
//                     <span className="font-medium">Phone Number</span>
//                     <input
//                       className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
//                       value={phone1}
//                       onChange={(e) => setPhone1(e.target.value)}
//                     />
//                   </label>

//                   <label className="text-sm">
//                     <span className="font-medium">Second Phone Number</span>
//                     <input
//                       className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
//                       value={phone2}
//                       onChange={(e) => setPhone2(e.target.value)}
//                       placeholder="Optional"
//                     />
//                   </label>
//                 </div>
//               </section>

//               <section>
//                 <h2 className="text-lg font-semibold">Gift Message</h2>
//                 <p className="mt-1 text-sm text-gray-600">
//                   Add a note to be included with the gift.
//                 </p>

//                 <textarea
//                   className="mt-5 h-[260px] w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
//                   value={giftMessage}
//                   onChange={(e) => setGiftMessage(e.target.value)}
//                   placeholder="Write your message here…"
//                 />
//                 <p className="mt-2 text-xs text-gray-500">
//                   Saved locally for now.
//                 </p>
//               </section>
//             </div>

//             {err ? (
//               <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//                 {err}
//               </div>
//             ) : null}

//             <div className="mt-6">
//               <button
//                 type="button"
//                 onClick={handleSaveAndContinue}
//                 disabled={loading}
//                 className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
//               >
//                 {loading ? "Placing order…" : "SAVE AND CONTINUE"}
//               </button>
//             </div>
//           </div>

//           <aside className="rounded-3xl border bg-white p-6 shadow-sm">
//             <h2 className="text-lg font-semibold">Order Summary</h2>
//             <p className="mt-1 text-sm text-gray-600">{itemsCount} item(s)</p>

//             <div className="mt-5 space-y-4">
//               {cart.items.map((it) => (
//                 <div key={it.product_id} className="flex items-start gap-3">
//                   <div className="h-14 w-14 overflow-hidden rounded-2xl bg-gray-50">
//                     {it.image_url ? (
//                       <img
//                         src={it.image_url}
//                         alt={it.name}
//                         className="h-full w-full object-cover"
//                       />
//                     ) : null}
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="truncate text-sm font-semibold">{it.name}</p>
//                     <p className="mt-1 text-xs text-gray-600">
//                       Qty: {it.qty}
//                       {it.delivery_date
//                         ? ` · Delivery: ${it.delivery_date}`
//                         : ""}
//                     </p>
//                   </div>
//                   <div className="text-sm font-semibold">
//                     {formatMoney(it.unit_price * it.qty)}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6 border-t pt-4">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-semibold">{formatMoney(subtotal)}</span>
//               </div>
//               <p className="mt-2 text-xs text-gray-500">
//                 Taxes/fees and delivery options will be added later.
//               </p>
//             </div>
//           </aside>
//         </div>
//       </div>
//     </main>
//   );
// }

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../cart/cart";

function formatMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

const CITY_OPTIONS = ["Addis Ababa", "Lega Tafo", "Sululta", "Hawasa"] as const;

export default function CheckoutPage() {
  const nav = useNavigate();
  const cart = useCart();

  // Recipient
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState<(typeof CITY_OPTIONS)[number] | "">("");
  const [region, setRegion] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");

  // Gift note
  const [giftMessage, setGiftMessage] = useState("");

  // Ops
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

  async function handleSaveAndContinue() {
    setErr(null);

    if (cart.items.length === 0) {
      setErr("Your cart is empty.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setErr("Please enter recipient first and last name.");
      return;
    }
    if (!city) {
      setErr("Please select a city.");
      return;
    }
    if (!region.trim()) {
      setErr("Please enter a region.");
      return;
    }
    if (!phone1.trim()) {
      setErr("Please enter a phone number.");
      return;
    }

    // Save checkout meta for Payment step (and later backend support)
    try {
      localStorage.setItem(
        "bg_checkout_meta",
        JSON.stringify({
          firstName,
          lastName,
          city,
          region,
          phone1,
          phone2,
          giftMessage,
        }),
      );
    } catch {
      // ignore
    }

    setLoading(true);
    try {
      // ✅ Next step: payment page
      nav("/checkout/payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
          <Link to="/cart" className="text-sm underline underline-offset-4">
            Back to cart
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section>
                <h2 className="text-lg font-semibold">Recipient Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Enter who should receive the gift.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="text-sm">
                      <span className="font-medium">First Name</span>
                      <input
                        className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </label>
                    <label className="text-sm">
                      <span className="font-medium">Last Name</span>
                      <input
                        className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </label>
                  </div>

                  <label className="text-sm">
                    <span className="font-medium">City</span>
                    <select
                      className="mt-1 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                      value={city}
                      onChange={(e) => setCity(e.target.value as any)}
                    >
                      <option value="">Select city…</option>
                      {CITY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm">
                    <span className="font-medium">Region</span>
                    <input
                      className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                  </label>

                  <label className="text-sm">
                    <span className="font-medium">Phone Number</span>
                    <input
                      className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value)}
                    />
                  </label>

                  <label className="text-sm">
                    <span className="font-medium">Second Phone Number</span>
                    <input
                      className="mt-1 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                      placeholder="Optional"
                    />
                  </label>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold">Gift Message</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Add a note to be included with the gift.
                </p>

                <textarea
                  className="mt-5 h-[260px] w-full resize-none rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Write your message here…"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Saved locally for now.
                </p>
              </section>
            </div>

            {err ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            <div className="mt-6">
              <button
                type="button"
                onClick={handleSaveAndContinue}
                disabled={loading}
                className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
              >
                {loading ? "Saving…" : "SAVE AND CONTINUE"}
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
                      src={
                        it.image_url ||
                        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={it.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src =
                          "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80";
                      }}
                    />
                  </div>
                  {/* <div className="h-14 w-14 overflow-hidden rounded-2xl bg-gray-50">
                    {it.image_url ? (
                      <img
                        src={
                          it.image_url ||
                          "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80"
                        }
                        alt={it.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : null}
                  </div> */}
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
                Taxes/fees and delivery options will be added later.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
