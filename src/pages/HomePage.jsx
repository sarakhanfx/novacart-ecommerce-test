import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react'
import ProductCard from '../components/product/ProductCard'
import { fetchFeaturedProducts, fetchBestsellerProducts, fetchCategories } from '../api/products'

const HomePage = () => {
  const [featured, setFeatured] = useState([])
  const [bestsellers, setBestsellers] = useState([])
  const [categories, setCategories] = useState([])
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetchFeaturedProducts().then(r => setFeatured(r.data || []))
    fetchBestsellerProducts().then(r => setBestsellers(r.data || []))
    fetchCategories().then(r => setCategories(r.data || []))
  }, [])

  const perks = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30-day policy' },
    { icon: Headphones, title: '24/7 Support', desc: 'Always here for you' },
  ]

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-nova-950 via-nova-800 to-nova-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative py-24 md:py-36 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block badge bg-white/20 text-white text-sm px-3 py-1 mb-6">
              🎉 Summer Sale — Up to 40% off
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Smart Shopping,<br />
              <span className="text-accent-300">Better Living</span>
            </h1>
            <p className="text-lg text-nova-200 mb-8 max-w-lg leading-relaxed">
              Discover curated products across electronics, fashion, home essentials, beauty, and more — all at unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link to="/shop" className="btn-primary bg-white text-nova-700 hover:bg-nova-50 px-8 py-3.5 text-base">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/category/electronics" className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-3.5 text-base">
                Browse Electronics
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
                alt="Featured product"
                className="w-full h-full object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 rounded-2xl p-4 shadow-xl">
                <p className="text-xs text-gray-500 mb-1">Best Seller</p>
                <p className="font-bold text-sm">ProSound ANC</p>
                <p className="text-nova-600 font-bold">$219.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks ────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container-custom py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-nova-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-nova-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="container-custom py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/shop" className="text-nova-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group card overflow-hidden text-center p-0"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-3">
                <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
                <p className="text-gray-400 text-xs">{cat.product_count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/shop" className="text-nova-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Promo Banner ─────────────────────────────────────── */}
      <section className="container-custom py-16">
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl p-10 md:p-16 text-white text-center">
          <p className="text-sm font-medium uppercase tracking-widest mb-3 opacity-80">Limited Time Offer</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Up to 40% Off</h2>
          <p className="text-lg opacity-90 mb-8">On all electronics this weekend. Don't miss out!</p>
          <Link to="/category/electronics" className="inline-flex items-center gap-2 bg-white text-accent-600 font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors">
            Shop Electronics <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Best Sellers ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Best Sellers</h2>
            <Link to="/shop?sort=popular" className="text-nova-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
              See all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────── */}
      <section className="container-custom py-16">
        <div className="bg-nova-950 rounded-3xl p-10 md:p-16 text-center text-white">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Stay in the Loop</h2>
          <p className="text-nova-300 mb-8 max-w-md mx-auto">
            Get the latest deals, new arrivals, and exclusive offers straight to your inbox.
          </p>
          <form
            onSubmit={e => { e.preventDefault(); setEmail(''); alert('Thanks for subscribing! 🎉') }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-nova-400 focus:outline-none focus:ring-2 focus:ring-nova-400"
            />
            <button type="submit" className="btn-primary bg-nova-500 hover:bg-nova-400 px-6 py-3.5 whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-nova-500 mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  )
}

export default HomePage
