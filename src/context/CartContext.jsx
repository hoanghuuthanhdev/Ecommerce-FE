import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CART_STORAGE_KEY = "ecommerce-frontend-cart";

const CartContext = createContext(null);

function readStoredCart() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStoredCart());

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const addItem = (product, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }

        return [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            currency: product.currency || "USD",
            image: product.image,
            category: product.category,
            brand: product.brand,
            productAvailable: product.productAvailable,
            stockQuantity: product.stockQuantity,
            quantity,
          },
        ];
      });
    };

    const updateQuantity = (id, quantity) => {
      setItems((current) =>
        current
          .map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    };

    const removeItem = (id) => {
      setItems((current) => current.filter((item) => item.id !== id));
    };

    const clearCart = () => setItems([]);

    return {
      items,
      itemCount,
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}
