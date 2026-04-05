import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart, Share2 } from 'lucide-react'
import { fetchProductById, fetchRelatedProducts } from '../api/products'
import { useCart } from '../context/CartContext'
import StarRating from '../components/ui/StarRating'
import ProductCard from '../components/product/ProductCard'
import { formatPrice, getDiscountPercent } from '../lib/utils'

const ProductPage = () => {
  const { id } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    fetchProductById(id).then(({ data }) => {
      setProduct(data)
      setLoading(false)
      if (data) {
        fetchRelatedProducts(data.category_id, data.id).then(r => setRelated(r.data || []))
      }
    })
  }, [id])

  if (loading) {
    return (
      <div className="container-custom py-10">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            {[80, 60, 100, 40, 60].map((w, i) => (
              <div key={i} className="skeleton h-5 rounded" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Product not found</h2>
        <Link to="/shop" className="btn-primary mt-4">Back to Shop</Link>
      </div>
    )
  }

  const images = product.images || [product.image]
  const discount = getDiscountPercent(product.price, product.discount_price)
  const finalPrice = product.discount_price ?? product.price

  return (
    <div className="container-custom py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gray-700">Shop</Link>
        <span>/</span>
        <Link to={`/category/${product.category?.toLowerCase()}`} className="hover:text-gray-700">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={images[activeImg]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-nova-500' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="text-nova-600 font-medium text-sm mb-2">{product.category}</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {product.title}
          </h1>

          <StarRating rating={product.rating} reviewCount={product.review_count} size={16} />

          {/* Price */}
          <div className="flex items-center gap-3 my-5">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
            {product.discount_price && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="badge bg-red-100 text-red-600 font-semibold">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 10 ? (
              <span className="text-green-600 font-medium text-sm">✓ In Stock</span>
            ) : product.stock > 0 ? (
              <span className="text-orange-500 font-medium text-sm">⚠ Only {product.stock} left!</span>
            ) : (
              <span className="text-red-500 font-medium text-sm">✗ Out of Stock</span>
            )}
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center font-semibold text-gray-900">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => { for (let i = 0; i < qty; i++) addItem(product) }}
              disabled={product.stock === 0}
              className="btn-primary flex-1 py-4 text-base"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button className="btn-secondary px-4 py-4" aria-label="Wishlist">
              <Heart size={20} />
            </button>
            <button className="btn-secondary px-4 py-4" aria-label="Share">
              <Share2 size={20} />
            </button>
          </div>

          {/* Meta */}
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-500">
            <p><span className="font-medium text-gray-700">Category:</span> {product.category}</p>
            <p><span className="font-medium text-gray-700">SKU:</span> {String(product.id).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="section-title mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductPage
