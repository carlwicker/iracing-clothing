"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  quantity: number;
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
  }, [cartItems]);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
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
      const newCartItems = [...cartItems, { ...item, quantity: 1 }];
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

  const updateTotal = () => {
    const newTotal = cartItems.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
    console.log("Updated cart items:", cartItems);
    console.log("Updated total:", newTotal);
  };

  const saveCart = (items: CartItem[] = cartItems) => {
    localStorage.setItem("cartItems", JSON.stringify(items));
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

// Remove the default export since we don't need it
// The functionality is now provided through the context
// All components that need cart functionality should use the useCart hook or be wrapped in ShoppingCartProvider

// Export the cart methods as a separate object
export const cart = {
  getCartItems: () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("cart must be used within a ShoppingCartProvider");
    }
    return context.cartItems;
  },
  getTotal: () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("cart must be used within a ShoppingCartProvider");
    }
    return context.total;
  },
  addToCart: (item: CartItem) => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("cart must be used within a ShoppingCartProvider");
    }
    context.addToCart(item);
  },
  removeFromCart: (itemId: number) => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("cart must be used within a ShoppingCartProvider");
    }
    context.removeFromCart(itemId);
  },
  updateQuantity: (itemId: number, quantity: number) => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("cart must be used within a ShoppingCartProvider");
    }
    context.updateQuantity(itemId, quantity);
  },
  clearCart: () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("cart must be used within a ShoppingCartProvider");
    }
    context.clearCart();
  },
};

export { CartContext };
