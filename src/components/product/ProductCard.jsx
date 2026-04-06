import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Heart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { formatPrice, getDiscountPercent } from '../../lib/utils'

const ProductCard = ({ product }) => {
  const { addItem } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const discount = getDiscountPercent(product.price, product.discount_price)
  const wishlisted = isWishlisted(product.id)

  return (
    <div className="card group overflow-hidden">
      {/* Image */}
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
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 badge bg-orange-100 text-orange-700">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="badge bg-gray-200 text-gray-600 text-sm px-3 py-1">Out of Stock</span>
          </div>
        )}
        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product) }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all
            ${wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
        >
          <Heart size={14} className={wishlisted ? 'fill-white' : ''} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-nova-600 font-medium mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-nova-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.review_count})</span>
        </div>
        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-2">
          <div>
            {product.discount_price ? (
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-gray-900 text-lg">{formatPrice(product.discount_price)}</span>
                <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
              </div>
            ) : (
              <span className="font-bold text-gray-900 text-lg">{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="w-9 h-9 bg-nova-600 text-white rounded-xl flex items-center justify-center hover:bg-nova-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard