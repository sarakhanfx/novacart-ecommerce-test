import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const NotFoundPage = () => (
  <div className="container-custom py-24 text-center max-w-lg mx-auto">
    <p className="font-display text-9xl font-bold text-nova-100 select-none">404</p>
    <h1 className="font-display text-3xl font-bold text-gray-900 mt-4 mb-3">Page Not Found</h1>
    <p className="text-gray-500 mb-8 leading-relaxed">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      <Link to="/" className="btn-primary px-8 py-3.5">
        <ArrowLeft size={18} /> Go Home
      </Link>
      <Link to="/shop" className="btn-secondary px-8 py-3.5">
        Browse Shop
      </Link>
    </div>
  </div>
)

export default NotFoundPage
