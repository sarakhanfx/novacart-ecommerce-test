import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../api/products'
import { formatPrice, generateOrderId } from '../lib/utils'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { Tag, X } from 'lucide-react'

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const [form, setForm] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  })

  const shipping = subtotal >= 50 ? 0 : 5.99
  const discount = coupon ? (subtotal * coupon.discount_percent / 100) : 0
  const total = subtotal + shipping - discount

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single()
    if (error || !data) {
      toast.error('Invalid coupon code')
      setCoupon(null)
    } else if (subtotal < data.min_order) {
      toast.error(`Minimum order $${data.min_order} required`)
      setCoupon(null)
    } else {
      setCoupon(data)
      toast.success(`Coupon applied! ${data.discount_percent}% off`)
    }
    setCouponLoading(false)
  }

  const removeCoupon = () => {
    setCoupon(null)
    setCouponCode('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    setLoading(true)
    try {
      const orderId = generateOrderId()
      await createOrder({
        userId: user?.id,
        items,
        shippingInfo: form,
        subtotal: total,
      })
      clearCart()
      navigate('/order-confirmation', { state: { orderId, form, items, total } })
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/shop" className="btn-primary">Go Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-10">
      <h1 className="section-title mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Form */}
          <div className="flex-1 space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-5 text-lg">Shipping Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input className="input" required value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input className="input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input className="input" type="tel" required value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input className="input" required value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main Street" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input className="input" required value={form.city} onChange={e => set('city', e.target.value)} placeholder="New York" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                  <input className="input" required value={form.zip} onChange={e => set('zip', e.target.value)} placeholder="10001" />
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
                <Tag size={18} /> Coupon Code
              </h2>
              {coupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-green-700">{coupon.code}</p>
                    <p className="text-sm text-green-600">{coupon.discount_percent}% discount applied!</p>
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-red-400 hover:text-red-600">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code (e.g. SAVE10)"
                    className="input flex-1"
                  />
                  <button type="button" onClick={applyCoupon} disabled={couponLoading}
                    className="btn-primary px-4 py-2 disabled:opacity-50">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Try: SAVE10, SAVE20, WELCOME15</p>
            </div>

            {/* Payment note */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-3 text-lg">Payment</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                🧪 <strong>Test Mode:</strong> This is a demo store. No real payment will be processed.
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="card p-6 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4 text-lg">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg bg-gray-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 shrink-0">
                      {formatPrice((item.discount_price ?? item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(shipping)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({coupon.discount_percent}%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-100">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-5 py-4 text-base">
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage