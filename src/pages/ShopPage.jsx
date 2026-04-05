import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductGrid from '../components/product/ProductGrid'
import { fetchProducts, fetchCategories } from '../api/products'

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
]

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await fetchProducts({ search, category, sort })
    setProducts(data || [])
    setLoading(false)
  }, [search, category, sort])

  useEffect(() => { load() }, [load])
  useEffect(() => { fetchCategories().then(r => setCategories(r.data || [])) }, [])

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const clearAll = () => setSearchParams({})

  const hasFilters = search || category || sort

  return (
    <div className="container-custom py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-1">All Products</h1>
        <p className="text-gray-500">{products.length} products found</p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setParam('search', e.target.value)}
            className="input pl-10"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => setParam('sort', e.target.value)}
          className="input w-full sm:w-52"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Filter toggle (mobile) */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="btn-secondary sm:hidden flex items-center gap-2"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — categories */}
        <aside className={`${filtersOpen ? 'block' : 'hidden'} sm:block w-full sm:w-52 shrink-0`}>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Categories</h3>
              {category && (
                <button onClick={() => setParam('category', '')} className="text-xs text-nova-600 hover:underline">
                  Clear
                </button>
              )}
            </div>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setParam('category', '')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-nova-50 text-nova-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  All Products
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => setParam('category', cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat.name ? 'bg-nova-50 text-nova-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat.name}
                    <span className="ml-2 text-xs text-gray-400">({cat.product_count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-5">
              {search && (
                <span className="inline-flex items-center gap-1 badge bg-nova-100 text-nova-700 px-3 py-1 text-sm">
                  "{search}"
                  <button onClick={() => setParam('search', '')}><X size={12} /></button>
                </span>
              )}
              {category && (
                <span className="inline-flex items-center gap-1 badge bg-nova-100 text-nova-700 px-3 py-1 text-sm">
                  {category}
                  <button onClick={() => setParam('category', '')}><X size={12} /></button>
                </span>
              )}
              <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600 underline ml-1">
                Clear all
              </button>
            </div>
          )}
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default ShopPage
