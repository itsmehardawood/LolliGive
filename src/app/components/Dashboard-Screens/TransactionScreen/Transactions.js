"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function Transactions() {
 const [transactions] = useState([
  { tid: "TXN1001", name: "John Doe", amount: 250.75, time: "2025-09-18 14:32", paymentMethod: "Credit Card" },
  { tid: "TXN1002", name: "Jane Smith", amount: 120.00, time: "2025-09-18 15:10", paymentMethod: "PayPal" },
  { tid: "TXN1003", name: "Ali Khan", amount: 560.25, time: "2025-09-18 16:45", paymentMethod: "Bank Transfer" },
  { tid: "TXN1004", name: "Maria Lee", amount: 75.50, time: "2025-09-18 17:20", paymentMethod: "Cash" },
  { tid: "TXN1005", name: "Sophia Johnson", amount: 310.40, time: "2025-09-18 18:05", paymentMethod: "Debit Card" },
  { tid: "TXN1006", name: "David Brown", amount: 999.99, time: "2025-09-18 18:45", paymentMethod: "Stripe" },
  { tid: "TXN1007", name: "Emily Davis", amount: 45.00, time: "2025-09-18 19:12", paymentMethod: "Google Pay" },
  { tid: "TXN1008", name: "Michael Wilson", amount: 780.65, time: "2025-09-18 20:30", paymentMethod: "Apple Pay" },
]);


  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Transactions Report", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["TID", "Name", "Amount", "Time"]],
      body: transactions.map((t) => [t.tid, t.name, t.amount, t.time]),
    });
    doc.save("transactions.pdf");
  };

  // Export to Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  return (
    <section className="min-h-screen text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Transactions</h2>
          <div className="space-x-3">
            <button
              onClick={exportPDF}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
            >
              Export PDF
            </button>
            <button
              onClick={exportExcel}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition"
            >
              Export Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full text-sm text-left border border-gray-700">
            <thead className="bg-gray-800 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">TID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-700 hover:bg-gray-900 transition"
                >
                  <td className="px-6 py-4">{t.tid}</td>
                  <td className="px-6 py-4">{t.name}</td>
                  <td className="px-6 py-4">${t.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{t.time}</td>
                  <td className="px-6 py-4">{t.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
