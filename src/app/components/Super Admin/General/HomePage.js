

'use client';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import { apiFetch } from '@/app/lib/api.js';
export default function HomePage() {
  const [stackedData, setStackedData] = useState([]);
  const [histogramData, setHistogramData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const groupByDate = (data, dateField) => {
    const grouped = {};
    data.forEach(item => {
      const rawDate = item[dateField];
      if (!rawDate) return;
      const date = moment(rawDate).format('YYYY-MM-DD');
      grouped[date] = (grouped[date] || 0) + 1;
    });
    return grouped;
  };
  const fetchData = async () => {
    try {
      // Fetch organizations data from /orgs endpoint
      const response = await apiFetch('/orgs');
      const data = await response.json();
      
      if (data.success) {
        const allOrganizations = data.data || [];
        
        // Filter organizations by their verification status
        const pendingOrgs = allOrganizations.filter(org => 
          org.organization_verified === 'PENDING'
        );
        
        const approvedOrgs = allOrganizations.filter(org => 
          org.organization_verified === 'APPROVED'
        );
        
        const deactivatedOrgs = allOrganizations.filter(org => 
          org.organization_verified === 'DEACTIVATE'
        );
        
        const incompleteOrgs = allOrganizations.filter(org => 
          org.organization_verified === 'INCOMPLETE'
        );
        
        // Group data by creation date
        const pendingByDate = groupByDate(pendingOrgs, 'created_at');
        const approvedByDate = groupByDate(approvedOrgs, 'created_at');
        const deactivatedByDate = groupByDate(deactivatedOrgs, 'created_at');
        const incompleteByDate = groupByDate(incompleteOrgs, 'created_at');
        
        // Get all unique dates
        const allDates = Array.from(new Set([
          ...Object.keys(pendingByDate),
          ...Object.keys(approvedByDate),
          ...Object.keys(deactivatedByDate),
          ...Object.keys(incompleteByDate),
        ])).sort();
        
        // Create merged data for charts
        const merged = allDates.map(date => ({
          date,
          Pending: pendingByDate[date] || 0,
          Approved: approvedByDate[date] || 0,
          Deactivated: deactivatedByDate[date] || 0,
          Incomplete: incompleteByDate[date] || 0,
          Total: (pendingByDate[date] || 0) + (approvedByDate[date] || 0) + 
                 (deactivatedByDate[date] || 0) + (incompleteByDate[date] || 0),
        }));
        
        setStackedData(merged);
        setHistogramData(merged.map(d => ({ date: d.date, Total: d.Total })));
        
        // Create pie chart data with all statuses
        const pie = [
          { name: 'Pending', value: pendingOrgs.length },
          { name: 'Approved', value: approvedOrgs.length },
          { name: 'Deactivated', value: deactivatedOrgs.length },
          { name: 'Incomplete', value: incompleteOrgs.length },
        ].filter(item => item.value > 0); // Only show statuses that have data
        
        setPieData(pie);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (loading) return <p className="text-center text-lg text-white">Loading dashboard...</p>;
  const COLORS = ['#FF8042', '#00C49F', '#FF6B6B', '#FFD93D'];
  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-white">📊 Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bg-black rounded-2xl shadow border border-gray-800 p-4">
          <h2 className="text-lg font-semibold mb-4 text-white">Organization Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Stacked Bar Chart */}
        <div className="bg-black rounded-2xl shadow border border-gray-800 p-4 col-span-1 xl:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-white">Organizations Created by Date & Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stackedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pending" fill="#FF8042" stackId="a" />
              <Bar dataKey="Approved" fill="#00C49F" stackId="a" />
              <Bar dataKey="Deactivated" fill="#FF6B6B" stackId="a" />
              <Bar dataKey="Incomplete" fill="#FFD93D" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Histogram */}
        <div className="bg-black rounded-2xl shadow border border-gray-800 p-4 col-span-1 xl:col-span-3">
          <h2 className="text-lg font-semibold mb-4 text-white">Total Organizations per Date</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="Total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}