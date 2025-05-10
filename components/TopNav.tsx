"use client";

import Link from "next/link";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "./ShoppingCart";

export default function TopNav() {
  const cartContext = useContext(CartContext);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (cartContext) {
      const count = cartContext.cartItems.reduce(
        (total: number, item: { quantity: number }) => total + item.quantity,
        0
      );
      setCartItemCount(count);
    }
  }, [cartContext]);

  return (
    <nav className="w-full bg-white text-black py-4 px-6">
      <div className="container mx-auto flex justify-between items-center h-full">
        <h1 className="text-lg font-medium tracking-wide uppercase">
          iRacing Clothing
        </h1>
        <ul className="flex space-x-4 text-sm font-light gap-5">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/tshirts" className="hover:underline">
              T-Shirts
            </a>
          </li>
          <li>
            <a href="/cart" className="hover:underline">
              Cart ({cartItemCount})
            </a>
          </li>
          <li>
            <a href="/account" className="hover:underline">
              Account
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
