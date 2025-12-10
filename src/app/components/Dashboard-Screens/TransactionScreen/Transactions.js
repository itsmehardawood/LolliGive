"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
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
      const bankFees = t.bank_fees ? parseFloat(t.bank_fees) : 0;
      const amountReceived = amount - bankFees;
      const time = new Date(t.created_at).toLocaleString();
      const paymentMethod = t.paymentmethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const purpose = t.purpose ? t.purpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A';
      
      return { 
        ...t, 
        amount, 
        bankFees,
        amountReceived,
        time,
        paymentMethod,
        purpose
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
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by latest first

  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF('l', 'pt', 'a4'); // landscape orientation
    doc.text("Transactions Report", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [
        [
          "TXN ID",
          "Name",
          "Amount Sent",
          "Bank Fees",
          "Amount Received",
          "Payment Method",
          "Purpose",
          "Comment",
          "Date/Time",
        ],
      ],
      body: filteredTransactions.map((t) => [
        t.txn_id,
        t.name,
        `$${t.amount.toFixed(2)}`,
        `$${t.bankFees.toFixed(2)}`,
        `$${t.amountReceived.toFixed(2)}`,
        t.paymentMethod,
        t.purpose,
        t.comment || 'N/A',
        t.time,
      ]),
      styles: { fontSize: 8 },
    });
    doc.save("transactions.pdf");
  };

  // Export to Excel
  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");
    
    // Add headers
    worksheet.columns = [
      { header: "TxnID", key: "txnId", width: 15 },
      { header: "Name", key: "name", width: 20 },
      { header: "AmountSent", key: "amountSent", width: 12 },
      { header: "BankFees", key: "bankFees", width: 12 },
      { header: "AmountReceived", key: "amountReceived", width: 15 },
      { header: "PaymentMethod", key: "paymentMethod", width: 15 },
      { header: "Purpose", key: "purpose", width: 15 },
      { header: "Comment", key: "comment", width: 20 },
      { header: "DateTime", key: "dateTime", width: 20 },
    ];
    
    // Add data
    filteredTransactions.forEach((t) => {
      worksheet.addRow({
        txnId: t.txn_id,
        name: t.name,
        amountSent: t.amount.toFixed(2),
        bankFees: t.bankFees.toFixed(2),
        amountReceived: t.amountReceived.toFixed(2),
        paymentMethod: t.paymentMethod,
        purpose: t.purpose,
        comment: t.comment || 'N/A',
        dateTime: t.time,
      });
    });
    
    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
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
                    Total Amount
                  </h3>
                  <p className="text-3xl md:text-4xl font-bold text-indigo-400 mt-1">
                    ${totalAmount.toFixed(2)}
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
                    <strong>TXN ID:</strong> {t.txn_id}
                  </p>
                  <p className="text-sm">
                    <strong>Name:</strong> {t.name}
                  </p>
                  <p className="text-sm">
                    <strong>Amount Sent:</strong> ${t.amount.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Bank Fees:</strong> ${t.bankFees.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Amount Received:</strong> ${t.amountReceived.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Payment Method:</strong> {t.paymentMethod}
                  </p>
                  <p className="text-sm">
                    <strong>Purpose:</strong> {t.purpose}
                  </p>
                  <p className="text-sm">
                    <strong>Comment:</strong> {t.comment || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <strong>Date/Time:</strong> {t.time}
                  </p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg">
              <table className="w-full text-left border border-gray-700">
                <thead className="bg-gray-800 text-gray-300 uppercase text-[10px]">
                  <tr>
                    <th className="px-2 py-3 whitespace-nowrap">TXN ID</th>
                    <th className="px-2 py-3 whitespace-nowrap">Name</th>
                    <th className="px-2 py-3 whitespace-nowrap">Amount Sent</th>
                    <th className="px-2 py-3 whitespace-nowrap">Bank Fees</th>
                    <th className="px-2 py-3 whitespace-nowrap">Amount Received</th>
                    <th className="px-2 py-3 whitespace-nowrap">Payment Method</th>
                    <th className="px-2 py-3 whitespace-nowrap">Purpose</th>
                    <th className="px-2 py-3 whitespace-nowrap">Comment</th>
                    <th className="px-2 py-3 whitespace-nowrap">Date/Time</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredTransactions.map((t, idx) => (
                    <tr
                      key={t.id || idx}
                      className="border-b border-gray-700 hover:bg-gray-900 transition"
                    >
                      <td className="px-2 py-3 whitespace-nowrap">{t.txn_id}</td>
                      <td className="px-2 py-3 whitespace-nowrap">{t.name}</td>
                      <td className="px-2 py-3 whitespace-nowrap">${t.amount.toFixed(2)}</td>
                      <td className="px-2 py-3 whitespace-nowrap">${t.bankFees.toFixed(2)}</td>
                      <td className="px-2 py-3 whitespace-nowrap">${t.amountReceived.toFixed(2)}</td>
                      <td className="px-2 py-3 whitespace-nowrap">{t.paymentMethod}</td>
                      <td className="px-2 py-3 whitespace-nowrap">{t.purpose}</td>
                      <td className="px-2 py-3 whitespace-nowrap">{t.comment || 'N/A'}</td>
                      <td className="px-2 py-3 whitespace-nowrap">{t.time}</td>
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
