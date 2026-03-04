import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutDetailsPage() {
  const nav = useNavigate();

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  function saveAndContinue() {
    // store locally for now; later we can keep in CheckoutContext
    localStorage.setItem(
      "checkout_details",
      JSON.stringify({
        recipientName,
        recipientPhone,
        recipientAddress,
        giftMessage,
      }),
    );

    nav("/checkout"); // your existing checkout page (order placement)
  }

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
        <p className="mt-2 text-gray-600">Recipient details & gift message</p>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Recipient */}
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold">Recipient Information</h2>

            <div className="mt-6 space-y-4">
              <input
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                placeholder="Recipient name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
              <input
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                placeholder="Recipient phone"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
              />
              <textarea
                className="w-full min-h-[120px] rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                placeholder="Delivery address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Right: Gift message */}
          <div className="rounded-3xl border bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold">Gift Message</h2>
            <p className="mt-2 text-sm text-gray-600">
              This will be included with the delivery.
            </p>

            <textarea
              className="mt-6 w-full min-h-[220px] rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
              placeholder="Write your message..."
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={saveAndContinue}
            className="w-full rounded-full bg-black px-6 py-4 text-sm font-semibold text-white hover:bg-gray-900"
            type="button"
          >
            SAVE AND CONTINUE
          </button>
        </div>
      </div>
    </main>
  );
}
