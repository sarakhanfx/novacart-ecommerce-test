import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AccountPage from './pages/AccountPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import NotFoundPage from './pages/NotFoundPage'

import AdminGuard from './admin/components/AdminGuard'
import AdminLayout from './admin/components/layout/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminProducts from './admin/pages/AdminProducts'
import AdminOrders from './admin/pages/AdminOrders'
import AdminCustomers from './admin/pages/AdminCustomers'
import AdminCategories from './admin/pages/AdminCategories'
import AdminAnalytics from './admin/pages/AdminAnalytics'
import AdminSettings from './admin/pages/AdminSettings'

export default function App() {
  return (
    <BrowserRouter basename="/novacart">
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* existing routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
            <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/signup" element={<Layout><SignupPage /></Layout>} />
            <Route path="/account" element={<Layout><AccountPage /></Layout>} />
            <Route path="/order-confirmation" element={<Layout><OrderConfirmationPage /></Layout>} />
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />

            {/* admin routes */}
            <Route path="/admin" element={<AdminGuard><AdminLayout><AdminDashboard /></AdminLayout></AdminGuard>} />
            <Route path="/admin/products" element={<AdminGuard><AdminLayout><AdminProducts /></AdminLayout></AdminGuard>} />
            <Route path="/admin/orders" element={<AdminGuard><AdminLayout><AdminOrders /></AdminLayout></AdminGuard>} />
            <Route path="/admin/customers" element={<AdminGuard><AdminLayout><AdminCustomers /></AdminLayout></AdminGuard>} />
            <Route path="/admin/categories" element={<AdminGuard><AdminLayout><AdminCategories /></AdminLayout></AdminGuard>} />
            <Route path="/admin/analytics" element={<AdminGuard><AdminLayout><AdminAnalytics /></AdminLayout></AdminGuard>} />
            <Route path="/admin/settings" element={<AdminGuard><AdminLayout><AdminSettings /></AdminLayout></AdminGuard>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}