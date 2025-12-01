"use client";

import { useState, useEffect } from "react";

export default function BankInfoForm() {
  const [paymentMethod, setPaymentMethod] = useState("bank"); // "bank" or "zelle"
  const [formData, setFormData] = useState({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    iban: "",
    branchAddress: "",
    zelleName: "",
    zelleEmail: "",
    zellePhone: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);
  const [withdrawalTransactions, setWithdrawalTransactions] = useState([]);
  const [fetchingTransactions, setFetchingTransactions] = useState(false);

  // Fetch existing bank details on component mount
  useEffect(() => {
    fetchBankDetails();
  }, []);

  // Fetch withdrawal transactions when payment details are submitted
  useEffect(() => {
    if (submitted) {
      fetchWithdrawalTransactions();
    }
  }, [submitted]);

  const fetchWithdrawalTransactions = async () => {
    try {
      setFetchingTransactions(true);
      const storedOrgId = localStorage.getItem("org_key_id");
      
      if (!storedOrgId) return;

      const response = await fetch(`https://api.lolligive.com/api/withdrawals/org/${storedOrgId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setWithdrawalTransactions(Array.isArray(result.data) ? result.data : [result.data]);
        }
      }
    } catch (err) {
      console.error("Error fetching withdrawal transactions:", err);
    } finally {
      setFetchingTransactions(false);
    }
  };

  const fetchBankDetails = async () => {
    try {
      setLoading(true);
      // Get org_id from localStorage
      const storedOrgId = localStorage.getItem("org_key_id");
console.log("Fetched org_key_id from localStorage:", storedOrgId);
      
      if (!storedOrgId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`https://api.lolligive.com/api/bank-details/${storedOrgId}`);
      
      if (response.ok) {
        const result = await response.json();
        // console.log("Fetched bank details:", result);
        
        // Check if data exists in the response
        if (result.success && result.data) {
          const data = result.data;
          
          // Only set submitted if there's actual payment method data
          if (data.isZelle === 1 || data.isZelle === 0) {
            setFormData({
              bankName: data.bank_name || "",
              accountHolder: data.account_holder_name || "",
              accountNumber: data.account_no || "",
              iban: data.iban || "",
              branchAddress: data.branch_address || "",
              zelleName: data.zelle_name || "",
              zelleEmail: data.zelle_email || "",
              zellePhone: data.zelle_phone || "",
            });
            // Set payment method based on isZelle value (1 = zelle, 0 = bank)
            setPaymentMethod(data.isZelle === 1 ? "zelle" : "bank");
            setSubmitted(true);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching bank details:", err);
      setError("Failed to load bank details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Get org_id from localStorage
      const storedOrgId = localStorage.getItem("org_key_id");
      
      if (!storedOrgId) {
        setError("Organization ID not found. Please log in again.");
        setSaving(false);
        return;
      }

      const payload = {
        org_id: storedOrgId,
        bank_name: paymentMethod === "bank" ? formData.bankName : "",
        account_no: paymentMethod === "bank" ? formData.accountNumber : "",
        account_holder_name: paymentMethod === "bank" ? formData.accountHolder : "",
        iban: paymentMethod === "bank" ? formData.iban : "",
        branch_address: paymentMethod === "bank" ? formData.branchAddress : "",
        zelle_name: paymentMethod === "zelle" ? formData.zelleName : "",
        zelle_email: paymentMethod === "zelle" ? formData.zelleEmail : "",
        zelle_phone: paymentMethod === "zelle" ? formData.zellePhone : "",
        isZelle: paymentMethod === "zelle" ? 1 : 0,
      };

      const response = await fetch("https://api.lolligive.com/api/bank-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save bank details");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Error saving bank details:", err);
      setError("Failed to save bank details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleWithdrawMoney = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setWithdrawalLoading(true);
      setError(null);
      
      const storedOrgId = localStorage.getItem("org_key_id");
      
      if (!storedOrgId) {
        setError("Organization ID not found. Please log in again.");
        return;
      }

      const payload = {
        org_id: storedOrgId,
        amount: parseFloat(withdrawalAmount),
      };

      const response = await fetch("https://api.lolligive.com/api/withdrawl-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit withdrawal request");
      }

      const result = await response.json();
      
      if (result.success) {
        setWithdrawalAmount("");
        // Refresh withdrawal transactions list
        await fetchWithdrawalTransactions();
        alert("Withdrawal request submitted successfully!");
      }
    } catch (err) {
      console.error("Error submitting withdrawal:", err);
      setError("Failed to submit withdrawal request. Please try again.");
    } finally {
      setWithdrawalLoading(false);
    }
  };

  const handleEdit = () => {
    setSubmitted(false);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading bank details...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-gray-800 pb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
            Withdrawal Settings
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl">
            Configure your payment method and manage withdrawal requests. Ensure all information is accurate to prevent processing delays.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/30 border-l-4 border-red-500 text-red-200 px-4 py-3 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Form (before submission) */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 sm:p-8 space-y-6"
          >
            {/* Payment Method Toggle */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-200">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`py-3 px-4 rounded font-medium transition-all ${
                    paymentMethod === "bank"
                      ? "bg-white text-black border-2 border-white"
                      : "bg-gray-900 text-gray-400 border-2 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  Bank Account
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("zelle")}
                  className={`py-3 px-4 rounded font-medium transition-all ${
                    paymentMethod === "zelle"
                      ? "bg-white text-black border-2 border-white"
                      : "bg-gray-900 text-gray-400 border-2 border-gray-700 hover:border-gray-600"
                  }`}
                >
                  Zelle
                </button>
              </div>
            </div>

            {/* Bank Account Fields */}
            {paymentMethod === "bank" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">
                      Bank Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Bank of America"
                      className="w-full px-4 py-2.5 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountHolder"
                      value={formData.accountHolder}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="1234567890"
                      className="w-full px-4 py-2.5 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-200">
                      IBAN
                    </label>
                    <input
                      type="text"
                      name="iban"
                      value={formData.iban}
                      onChange={handleChange}
                      placeholder="PK36SCBL0000001123456702"
                      className="w-full px-4 py-2.5 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Branch Address
                  </label>
                  <textarea
                    name="branchAddress"
                    value={formData.branchAddress}
                    onChange={handleChange}
                    rows="3"
                    placeholder="123 Main Street, New York, NY, USA"
                    className="w-full px-4 py-2.5 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            )}

            {/* Zelle Fields */}
            {paymentMethod === "zelle" && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Zelle Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zelleName"
                    value={formData.zelleName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Zelle Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="zelleEmail"
                    value={formData.zelleEmail}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Zelle Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="zellePhone"
                    value={formData.zellePhone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    className="w-full px-4 py-2.5 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-white hover:bg-gray-200 text-black font-medium px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Payment Details"}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Preview Card */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Payment Information
                  </h3>
                  <span className="inline-block bg-white text-black px-3 py-1 rounded text-xs font-medium uppercase tracking-wide">
                    {paymentMethod === "bank" ? "Bank Account" : "Zelle"}
                  </span>
                </div>
                <button
                  onClick={handleEdit}
                  className="text-gray-400 hover:text-white text-sm font-medium border border-gray-600 hover:border-gray-500 px-4 py-2 rounded transition-colors"
                >
                  Edit Details
                </button>
              </div>

              {paymentMethod === "bank" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="border-l-2 border-gray-700 pl-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Bank Name</p>
                    <p className="text-white font-medium">{formData.bankName}</p>
                  </div>
                  <div className="border-l-2 border-gray-700 pl-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Account Holder</p>
                    <p className="text-white font-medium">{formData.accountHolder}</p>
                  </div>
                  <div className="border-l-2 border-gray-700 pl-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Account Number</p>
                    <p className="text-white font-medium">{formData.accountNumber}</p>
                  </div>
                  <div className="border-l-2 border-gray-700 pl-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">IBAN</p>
                    <p className="text-white font-medium">{formData.iban || "—"}</p>
                  </div>
                  <div className="border-l-2 border-gray-700 pl-4 sm:col-span-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Branch Address</p>
                    <p className="text-white font-medium">{formData.branchAddress || "—"}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="border-l-2 border-gray-700 pl-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Name</p>
                    <p className="text-white font-medium">{formData.zelleName}</p>
                  </div>
                  <div className="border-l-2 border-gray-700 pl-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Email</p>
                    <p className="text-white font-medium">{formData.zelleEmail}</p>
                  </div>
                  <div className="border-l-2 border-gray-700 pl-4 sm:col-span-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-white font-medium">{formData.zellePhone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-6 bg-gray-900/50 border border-gray-700 rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white mb-1">
                Request Withdrawal
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Submit a request to withdraw funds to your registered payment method.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-200">
                    Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 rounded bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors text-lg"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleWithdrawMoney}
                  disabled={withdrawalLoading}
                  className="w-full bg-white hover:bg-gray-200 text-black font-medium px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {withdrawalLoading ? "Processing..." : "Submit Request"}
                </button>
              </div>
            </div>

            {/* Withdrawal Transactions History */}
            <div className="mt-6 bg-gray-900/50 border border-gray-700 rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-white mb-1">
                Transaction History
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                View the status of your withdrawal requests.
              </p>
              
              {fetchingTransactions ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-700 border-t-white mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading transactions...</p>
                </div>
              ) : withdrawalTransactions.length > 0 ? (
                <div className="space-y-2">
                  {withdrawalTransactions.map((transaction, index) => (
                    <div
                      key={transaction.id || index}
                      className="bg-gray-900 border border-gray-700 rounded p-4 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-white font-semibold text-lg">
                              ${parseFloat(transaction.amount || 0).toFixed(2)}
                            </p>
                            <p className="text-gray-500 text-xs mt-0.5">
                              {new Date(transaction.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1.5 rounded text-xs font-medium uppercase tracking-wider ${
                            transaction.withdrawal_status === 1
                              ? 'bg-green-950 text-green-400 border border-green-900'
                              : transaction.withdrawal_status === 0
                              ? 'bg-yellow-950 text-yellow-400 border border-yellow-900'
                              : 'bg-gray-800 text-gray-400 border border-gray-700'
                          }`}
                        >
                          {transaction.withdrawal_status === 1 
                            ? 'Approved' 
                            : transaction.withdrawal_status === 0 
                            ? 'Pending' 
                            : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded">
                  <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No withdrawal requests yet</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
