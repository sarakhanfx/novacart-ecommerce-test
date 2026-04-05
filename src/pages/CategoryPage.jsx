import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ProductGrid from '../components/product/ProductGrid'
import { fetchProducts, fetchCategories } from '../api/products'

const CategoryPage = () => {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    const load = async () => {
      setLoading(true)
      const { data: cats } = await fetchCategories()
      const cat = (cats || []).find(c => c.slug === slug)
      setCategory(cat)
      if (cat) {
        const { data } = await fetchProducts({ category: cat.name })
        setProducts(data || [])
      }
      setLoading(false)
    }
    load()
  }, [slug])

  return (
    <div>
      {/* Category Hero */}
      {category && (
        <div className="relative h-56 md:h-72 overflow-hidden">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 container-custom flex flex-col justify-end pb-8">
            <Link to="/shop" className="inline-flex items-center gap-1 text-white/80 text-sm mb-3 hover:text-white transition-colors w-fit">
              <ArrowLeft size={14} /> Back to Shop
            </Link>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">{category.name}</h1>
            <p className="text-white/80 mt-1">{category.description}</p>
          </div>
        </div>
      )}

      <div className="container-custom py-10">
        {!loading && (
          <p className="text-gray-500 mb-6">{products.length} products in {category?.name}</p>
        )}
        <ProductGrid products={products} loading={loading} />
      </div>
    </div>
  )
}

export default CategoryPage
