import { useParams, Link } from "react-router-dom";

export default function OrderSuccessPage() {
  const { orderId } = useParams();

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-gray-900">
          Order Successful!
        </h1>
        <p className="mt-4 text-gray-600">
          Your order #{orderId} has been placed successfully.
        </p>

        <Link
          to="/"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
