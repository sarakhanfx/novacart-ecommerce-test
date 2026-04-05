// Format price as USD currency string
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Calculate discount percentage
export const getDiscountPercent = (original, discounted) => {
  if (!discounted) return 0
  return Math.round(((original - discounted) / original) * 100)
}

// Truncate text with ellipsis
export const truncate = (str, maxLength = 80) => {
  if (!str) return ''
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str
}

// Combine class names (lightweight clsx alternative)
export const cn = (...classes) => classes.filter(Boolean).join(' ')

// Generate a slug from a string
export const slugify = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

// Format date string
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

// Generate order ID
export const generateOrderId = () => {
  return 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase()
}

// Debounce function
export const debounce = (fn, delay) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
