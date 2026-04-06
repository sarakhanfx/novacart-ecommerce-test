import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { formatPrice, getDiscountPercent } from '../lib/utils'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()

  if (wishlist.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <Heart size={64} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save products you love by clicking the heart icon</p>
        <Link to="/shop" className="btn-primary px-6 py-2.5">Browse Products</Link>
      </div>
    )
  }

  return (
    <div className="container-custom py-10">
      <div className="mb-8">
        <h1 className="section-title mb-1">My Wishlist</h1>
        <p className="text-gray-500">{wishlist.length} saved products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map(product => {
          const discount = getDiscountPercent(product.price, product.discount_price)
          return (
            <div key={product.id} className="card group overflow-hidden">
              <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 badge bg-red-500 text-white">
                    -{discount}%
                  </span>
                )}
              </Link>
              <div className="p-4">
                <p className="text-xs text-nova-600 font-medium mb-1">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-nova-600 transition-colors leading-snug">
                    {product.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between gap-2 mt-3">
                  <div>
                    {product.discount_price ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-gray-900">{formatPrice(product.discount_price)}</span>
                        <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addItem(product)}
                      disabled={product.stock === 0}
                      className="w-9 h-9 bg-nova-600 text-white rounded-xl flex items-center justify-center hover:bg-nova-700 transition-all disabled:opacity-40"
                    >
                      <ShoppingCart size={16} />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="w-9 h-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}