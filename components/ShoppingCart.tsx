"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import tshirts from "@/json/tshirts.json";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  quantity: number;
  stripePriceId?: string; // Added Stripe Price ID
}

interface CartContextType {
  cartItems: CartItem[];
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function ShoppingCartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  // Wrapped 'updateTotal' in a useCallback hook to prevent it from changing on every render
  const updateTotal = useCallback(() => {
    const newTotal = cartItems.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
    console.log("Updated cart items:", cartItems);
    console.log("Updated total:", newTotal);
  }, [cartItems]);

  // Wrapped 'saveCart' in a useCallback hook to prevent it from changing on every render
  const saveCart = useCallback(
    (items: CartItem[] = cartItems) => {
      localStorage.setItem("cartItems", JSON.stringify(items));
    },
    [cartItems]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  }, []);

  useEffect(() => {
    updateTotal();
  }, [updateTotal]);

  useEffect(() => {
    saveCart();
  }, [saveCart]);

  const addToCart = (item: CartItem) => {
    const tshirt = tshirts.find((t) => t.id === item.id);
    if (!tshirt) {
      console.error(`T-shirt with ID ${item.id} not found in tshirts.json`);
      return;
    }

    const existingItem = cartItems.find(
      (i) =>
        i.id === item.id &&
        i.sizes[0] === item.sizes[0] &&
        i.colors[0] === item.colors[0]
    );

    if (existingItem) {
      const updatedItems = cartItems.map((i) =>
        i.id === item.id &&
        i.sizes[0] === item.sizes[0] &&
        i.colors[0] === item.colors[0]
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
      setCartItems(updatedItems);
      saveCart(updatedItems);
    } else {
      const newCartItems = [
        ...cartItems,
        {
          ...item,
          price: tshirt.price, // Assign price from tshirts.json
          quantity: 1,
        },
      ];
      setCartItems(newCartItems);
      saveCart(newCartItems);
    }
  };

  const removeFromCart = (itemId: number) => {
    setCartItems((prevCartItems) => {
      const updatedItems = prevCartItems.filter((item) => item.id !== itemId);
      saveCart(updatedItems);
      return updatedItems;
    });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    saveCart(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    setTotal(0);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a ShoppingCartProvider");
  }
  return context;
};

// Refactored functions to follow React Hook rules by renaming them to start with 'use'
export function useGetCartItems() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useGetCartItems must be used within a ShoppingCartProvider"
    );
  }
  return context.cartItems;
}

export function useGetTotal() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useGetTotal must be used within a ShoppingCartProvider");
  }
  return context.total;
}

export function useAddToCart(item: CartItem) {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useAddToCart must be used within a ShoppingCartProvider");
  }
  context.addToCart(item);
}

export function useRemoveFromCart(itemId: number) {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useRemoveFromCart must be used within a ShoppingCartProvider"
    );
  }
  context.removeFromCart(itemId);
}

export function useUpdateQuantity(itemId: number, quantity: number) {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useUpdateQuantity must be used within a ShoppingCartProvider"
    );
  }
  context.updateQuantity(itemId, quantity);
}

export function useClearCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useClearCart must be used within a ShoppingCartProvider");
  }
  context.clearCart();
}

export { CartContext };
