import { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import API from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const StatCard = ({ label, value, icon, bg, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <span className={`text-xl ${color}`}>{icon}</span>
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </div>
);

const PIE_COLORS = ['#4f46e5','#22c55e','#f59e0b','#ef4444','#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-gray-600">{label}</p>
        <p className="text-sm font-bold text-indigo-600 mt-0.5">{payload[0].value} bookings</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then(res => setStats(res.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform overview and analytics</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total Customers"
            value={stats?.total_users}
            icon="👥" bg="bg-blue-50" color="text-blue-600"
          />
          <StatCard
            label="Total Appointments"
            value={stats?.total_appointments}
            icon="📅" bg="bg-indigo-50" color="text-indigo-600"
          />
          <StatCard
            label="Active Services"
            value={stats?.total_services}
            icon="⚙️" bg="bg-green-50" color="text-green-600"
          />
          <StatCard
            label="Revenue (Completed)"
            value={`Rs. ${Number(stats?.total_revenue || 0).toLocaleString()}`}
            icon="💰" bg="bg-purple-50" color="text-purple-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">

          {/* Monthly Bookings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-sm font-bold text-gray-900">Monthly Bookings</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.monthly_bookings || []} barSize={28}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[6,6,0,0]} name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Pie */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-sm font-bold text-gray-900">Appointment Status</h2>
              <p className="text-xs text-gray-400 mt-0.5">Distribution overview</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats?.by_status || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={40}
                >
                  {(stats?.by_status || []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => (
                    <span className="text-xs capitalize text-gray-600">{value}</span>
                  )}
                />
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-900">Top Services</h2>
            <p className="text-xs text-gray-400 mt-0.5">By number of bookings</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={stats?.trending_services || []}
              layout="vertical"
              barSize={20}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                width={140}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '12px' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="bookings" fill="#8b5cf6" radius={[0,6,6,0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </Layout>
  );
}