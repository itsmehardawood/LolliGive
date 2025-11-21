import Link from "next/link";

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-zinc-900 border border-gray-700 rounded-2xl shadow-2xl p-8 text-center">
          
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl font-bold text-white mb-2">Thank You!</h1>
          <p className="text-lg text-gray-300 mb-6">
            Your generous giving has been received
          </p>

          {/* Impact Message */}
          <div className="bg-red-700/10 border border-red-700/30 rounded-lg p-4 mb-6">
            <p className="text-white text-sm">
              Your donation makes a real difference in our community. A receipt
              has been sent to your email.
            </p>
          </div>

          {/* Action Button */}
          <Link
            href="/"
            className="block w-full bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Return to Home
          </Link>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-6">
            If you have any questions about your donation, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
