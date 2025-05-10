"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/components/ShoppingCart";
import Link from "next/link";
import Image from "next/image";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  console.log("Cart Items:", cartItems);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const stripe = await stripePromise;

      // Fetch the Stripe Checkout Session
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: cartItems.map((item) => ({
            name: item.name, // Include the name field
            size: item.sizes[0], // Include the size field
            color: item.colors[0], // Include the color field
            priceId: item.stripePriceId, // Use Stripe Price ID
            quantity: item.quantity,
          })),
          currency: "usd", // Ensure currency is included in the request
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      if (!sessionId) {
        throw new Error("Session ID not found in the response");
      }

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (!error) {
          // Clear the cart on successful redirection to Stripe Checkout
          localStorage.removeItem("cartItems");
        } else {
          console.error("Stripe error:", error);
        }
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An unknown error occurred during checkout."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">Your cart is empty</p>
          <Link
            href="/tshirts"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.sizes[0]}-${item.colors[0]}`}
              className="border-b py-4 flex items-center gap-4"
            >
              <div className="relative w-24 h-24">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Size: {item.sizes[0]}</p>
                <p>Color: {item.colors[0]}</p>
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </form>
      )}
    </div>
  );
}
