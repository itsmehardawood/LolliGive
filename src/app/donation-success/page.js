"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";

export default function DonationSuccessPage({ paymentDetails }) {
  // Optional: you can pass paymentDetails via state or context
  // If not provided, just show the success message
  const details = paymentDetails || null;

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
            Your generous gift has been received
          </p>

          {/* Payment Details */}
          {details?.amount && (
            <div className="bg-black border border-gray-700 rounded-lg p-6 mb-6 text-left">
              <h2 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-4">
                Payment Details
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-semibold">
                    ${details.amount}
                  </span>
                </div>

                {details.transactionId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="text-white font-mono text-xs">
                      {details.transactionId}
                    </span>
                  </div>
                )}

                {details.approvalCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Approval Code:</span>
                    <span className="text-white font-mono">
                      {details.approvalCode}
                    </span>
                  </div>
                )}

                {details.cardNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Card:</span>
                    <span className="text-white">
                      ****{details.cardNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Impact Message */}
          <div className="bg-red-700/10 border border-red-700/30 rounded-lg p-4 mb-6">
            <p className="text-white text-sm">
              Your donation makes a real difference in our community. A receipt
              has been sent to your email.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Return to Home
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 mt-6">
            If you have any questions about your donation, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}
