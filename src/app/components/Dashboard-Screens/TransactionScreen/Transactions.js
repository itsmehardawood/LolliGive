"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { DollarSign } from "lucide-react";

export default function Transactions() {
const [transactions] = useState([
  {
    tid: "TXN1001",
    name: "John Doe",
    amount: 180.5,
    bankFee: 4.5,
    amountReceived: 176.0,
    time: "2025-09-18 14:32",
    paymentMethod: "Credit Card",
  },
  {
    tid: "TXN1002",
    name: "Jane Smith",
    amount: 95.0,
    bankFee: 2.38,
    amountReceived: 92.62,
    time: "2025-09-19 11:15",
    paymentMethod: "PayPal",
  },
  {
    tid: "TXN1003",
    name: "Ali Khan",
    amount: 150.0,
    bankFee: 3.75,
    amountReceived: 146.25,
    time: "2025-09-20 16:45",
    paymentMethod: "Bank Transfer",
  },
  {
    tid: "TXN1004",
    name: "Maria Lee",
    amount: 45.5,
    bankFee: 1.1,
    amountReceived: 44.4,
    time: "2025-09-21 10:20",
    paymentMethod: "Credit Card",
  },
  {
    tid: "TXN1005",
    name: "Sophia Johnson",
    amount: 120.4,
    bankFee: 3.0,
    amountReceived: 117.4,
    time: "2025-09-22 18:05",
    paymentMethod: "Debit Card",
  },
  {
    tid: "TXN1006",
    name: "David Brown",
    amount: 200.0,
    bankFee: 5.0,
    amountReceived: 195.0,
    time: "2025-09-23 19:45",
    paymentMethod: "Stripe",
  },
  {
    tid: "TXN1007",
    name: "Emily Davis",
    amount: 50.0,
    bankFee: 1.25,
    amountReceived: 48.75,
    time: "2025-09-24 09:12",
    paymentMethod: "Google Pay",
  },
  {
    tid: "TXN1008",
    name: "Michael Wilson",
    amount: 170.0,
    bankFee: 4.25,
    amountReceived: 165.75,
    time: "2025-09-25 20:30",
    paymentMethod: "Apple Pay",
  },
  {
    tid: "TXN1009",
    name: "Sarah Connor",
    amount: 135.5,
    bankFee: 3.38,
    amountReceived: 132.12,
    time: "2025-09-26 13:45",
    paymentMethod: "PayPal",
  },
  {
    tid: "TXN1010",
    name: "James Bond",
    amount: 200.0,
    bankFee: 5.0,
    amountReceived: 195.0,
    time: "2025-09-27 22:10",
    paymentMethod: "Bank Transfer",
  },
  {
    tid: "TXN1011",
    name: "Bruce Wayne",
    amount: 110.3,
    bankFee: 2.75,
    amountReceived: 107.55,
    time: "2025-09-28 15:55",
    paymentMethod: "Credit Card",
  },
  {
    tid: "TXN1012",
    name: "Clark Kent",
    amount: 160.75,
    bankFee: 4.0,
    amountReceived: 156.75,
    time: "2025-09-29 08:25",
    paymentMethod: "Stripe",
  },
  {
    tid: "TXN1013",
    name: "Diana Prince",
    amount: 140.4,
    bankFee: 3.5,
    amountReceived: 136.9,
    time: "2025-09-30 17:40",
    paymentMethod: "Debit Card",
  },
  {
    tid: "TXN1014",
    name: "Peter Parker",
    amount: 75.0,
    bankFee: 1.88,
    amountReceived: 73.12,
    time: "2025-10-01 12:10",
    paymentMethod: "Google Pay",
  },
  {
    tid: "TXN1015",
    name: "Tony Stark",
    amount: 200.0,
    bankFee: 5.0,
    amountReceived: 195.0,
    time: "2025-10-02 19:30",
    paymentMethod: "Apple Pay",
  },
  {
    tid: "TXN1016",
    name: "Steve Rogers",
    amount: 85.0,
    bankFee: 2.13,
    amountReceived: 82.87,
    time: "2025-10-03 10:05",
    paymentMethod: "Credit Card",
  },
  {
    tid: "TXN1017",
    name: "Natasha Romanoff",
    amount: 190.5,
    bankFee: 4.75,
    amountReceived: 185.75,
    time: "2025-10-04 14:50",
    paymentMethod: "Credit Card",
  },
  {
    tid: "TXN1018",
    name: "Wanda Maximoff",
    amount: 125.25,
    bankFee: 3.13,
    amountReceived: 122.12,
    time: "2025-10-05 16:00",
    paymentMethod: "PayPal",
  },
  {
    tid: "TXN1019",
    name: "Sam Wilson",
    amount: 200.0,
    bankFee: 5.0,
    amountReceived: 195.0,
    time: "2025-10-06 11:20",
    paymentMethod: "Bank Transfer",
  },
  {
    tid: "TXN1020",
    name: "Bucky Barnes",
    amount: 150.75,
    bankFee: 3.75,
    amountReceived: 147.0,
    time: "2025-10-07 18:15",
    paymentMethod: "Debit Card",
  },
]);


  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter transactions based on selected dates
  const filteredTransactions = transactions
    .map((t) => {
      const bankFee = t.amount * 0.025;
      const amountReceived = t.amount - bankFee;
      return { ...t, bankFee, amountReceived };
    })
    .filter((t) => {
      if (!startDate && !endDate) return true;
      const txDate = new Date(t.time);
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
              key={idx}
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
                  key={idx}
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
      </div>
    </section>
  );
}
