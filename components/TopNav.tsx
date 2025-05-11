"use client";

import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./ShoppingCart";
import { signIn, signOut, useSession } from "next-auth/react";

export default function TopNav() {
  const cartContext = useContext(CartContext);
  const cartItemCount = cartContext
    ? cartContext.cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  const { data: session } = useSession();

  return (
    <nav className="w-full bg-white text-black py-4 px-6">
      <div className="container mx-auto flex justify-between items-center h-full">
        <h1 className="text-lg font-medium tracking-wide uppercase">
          iRacing Clothing
        </h1>
        <ul className="flex space-x-4 text-sm font-light gap-5">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/tshirts" className="hover:underline">
              T-Shirts
            </Link>
          </li>
          <li>
            <Link href="/cart" className="hover:underline">
              Cart ({cartItemCount})
            </Link>
          </li>
          <li>
            <Link href="/account" className="hover:underline">
              Account
            </Link>
          </li>
          <li>
            {session ? (
              <a onClick={() => signOut()} className="hover:underline">
                Logout
              </a>
            ) : (
              <a onClick={() => signIn()} className="hover:underline">
                Login
              </a>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
