import React from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/utils'

const CartPage = () => {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart()

  const shipping = subtotal >= 50 ? 0 : 5.99
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <ShoppingBag size={64} className="text-gray-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn-primary px-8 py-3.5">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-10">
      <h1 className="section-title mb-8">Shopping Cart ({itemCount})</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {items.map(item => {
            const price = item.discount_price ?? item.price
            return (
              <div key={item.id} className="card p-4 flex gap-4">
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-xs text-nova-600 font-medium mb-1">{item.category}</p>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-nova-600 transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0 p-1"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty */}
                    <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:opacity-40"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatPrice(price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">{formatPrice(price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="lg:w-80 shrink-0">
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4 text-lg">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                  Add {formatPrice(50 - subtotal)} more for free shipping!
                </p>
              )}
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-900 text-lg mb-5">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className="btn-primary w-full py-4 text-base">
              Checkout <ArrowRight size={18} />
            </Link>
            <Link to="/shop" className="btn-ghost w-full mt-2 text-sm justify-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
