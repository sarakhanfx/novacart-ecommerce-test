import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

const STORAGE_KEY = 'novacart_cart'

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id
              ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
      }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }

    case 'UPDATE_QUANTITY': {
      if (action.quantity < 1) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id
            ? { ...i, quantity: Math.min(action.quantity, i.stock) }
            : i
        ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'LOAD_CART':
      return { ...state, items: action.items }

    default:
      return state
  }
}

const initialState = { items: [] }

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        dispatch({ type: 'LOAD_CART', items: JSON.parse(saved) })
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Persist cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', product })
    toast.success(`${product.title} added to cart`)
  }

  const removeItem = (id) => {
    dispatch({ type: 'REMOVE_ITEM', id })
    toast.success('Item removed from cart')
  }

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  const subtotal = state.items.reduce((sum, i) => {
    const price = i.discount_price ?? i.price
    return sum + price * i.quantity
  }, 0)

  const value = {
    items: state.items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
