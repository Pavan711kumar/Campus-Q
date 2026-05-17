import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(item) {
    setItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
      }
      return [...current, { ...item, quantity: 1 }];
    });
  }

  function decreaseItem(id) {
    setItems((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
      .filter((item) => item.quantity > 0));
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const value = useMemo(() => ({ items, addItem, decreaseItem, removeItem, clearCart, total }), [items, total]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
