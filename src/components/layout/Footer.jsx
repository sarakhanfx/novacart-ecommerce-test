import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-nova-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-xl text-white">NovaCart</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Smart Shopping, Better Living. Curated products across electronics, fashion, home, and more.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-nova-600 transition-all duration-200"
                  aria-label="Social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'All Products', href: '/shop' },
                { label: 'Electronics', href: '/category/electronics' },
                { label: 'Fashion', href: '/category/fashion' },
                { label: 'Home', href: '/category/home' },
                { label: 'Beauty', href: '/category/beauty' },
                { label: 'Sports', href: '/category/sports' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Contact Us', href: '/contact' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Shipping Policy', href: '/shipping' },
                { label: 'Return Policy', href: '/returns' },
                { label: 'Track Order', href: '/account' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Careers', href: '/careers' },
              ].map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter mini */}
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Newsletter</h3>
              <form onSubmit={e => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-nova-500"
                />
                <button type="submit" className="p-2 bg-nova-600 rounded-lg hover:bg-nova-700 transition-colors" aria-label="Subscribe">
                  <Mail size={16} className="text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} NovaCart. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">We accept:</span>
            {['Visa', 'Mastercard', 'PayPal', 'Amex'].map(m => (
              <span key={m} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400 font-medium">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
