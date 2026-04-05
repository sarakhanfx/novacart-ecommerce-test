import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { formatPrice, formatDate } from '../lib/utils'

const OrderConfirmationPage = () => {
  const { state } = useLocation()

  if (!state) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No order found</h2>
        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
      </div>
    )
  }

  const { orderId, form, items, total } = state

  return (
    <div className="container-custom py-16 max-w-2xl">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-lg">Thank you, {form.fullName.split(' ')[0]}! Your order is being processed.</p>
      </div>

      {/* Order ID */}
      <div className="card p-5 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={20} className="text-nova-600" />
          <div>
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="font-bold text-gray-900 font-mono">{orderId}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Date</p>
          <p className="font-medium text-gray-700 text-sm">{formatDate(new Date().toISOString())}</p>
        </div>
      </div>

      {/* Items */}
      <div className="card p-5 mb-5">
        <h2 className="font-semibold text-gray-900 mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex gap-3">
              <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl bg-gray-100 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {formatPrice((item.discount_price ?? item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-900">
          <span>Total Paid</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Shipping */}
      <div className="card p-5 mb-8">
        <h2 className="font-semibold text-gray-900 mb-3">Shipping To</h2>
        <p className="text-gray-700 font-medium">{form.fullName}</p>
        <p className="text-gray-500 text-sm">{form.address}</p>
        <p className="text-gray-500 text-sm">{form.city} {form.zip}</p>
        <p className="text-gray-500 text-sm">{form.email} · {form.phone}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/shop" className="btn-primary flex-1 py-4 justify-center">
          Continue Shopping <ArrowRight size={18} />
        </Link>
        <Link to="/account" className="btn-secondary flex-1 py-4 justify-center">
          View My Orders
        </Link>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
