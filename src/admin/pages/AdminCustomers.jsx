import { useEffect, useState } from 'react'
import { getCustomers } from '../api/adminApi'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getCustomers().then(data => { setCustomers(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = customers.filter(c =>
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.full_name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Customers</h2>
      <div className="mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-300" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Orders</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(c => (
              <tr key={c.user_id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{c.full_name}</td>
                <td className="px-5 py-3 text-gray-500">{c.email}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{c.total_orders}</span>
                </td>
                <td className="px-5 py-3 font-semibold">${c.total_spent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center py-10 text-gray-400">No customers found</p>}
      </div>
    </div>
  )
}