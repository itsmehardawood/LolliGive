"use client";

import { useState } from "react";

export default function BankInfoForm() {
  const [formData, setFormData] = useState({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    iban: "",
    swiftCode: "",
    branchAddress: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); // Replace form with preview
  };

  return (
    <section className="min-h-screen text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl font-bold mb-4">Bank Deposit & Withdrawal Info</h2>

        {/* Instructions */}
        {!submitted && (
          <p className="text-gray-300 mb-6">
            Please provide your bank account details below. These details are required
            for deposits and withdrawals. Make sure the information is accurate to
            avoid delays in transactions.
          </p>
        )}

        {/* Show Form if not submitted */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-5"
          >
            <div>
              <label className="block text-sm mb-2">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g. Bank of America"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Account Holder Name</label>
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="e.g. 1234567890"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">IBAN</label>
              <input
                type="text"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="e.g. PK36SCBL0000001123456702"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">SWIFT Code</label>
              <input
                type="text"
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleChange}
                placeholder="e.g. SCBLUS33"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Branch Address</label>
              <textarea
                name="branchAddress"
                value={formData.branchAddress}
                onChange={handleChange}
                rows="2"
                placeholder="e.g. 123 Main Street, New York, NY, USA"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg font-semibold"
            >
              Save Bank Details
            </button>
          </form>
        ) : (
          // Show Preview once submitted
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Saved Bank Details</h3>
            <p><span className="font-semibold">Bank Name:</span> {formData.bankName}</p>
            <p><span className="font-semibold">Account Holder:</span> {formData.accountHolder}</p>
            <p><span className="font-semibold">Account Number:</span> {formData.accountNumber}</p>
            <p><span className="font-semibold">IBAN:</span> {formData.iban || "N/A"}</p>
            <p><span className="font-semibold">SWIFT Code:</span> {formData.swiftCode || "N/A"}</p>
            <p><span className="font-semibold">Branch Address:</span> {formData.branchAddress || "N/A"}</p>
          </div>
        )}
      </div>
    </section>
  );
}
