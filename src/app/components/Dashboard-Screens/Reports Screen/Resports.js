"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Example: transactions data
const transactions = [
  { tid: "TXN1001", name: "John Doe", amount: 250.75, time: "2025-09-18 14:32", paymentMethod: "Credit Card" },
  { tid: "TXN1002", name: "Jane Smith", amount: 120.0, time: "2025-09-19 15:10", paymentMethod: "PayPal" },
  { tid: "TXN1003", name: "Ali Khan", amount: 560.25, time: "2025-09-20 16:45", paymentMethod: "Bank Transfer" },
  { tid: "TXN1004", name: "Maria Lee", amount: 75.5, time: "2025-09-20 17:20", paymentMethod: "Cash" },
  { tid: "TXN1005", name: "Sophia Johnson", amount: 310.4, time: "2025-09-21 18:05", paymentMethod: "Debit Card" },
  { tid: "TXN1006", name: "David Brown", amount: 999.99, time: "2025-09-22 18:45", paymentMethod: "Stripe" },
  { tid: "TXN1007", name: "Emily Davis", amount: 45.0, time: "2025-09-22 19:12", paymentMethod: "Google Pay" },
  { tid: "TXN1008", name: "Michael Wilson", amount: 780.65, time: "2025-09-23 20:30", paymentMethod: "Apple Pay" },
];

export default function TransactionAnalytics() {
  // Prepare daily aggregated data
  const dailyData = useMemo(() => {
    const grouped = {};
    transactions.forEach((t) => {
      const date = t.time.split(" ")[0]; // yyyy-mm-dd
      if (!grouped[date]) grouped[date] = { date, total: 0, count: 0 };
      grouped[date].total += t.amount;
      grouped[date].count += 1;
    });
    return Object.values(grouped);
  }, []);

  // Prepare weekly data
  const weeklyData = useMemo(() => {
    const grouped = {};
    transactions.forEach((t) => {
      const d = new Date(t.time);
      const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
      const pastDays = (d - firstDayOfYear) / 86400000;
      const week = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
      const key = `Week ${week}`;
      if (!grouped[key]) grouped[key] = { week: key, total: 0 };
      grouped[key].total += t.amount;
    });
    return Object.values(grouped);
  }, []);

  return (
    <section className="p-8 text-white max-w-6xl mx-auto">
      {/* Page Heading */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-white">Transaction Analytics</h2>
        <p className="mt-2 text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Visual insights into your transactions, including daily trends,
          transaction counts, and weekly performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Amounts (Line Chart) */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Daily Amount Received</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                labelStyle={{ color: "#E5E7EB" }}
              />
              <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Transaction Count */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Transactions Count per Day</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                labelStyle={{ color: "#E5E7EB" }}
              />
              <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="mt-8 bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">Weekly Summary</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="week" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
              labelStyle={{ color: "#E5E7EB" }}
            />
            <Bar dataKey="total" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}



