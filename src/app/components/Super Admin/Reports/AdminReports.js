'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Building2, DollarSign, TrendingUp, CreditCard, Calendar, Filter } from 'lucide-react';

export default function AdminReports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [dateRange, setDateRange] = useState('all'); // all, week, month, year

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/transaction/all`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch transactions');
      }

      if (result.success && result.data) {
        setTransactions(result.data.transactions);
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

  // Get unique organizations
  const organizations = useMemo(() => {
    const orgs = [...new Set(transactions.map(t => t.org_key_id))];
    return orgs.sort();
  }, [transactions]);

  // Filter transactions by selected org and date range
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by organization
    if (selectedOrg !== 'all') {
      filtered = filtered.filter(t => t.org_key_id === selectedOrg);
    }

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch(dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(t => new Date(t.created_at) >= cutoffDate);
    }

    return filtered;
  }, [transactions, selectedOrg, dateRange]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    return {
      totalTransactions: filteredTransactions.length,
      totalAmount: filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
      totalReceived: filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount_received), 0),
      totalFees: filteredTransactions.reduce((sum, t) => sum + parseFloat(t.bank_fee), 0),
      averageTransaction: filteredTransactions.length > 0 
        ? filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0) / filteredTransactions.length 
        : 0
    };
  }, [filteredTransactions]);

  // Daily data for line chart
  const dailyData = useMemo(() => {
    if (!filteredTransactions.length) return [];

    const grouped = {};
    filteredTransactions.forEach((t) => {
      const date = t.created_at.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = { date, amount: 0, received: 0, fees: 0, count: 0 };
      }
      grouped[date].amount += parseFloat(t.amount);
      grouped[date].received += parseFloat(t.amount_received);
      grouped[date].fees += parseFloat(t.bank_fee);
      grouped[date].count += 1;
    });

    return Object.values(grouped)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(d => ({
        ...d,
        amount: parseFloat(d.amount.toFixed(2)),
        received: parseFloat(d.received.toFixed(2)),
        fees: parseFloat(d.fees.toFixed(2))
      }));
  }, [filteredTransactions]);

  // Payment method distribution
  const paymentMethodData = useMemo(() => {
    const methods = {};
    filteredTransactions.forEach((t) => {
      const method = t.payment_method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      if (!methods[method]) {
        methods[method] = { name: method, value: 0, count: 0 };
      }
      methods[method].value += parseFloat(t.amount);
      methods[method].count += 1;
    });

    return Object.values(methods).sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  // Weekly summary
  const weeklyData = useMemo(() => {
    if (!filteredTransactions.length) return [];

    const grouped = {};
    filteredTransactions.forEach((t) => {
      const date = new Date(t.created_at.split('T')[0]);
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDays = (date - firstDayOfYear) / 86400000;
      const week = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
      const key = `Week ${week}`;

      if (!grouped[key]) {
        grouped[key] = { week: key, total: 0, count: 0 };
      }
      grouped[key].total += parseFloat(t.amount_received);
      grouped[key].count += 1;
    });

    return Object.values(grouped)
      .sort((a, b) => parseInt(a.week.split(' ')[1]) - parseInt(b.week.split(' ')[1]))
      .map(d => ({
        ...d,
        total: parseFloat(d.total.toFixed(2))
      }));
  }, [filteredTransactions]);

  // Organization comparison data (only when "all" is selected)
  const orgComparisonData = useMemo(() => {
    if (selectedOrg !== 'all') return [];

    const grouped = {};
    transactions.forEach((t) => {
      if (!grouped[t.org_key_id]) {
        grouped[t.org_key_id] = { 
          org: t.org_key_id.slice(0, 8) + '...', 
          fullOrg: t.org_key_id,
          amount: 0, 
          count: 0 
        };
      }
      grouped[t.org_key_id].amount += parseFloat(t.amount_received);
      grouped[t.org_key_id].count += 1;
    });

    return Object.values(grouped)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10) // Top 10 organizations
      .map(d => ({
        ...d,
        amount: parseFloat(d.amount.toFixed(2))
      }));
  }, [transactions, selectedOrg]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/50 border border-red-600 text-red-300 p-6 rounded-lg">
            <p className="font-semibold mb-2">Error loading reports:</p>
            <p>{error}</p>
            <button
              onClick={fetchTransactions}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Transaction Reports & Analytics</h1>
          <p className="text-gray-400">Comprehensive insights into transaction data across all organizations</p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Organization Filter */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Building2 className="w-4 h-4" />
              Filter by Organization
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Organizations</option>
              {organizations.map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg border border-blue-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-200">Total Transactions</h3>
              <TrendingUp className="w-5 h-5 text-blue-300" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalTransactions}</p>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg border border-green-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-200">Total Amount</h3>
              <DollarSign className="w-5 h-5 text-green-300" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalAmount)}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg border border-purple-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-purple-200">Amount Received</h3>
              <CreditCard className="w-5 h-5 text-purple-300" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(stats.totalReceived)}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg border border-orange-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-orange-200">Average Transaction</h3>
              <DollarSign className="w-5 h-5 text-orange-300" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(stats.averageTransaction)}</p>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-12 text-center">
            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No transactions found for the selected filters</p>
          </div>
        ) : (
          <>
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Daily Amount Trends */}
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-white">Daily Transaction Amounts</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#E5E7EB' }}
                      formatter={(value) => formatCurrency(value)}
                    />
                    <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                    <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} name="Total Amount" />
                    <Line type="monotone" dataKey="received" stroke="#10B981" strokeWidth={2} name="Received" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Transaction Count */}
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-white">Daily Transaction Count</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#E5E7EB' }}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} name="Transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Method Distribution */}
              {paymentMethodData.length > 0 && (
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-white">Payment Methods Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        formatter={(value, name, props) => [
                          `${formatCurrency(value)} (${props.payload.count} txns)`,
                          props.payload.name
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Weekly Summary */}
              {weeklyData.length > 0 && (
                <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 text-white">Weekly Revenue Summary</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="week" 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                        labelStyle={{ color: '#E5E7EB' }}
                        formatter={(value, name, props) => [
                          `${formatCurrency(value)} (${props.payload.count} txns)`,
                          'Revenue'
                        ]}
                      />
                      <Bar dataKey="total" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Organization Comparison (only when "all" is selected) */}
            {selectedOrg === 'all' && orgComparisonData.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-lg mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Top Organizations by Revenue</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={orgComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      type="number" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="org" 
                      stroke="#9CA3AF"
                      tick={{ fill: '#9CA3AF', fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#E5E7EB' }}
                      formatter={(value, name, props) => [
                        `${formatCurrency(value)} (${props.payload.count} txns)`,
                        props.payload.fullOrg
                      ]}
                    />
                    <Bar dataKey="amount" fill="#14B8A6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Payment Methods Breakdown Table */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Payment Methods Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Payment Method</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Transactions</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Total Amount</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Avg. Transaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentMethodData.map((method, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-4 text-white flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          {method.name}
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-right">{method.count}</td>
                        <td className="py-3 px-4 text-gray-300 text-right font-semibold">{formatCurrency(method.value)}</td>
                        <td className="py-3 px-4 text-gray-300 text-right">{formatCurrency(method.value / method.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
