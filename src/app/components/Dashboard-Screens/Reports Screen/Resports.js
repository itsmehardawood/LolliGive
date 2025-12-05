"use client";

import { useMemo, useState, useEffect } from "react";
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

export default function TransactionAnalytics() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Transform API data to match component expectations
        const transformedData = result.data.map(t => ({
          txn_id: t.txn_id,
          name: t.name,
          amount: parseFloat(t.amount), // Use amount for analytics
          time: t.created_at,
          paymentMethod: t.paymentmethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }));
        setTransactions(transformedData);
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
  // Prepare daily aggregated data
  const dailyData = useMemo(() => {
    if (!transactions.length) return [];
    
    const grouped = {};
    transactions.forEach((t) => {
      // Handle both formats: "2025-10-08T11:16:30.000000Z" and "2025-09-18 14:32"
      const date = t.time.includes('T') 
        ? t.time.split('T')[0] // Extract date from ISO format
        : t.time.split(' ')[0]; // Extract date from space-separated format
      
      if (!grouped[date]) grouped[date] = { date, total: 0, count: 0 };
      grouped[date].total += t.amount;
      grouped[date].count += 1;
    });
    
    // Sort by date
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  // Prepare weekly data
  const weeklyData = useMemo(() => {
    if (!transactions.length) return [];
    
    const grouped = {};
    transactions.forEach((t) => {
      // Handle both date formats
      const dateStr = t.time.includes('T') 
        ? t.time.split('T')[0] 
        : t.time.split(' ')[0];
      
      const d = new Date(dateStr);
      const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
      const pastDays = (d - firstDayOfYear) / 86400000;
      const week = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
      const key = `Week ${week}`;
      
      if (!grouped[key]) grouped[key] = { week: key, total: 0 };
      grouped[key].total += t.amount;
    });
    
    return Object.values(grouped).sort((a, b) => {
      const weekA = parseInt(a.week.split(' ')[1]);
      const weekB = parseInt(b.week.split(' ')[1]);
      return weekA - weekB;
    });
  }, [transactions]);

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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/50 border border-red-600 text-red-300 p-4 rounded-lg mb-6">
          <p className="font-semibold">Error loading analytics:</p>
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
          <p className="text-xl text-gray-400">No transaction data available for analytics</p>
        </div>
      )}

      {/* Charts - only show when not loading and no error */}
      {!loading && !error && transactions.length > 0 && (
        <>
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
        </>
      )}
    </section>
  );
}



