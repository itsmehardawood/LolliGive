"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { DollarSign } from "lucide-react";

export default function Transactions() {
const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

// Fetch transactions from API
const fetchTransactions = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Get org_key_id from localStorage
    const orgKeyId = localStorage.getItem('org_key_id');
    
    if (!orgKeyId) {
      throw new Error('Organization key not found');
    }

    const response = await fetch('https://api.lolligive.com/api/transaction/show', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        org_key_id: orgKeyId
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch transactions');
    }

    if (result.success && result.data) {
      setTransactions(result.data);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    setError(err.message);
    console.error('Error fetching transactions:', err);
  } finally {
    setLoading(false);
  }
};

// Fetch transactions on component mount
useEffect(() => {
  fetchTransactions();
}, []);

  // Filter transactions based on selected dates
  const filteredTransactions = transactions
    .map((t) => {
      // Convert API response format to display format
      const amount = parseFloat(t.amount);
      const bankFee = parseFloat(t.bank_fee);
      const amountReceived = parseFloat(t.amount_received);
      const time = new Date(t.created_at).toLocaleString();
      const paymentMethod = t.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      return { 
        ...t, 
        amount, 
        bankFee,
        amountReceived,
        time,
        paymentMethod
      };
    })
    .filter((t) => {
      if (!startDate && !endDate) return true;
      const txDate = new Date(t.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && txDate < start) return false;
      if (end) {
        end.setHours(23, 59, 59, 999); // include whole end day
        if (txDate > end) return false;
      }
      return true;
    });

  const totalAmountReceived = filteredTransactions.reduce(
    (sum, t) => sum + t.amountReceived,
    0
  );

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Transactions Report", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [
        [
          "TID",
          "Name",
          "Amount",
          "Bank Fee",
          "Amount Received",
          "Time",
          "Payment Method",
        ],
      ],
      body: filteredTransactions.map((t) => [
        t.tid,
        t.name,
        `$${t.amount.toFixed(2)}`,
        `$${t.bankFee.toFixed(2)}`,
        `$${t.amountReceived.toFixed(2)}`,
        t.time,
        t.paymentMethod,
      ]),
    });
    doc.save("transactions.pdf");
  };

  // Export to Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTransactions.map((t) => ({
        TID: t.tid,
        Name: t.name,
        Amount: t.amount.toFixed(2),
        BankFee: t.bankFee.toFixed(2),
        AmountReceived: t.amountReceived.toFixed(2),
        Time: t.time,
        PaymentMethod: t.paymentMethod,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  return (
    <section className="min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            Transactions
          </h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
            <button
              onClick={exportPDF}
              disabled={loading || transactions.length === 0}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export PDF
            </button>
            <button
              onClick={exportExcel}
              disabled={loading || transactions.length === 0}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading transactions...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-300 p-4 rounded-lg mb-6">
            <p className="font-semibold">Error loading transactions:</p>
            <p>{error}</p>
            <button 
              onClick={fetchTransactions}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && transactions.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">No transactions found</p>
          </div>
        )}

        {/* Content - only show when not loading and no error */}
        {!loading && !error && transactions.length > 0 && (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
              <div>
                <label className="block text-sm">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 rounded bg-gray-800 border border-gray-600 text-white"
                />
              </div>
            </div>

            {/* Total Amount Card */}
            <div className="mb-6">
              <div className="bg-gray-900 p-6 rounded-2xl shadow-lg flex items-center justify-between border border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">
                    Total Amount Received
                  </h3>
                  <p className="text-3xl md:text-4xl font-bold text-indigo-400 mt-1">
                    ${totalAmountReceived.toFixed(2)}
                  </p>
                </div>
                <div className="bg-indigo-500/20 p-3 rounded-full">
                  <DollarSign className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <div className="block md:hidden">
              {filteredTransactions.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
                >
                  <p className="text-sm">
                    <strong>TID:</strong> {t.tid}
                  </p>
                  <p className="text-sm">
                    <strong>Name:</strong> {t.name}
                  </p>
                  <p className="text-sm">
                    <strong>Amount:</strong> ${t.amount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Bank Fee:</strong> ${t.bankFee.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Amount Received:</strong> ${t.amountReceived.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Time:</strong> {t.time}
                  </p>
                  <p className="text-sm">
                    <strong>Payment Method:</strong> {t.paymentMethod}
                  </p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg">
              <table className="w-full text-sm text-left border border-gray-700">
                <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3">TID</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Bank Fee</th>
                    <th className="px-6 py-3">Amount Received</th>
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t, idx) => (
                    <tr
                      key={t.id || idx}
                      className="border-b border-gray-700 hover:bg-gray-900 transition"
                    >
                      <td className="px-6 py-4">{t.tid}</td>
                      <td className="px-6 py-4">{t.name}</td>
                      <td className="px-6 py-4">${t.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">${t.bankFee.toFixed(2)}</td>
                      <td className="px-6 py-4">${t.amountReceived.toFixed(2)}</td>
                      <td className="px-6 py-4">{t.time}</td>
                      <td className="px-6 py-4">{t.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
