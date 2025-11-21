// app/success/page.js
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
      <p className="text-lg mb-8 text-center">
        We appreciate your generosity. Your contribution makes a difference.
      </p>
      <Link
        href="/"
        className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
      >
        Back to Giving
      </Link>
    </div>
  );
}
