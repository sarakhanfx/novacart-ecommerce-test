import { supabase } from '../../lib/supabase'

export async function getDashboardStats() {
  const [ordersRes, productsRes] = await Promise.all([
    supabase.from('orders').select('id, total, created_at, status'),
    supabase.from('products').select('id'),
  ])
  const orders = ordersRes.data || []
  const revenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0)
  return {
    totalRevenue: revenue,
    totalOrders: orders.length,
    totalProducts: (productsRes.data || []).length,
    totalCustomers: 0,
    recentOrders: orders.slice(-5).reverse(),
    orders
  }
}

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createProduct(product) {
  const { data, error } = await supabase.from('products').insert([product]).select()
  if (error) throw error
  return data[0]
}

export async function updateProduct(id, product) {
  const { data, error } = await supabase.from('products').update(product).eq('id', id).select()
  if (error) throw error
  return data[0]
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select()
  if (error) throw error
  return data[0]
}

export async function getCustomers() {
  const { data, error } = await supabase
    .from('orders')
    .select('user_id, total')
  if (error) throw error
  const map = {}
  ;(data || []).forEach(o => {
    const uid = o.user_id
    if (!map[uid]) {
      map[uid] = {
        user_id: uid,
        email: uid,
        full_name: 'Customer',
        total_orders: 0,
        total_spent: 0
      }
    }
    map[uid].total_orders++
    map[uid].total_spent += parseFloat(o.total) || 0
  })
  return Object.values(map)
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw error
  return data
}

export async function createCategory(cat) {
  const { data, error } = await supabase.from('categories').insert([cat]).select()
  if (error) throw error
  return data[0]
}

export async function updateCategory(id, cat) {
  const { data, error } = await supabase.from('categories').update(cat).eq('id', id).select()
  if (error) throw error
  return data[0]
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').single()
  if (error) throw error
  return data
}

export async function updateSettings(id, settings) {
  const { data, error } = await supabase
    .from('settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}