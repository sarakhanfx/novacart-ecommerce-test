import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Package, LogOut, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchUserOrders } from '../api/products'
import { formatDate, formatPrice } from '../lib/utils'

const AccountPage = () => {
  const { user, signOut, loading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('profile')

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading, navigate])

  useEffect(() => {
    if (user) {
      fetchUserOrders(user.id).then(r => setOrders(r.data || []))
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading || !user) return null

  const name = user.user_metadata?.full_name || user.email
  const initial = name?.[0]?.toUpperCase() || 'U'

  return (
    <div className="container-custom py-10 max-w-4xl">
      <h1 className="section-title mb-8">My Account</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <div className="card p-5 mb-4 text-center">
            <div className="w-16 h-16 bg-nova-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-2xl">{initial}</span>
            </div>
            <p className="font-semibold text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          <div className="card overflow-hidden">
            {[
              { id: 'profile', icon: User, label: 'Profile' },
              { id: 'orders', icon: Package, label: 'My Orders' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                  tab === id ? 'bg-nova-50 text-nova-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {tab === 'profile' && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-5 text-lg">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <User size={18} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{user.user_metadata?.full_name || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail size={18} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <ShieldCheck size={18} className="text-gray-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Account Status</p>
                    <p className="font-medium text-green-600">Verified ✓</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-5 text-lg">My Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={40} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No orders yet.</p>
                  <Link to="/shop" className="btn-primary">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-mono font-bold text-gray-800 text-sm">{order.id}</p>
                        <span className={`badge ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(order.created_at)}</span>
                        <span className="font-semibold text-gray-800">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AccountPage
