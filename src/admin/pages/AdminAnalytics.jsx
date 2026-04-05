import { useEffect, useState } from 'react'
import { getDashboardStats } from '../api/adminApi'
import { MiniBarChart } from '../components/charts/MiniChart'

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(data => { setStats(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>
  if (!stats) return <p className="text-red-500">Error loading analytics</p>

  const statusData = ['pending','processing','shipped','delivered','cancelled'].map(s => ({
    name: s,
    value: stats.orders.filter(o => (o.status || 'pending') === s).length
  }))

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const day = d.toLocaleDateString('default', { weekday: 'short' })
    const count = stats.orders.filter(o => new Date(o.created_at).toDateString() === d.toDateString()).length
    return { name: day, value: count }
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">Orders by Status</h3>
          <MiniBarChart data={statusData} dataKey="value" color="#8b5cf6" />
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">Orders — Last 7 Days</h3>
          <MiniBarChart data={dailyData} dataKey="value" color="#10b981" />
        </div>
      </div>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mt-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
            <p className="text-gray-500 mt-1">Total Orders</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(0)}</p>
            <p className="text-gray-500 mt-1">Revenue</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{stats.totalProducts}</p>
            <p className="text-gray-500 mt-1">Products</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{stats.totalCustomers}</p>
            <p className="text-gray-500 mt-1">Customers</p>
          </div>
        </div>
      </div>
    </div>
  )
}