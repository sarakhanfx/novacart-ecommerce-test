import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingCart, Heart, Share2, Star } from 'lucide-react'
import { fetchProductById, fetchRelatedProducts } from '../api/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/ui/StarRating'
import ProductCard from '../components/product/ProductCard'
import { formatPrice, getDiscountPercent } from '../lib/utils'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const ProductPage = () => {
  const { id } = useParams()
  const { addItem } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

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
    loadReviews()
  }, [id])

  const loadReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', id)
      .order('created_at', { ascending: false })
    setReviews(data || [])
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) { toast.error('Please login to submit a review'); return }
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return }
    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert([{
      product_id: parseInt(id),
      user_id: user.id,
      user_name: user.email.split('@')[0],
      rating: reviewForm.rating,
      comment: reviewForm.comment
    }])
    if (error) {
      toast.error('Error submitting review')
    } else {
      toast.success('Review submitted!')
      setReviewForm({ rating: 5, comment: '' })
      loadReviews()
    }
    setSubmitting(false)
  }

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
  const wishlisted = isWishlisted(product.id)

  return (
    <div className="container-custom py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-gray-700">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img src={images[activeImg]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-nova-500' : 'border-transparent'}`}>
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
          <div className="flex items-center gap-3 my-5">
            <span className="text-3xl font-bold text-gray-900">{formatPrice(finalPrice)}</span>
            {product.discount_price && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="badge bg-red-100 text-red-600 font-semibold">{discount}% OFF</span>
              </>
            )}
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
          <div className="mb-6">
            {product.stock > 10 ? (
              <span className="text-green-600 font-medium text-sm">✓ In Stock</span>
            ) : product.stock > 0 ? (
              <span className="text-orange-500 font-medium text-sm">⚠ Only {product.stock} left!</span>
            ) : (
              <span className="text-red-500 font-medium text-sm">✗ Out of Stock</span>
            )}
          </div>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Minus size={14} />
              </button>
              <span className="w-12 text-center font-semibold text-gray-900">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40">
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { for (let i = 0; i < qty; i++) addItem(product) }}
              disabled={product.stock === 0} className="btn-primary flex-1 py-4 text-base">
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product)}
              className={`px-4 py-4 rounded-xl border-2 transition-all ${wishlisted ? 'bg-red-50 border-red-300 text-red-500' : 'btn-secondary'}`}
              aria-label="Wishlist">
              <Heart size={20} className={wishlisted ? 'fill-red-500' : ''} />
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 space-y-2 text-sm text-gray-500">
            <p><span className="font-medium text-gray-700">Category:</span> {product.category}</p>
            <p><span className="font-medium text-gray-700">SKU:</span> {String(product.id).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mb-20">
        <h2 className="section-title mb-6">Customer Reviews ({reviews.length})</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Review Form */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: star }))}>
                        <Star size={24} className={star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                  <textarea rows={4} value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nova-300" />
                </div>
                <button type="submit" disabled={submitting}
                  className="btn-primary w-full py-2.5 disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Please login to write a review</p>
                <Link to="/login" className="btn-primary px-6 py-2">Login</Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Star size={40} className="mx-auto mb-2 text-gray-200" />
                <p>No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{review.user_name}</span>
                    <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} size={14} className={star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

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