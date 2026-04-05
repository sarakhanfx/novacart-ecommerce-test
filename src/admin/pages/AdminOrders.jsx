import { useEffect, useState } from 'react'
import { getOrders, updateOrderStatus } from '../api/adminApi'

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getOrders().then(data => { setOrders(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', ...statuses].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Order ID</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Total</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Items</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Date</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Change Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-gray-600 text-xs">#{order.id}</td>
                <td className="px-5 py-3 font-semibold">${parseFloat(order.total || 0).toFixed(2)}</td>
                <td className="px-5 py-3 text-gray-500">{(order.order_items || []).length} items</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status || 'pending'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <select value={order.status || 'pending'} onChange={e => handleStatus(order.id, e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center py-10 text-gray-400">No orders found</p>}
      </div>
    </div>
  )
}