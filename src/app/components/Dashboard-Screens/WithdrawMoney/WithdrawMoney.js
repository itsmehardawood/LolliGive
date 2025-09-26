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
    setSubmitted(true);
  };

  const handleWithdrawMoney = () => {
    alert("Withdraw Money functionality to be implemented.");
  };

  return (
    <section className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">
            Bank Deposit & Withdrawal
          </h2>
          <p className="mt-2 text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Provide your bank account details to enable deposits and withdrawals.  
            Ensure that the information is correct to avoid transaction delays.
          </p>
        </div>

        {/* Form (before submission) */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 rounded-xl border border-gray-700 shadow-md p-6 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Bank Name
              </label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="e.g. Bank of America"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Account Holder Name
              </label>
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Account Number
              </label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="e.g. 1234567890"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                IBAN
              </label>
              <input
                type="text"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                placeholder="e.g. PK36SCBL0000001123456702"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Branch Address
              </label>
              <textarea
                name="branchAddress"
                value={formData.branchAddress}
                onChange={handleChange}
                rows="2"
                placeholder="e.g. 123 Main Street, New York, NY, USA"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <>
            {/* Preview Card */}
            <div className="bg-gray-900 rounded-xl border border-gray-700 shadow-md p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-white">
                Saved Bank Details
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="font-semibold text-white">Bank Name:</span>{" "}
                  {formData.bankName}
                </p>
                <p>
                  <span className="font-semibold text-white">Account Holder:</span>{" "}
                  {formData.accountHolder}
                </p>
                <p>
                  <span className="font-semibold text-white">Account Number:</span>{" "}
                  {formData.accountNumber}
                </p>
                <p>
                  <span className="font-semibold text-white">IBAN:</span>{" "}
                  {formData.iban || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-white">Branch Address:</span>{" "}
                  {formData.branchAddress || "N/A"}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleWithdrawMoney}
              className="mt-6 w-full bg-green-700 hover:bg-green-600 transition px-4 py-2 rounded-lg font-semibold"
            >
              Withdraw Money
            </button>
          </>
        )}
      </div>
    </section>
  );
}
