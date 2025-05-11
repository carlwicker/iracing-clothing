"use client";

import { useCart } from "@/components/ShoppingCart";
import Image from "next/image";

export default function CartPage() {
  const { cartItems, total, removeFromCart, clearCart, addToCart } = useCart();

  console.log("Cart Items:", cartItems);
  console.log("Total:", total);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div>
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                    priority={true}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.sizes[0]}</p>
                  <p>Color: {item.colors[0]}</p>
                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.sizes[0], item.colors[0])
                    }
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        description: item.description,
                        colors: item.colors,
                        sizes: item.sizes,
                        quantity: 1,
                      })
                    }
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add Another
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <p className="text-lg font-bold">Total: ${total}</p>
              <button
                onClick={clearCart}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Clear Cart
              </button>
              <button
                onClick={() => (window.location.href = "/checkout")}
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
