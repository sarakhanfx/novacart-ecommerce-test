import { useEffect, useState } from 'react'
import { getDashboardStats } from '../api/adminApi'
import StatCard from '../components/ui/StatCard'
import { MiniBarChart } from '../components/charts/MiniChart'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(data => {
      setStats(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>
  if (!stats) return <p className="text-red-500">Error loading stats</p>

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const month = d.toLocaleString('default', { month: 'short' })
    const revenue = stats.orders
      .filter(o => new Date(o.created_at).getMonth() === d.getMonth())
      .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
    return { name: month, value: Math.round(revenue) }
  })

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💰" color="green" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="🛒" color="blue" />
        <StatCard title="Products" value={stats.totalProducts} icon="📦" color="purple" />
        <StatCard title="Customers" value={stats.totalCustomers} icon="👥" color="orange" />
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Monthly Revenue (last 6 months)</h3>
        <MiniBarChart data={monthlyData} dataKey="value" color="#3b82f6" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-700">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Total</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-gray-600">#{String(order.id)}</td>
                  <td className="px-5 py-3 font-semibold">${parseFloat(order.total || 0).toFixed(2)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}