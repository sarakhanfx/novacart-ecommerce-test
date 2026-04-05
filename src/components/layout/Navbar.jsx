import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Search, User, Menu, X, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, signOut } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Electronics', href: '/category/electronics' },
    { label: 'Fashion', href: '/category/fashion' },
    { label: 'Home', href: '/category/home' },
  ]

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-nav' : 'border-b border-gray-100'}`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-nova-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900">NovaCart</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.href
                    ? 'text-nova-600 bg-nova-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-48 md:w-64 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nova-500"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="btn-ghost ml-1 p-2">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="btn-ghost p-2" aria-label="Search">
                <Search size={20} />
              </button>
            )}

            {/* Cart */}
            <Link to="/cart" className="btn-ghost p-2 relative" aria-label="Cart">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-nova-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="hidden md:flex items-center gap-1">
                <Link to="/account" className="btn-ghost p-2" aria-label="Account">
                  <User size={20} />
                </Link>
                <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary py-2 text-sm">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden btn-ghost p-2"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-nova-600 hover:bg-nova-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              {user ? (
                <div className="flex gap-3">
                  <Link to="/account" className="btn-secondary flex-1 py-2 text-sm">My Account</Link>
                  <button onClick={signOut} className="btn-ghost flex-1 py-2 text-sm">Sign Out</button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" className="btn-secondary flex-1 py-2 text-sm text-center">Sign In</Link>
                  <Link to="/signup" className="btn-primary flex-1 py-2 text-sm text-center">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
