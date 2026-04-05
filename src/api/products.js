import { supabase } from '../lib/supabase'
import { DUMMY_PRODUCTS, DUMMY_CATEGORIES } from '../lib/dummyData'

const USE_DUMMY = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co'

// Helper: Supabase product کو normalize کریں تاکہ باقی code کام کرے
const normalize = (p) => {
  if (!p) return null
  return {
    ...p,
    category: p.categories?.name || p.category || '',
    category_id: p.category_id,
    review_count: p.reviews || p.review_count || 0,
    rating: parseFloat(p.rating) || 0,
  }
}

// ─── Products ──────────────────────────────────────────────────────────────

export const fetchProducts = async ({ category, search, sort } = {}) => {
  if (USE_DUMMY) {
    let products = [...DUMMY_PRODUCTS]
    if (category) products = products.filter(p => p.category.toLowerCase() === category.toLowerCase())
    if (search) products = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'price_asc') products.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price))
    else if (sort === 'price_desc') products.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price))
    else if (sort === 'newest') products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    else if (sort === 'popular') products.sort((a, b) => b.review_count - a.review_count)
    return { data: products, error: null }
  }

  let query = supabase.from('products').select('*, categories(name, slug)')
  if (search) query = query.ilike('title', `%${search}%`)
  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else if (sort === 'popular') query = query.order('reviews', { ascending: false })

  const { data, error } = await query
  let products = (data || []).map(normalize)

  // category filter — Supabase join filter کام نہیں کرتا اس schema میں
  if (category) {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase())
  }

  return { data: products, error }
}

export const fetchProductById = async (id) => {
  if (USE_DUMMY) {
    const product = DUMMY_PRODUCTS.find(p => p.id === id)
    return { data: product || null, error: product ? null : 'Not found' }
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single()
  return { data: normalize(data), error }
}

export const fetchFeaturedProducts = async () => {
  if (USE_DUMMY) {
    return { data: DUMMY_PRODUCTS.filter(p => p.is_featured), error: null }
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_featured', true)
    .limit(4)
  return { data: (data || []).map(normalize), error }
}

export const fetchBestsellerProducts = async () => {
  if (USE_DUMMY) {
    return { data: DUMMY_PRODUCTS.filter(p => p.is_bestseller), error: null }
  }
  // بہترین rated products best sellers کے طور پر دکھائیں
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('reviews', { ascending: false })
    .limit(4)
  return { data: (data || []).map(normalize), error }
}

export const fetchRelatedProducts = async (categoryId, excludeId) => {
  if (USE_DUMMY) {
    const related = DUMMY_PRODUCTS.filter(p => p.category_id === categoryId && p.id !== excludeId).slice(0, 4)
    return { data: related, error: null }
  }
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .limit(4)
  return { data: (data || []).map(normalize), error }
}

// ─── Categories ────────────────────────────────────────────────────────────

export const fetchCategories = async () => {
  if (USE_DUMMY) return { data: DUMMY_CATEGORIES, error: null }
  const { data, error } = await supabase.from('categories').select('*').order('name')
  return { data: data || [], error }
}

// ─── Orders ────────────────────────────────────────────────────────────────

export const createOrder = async ({ userId, items, shippingInfo, subtotal }) => {
  const orderNumber = 'ORD-' + Date.now().toString(36).toUpperCase()

  if (USE_DUMMY) {
    return { data: { id: orderNumber, created_at: new Date().toISOString() }, error: null }
  }

  const { data: order, error: orderError } = await supabase.from('orders').insert({
    user_id: userId || null,
    order_number: orderNumber,
    status: 'confirmed',
    total: subtotal,
    shipping_name: shippingInfo.fullName,
    shipping_email: shippingInfo.email,
    shipping_phone: shippingInfo.phone,
    shipping_address: shippingInfo.address + ', ' + shippingInfo.city + ' ' + shippingInfo.zip,
  }).select().single()

  if (orderError) return { data: null, error: orderError }

  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.discount_price ?? item.price,
    title: item.title,
    image: item.image,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) return { data: null, error: itemsError }

  return { data: { ...order, id: orderNumber }, error: null }
}

export const fetchUserOrders = async (userId) => {
  if (USE_DUMMY) return { data: [], error: null }
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}
